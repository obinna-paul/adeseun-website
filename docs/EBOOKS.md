# E-book infrastructure

## Architecture

The e-book system has four boundaries:

1. Paystack confirms payment. The webhook grants a Redis entitlement only after Paystack verifies the transaction.
2. Cloudflare R2 stores private source PDFs, rendered page images, and manifests. The bucket must not expose a public development URL or public custom domain.
3. The website authorizes every reader page request, fetches the private page from R2, adds a purchaser-specific watermark, and returns only that page.
4. An on-demand GitHub Actions job converts large PDFs into optimized WebP pages. Large conversion work never runs inside a website request.

The browser never receives the source PDF or an R2 credential.

## Purchase and reader flow

1. The buyer chooses **Read online**, enters a name and email, and the website initializes a Paystack transaction with the book, format, price, and buyer details in server-created metadata.
2. Paystack collects payment on its hosted checkout page. The website never handles card details.
3. A successful charge is fulfilled through two safe paths that share the same idempotent service:
   - Paystack sends `charge.success` to `https://www.adeseunoyeneye.com/api/paystack/webhook`.
   - Paystack returns the buyer to `/checkout/thank-you?reference=...`, where the server verifies the reference directly with Paystack.
4. Only after verification of the status, amount, currency, book, format, and publication does the website grant the permanent Redis entitlement.
5. The return flow signs an e-book buyer into the reader immediately when the browser still has the HTTP-only checkout-intent cookie created before the Paystack redirect. The confirmation page shows the amount and Paystack reference and links straight to the purchased book, so the original checkout tab does not depend on email delivery. A copied reference alone cannot create a reader session.
6. Resend sends the buyer a confirmation with a 15-minute private sign-in link. It also sends the owner notification. E-book purchases never notify the printer.
7. A returning reader enters the purchase email at `/read`. If the webhook was missed and no entitlement exists yet, the server asks Paystack for that customer's recent successful e-book transactions, verifies each candidate, repairs the entitlement, and sends the link.

### Production configuration checklist

- `PAYSTACK_SECRET_KEY` is set for the same Paystack mode used by checkout (live or test).
- The matching Paystack dashboard webhook URL is exactly `https://www.adeseunoyeneye.com/api/paystack/webhook`. Avoid relying on an apex-to-`www` redirect for a POST webhook.
- `RESEND_API_KEY` is set and `adeseunoyeneye.com` remains verified in Resend for `order@adeseunoyeneye.com`.
- One supported Redis URL/token pair is set (`UPSTASH_REDIS_REST_*`, `KV_REST_API_*`, or `ADESEUN_WEBSITE_KV_REST_API_*`).
- `READER_SESSION_SECRET` is at least 32 characters and stable across deployments.
- `NEXT_PUBLIC_SITE_URL` uses the public HTTPS origin.

When a paid order is reported without access, check Paystack's webhook event log first. A failed event records the response status and can be resent after configuration is corrected. The reader email recovery path handles the buyer-facing repair without exposing whether arbitrary email addresses have purchased a book.

## Cloudflare R2 setup

Create one private R2 bucket and an S3 API token scoped to that bucket. Add the values shown in `.env.example` to both the website and the processor service.

Direct browser uploads use signed multipart `PUT` requests. Configure the bucket CORS policy with the real production and local origins:

```json
[
  {
    "AllowedOrigins": [
      "https://adeseunoyeneye.com",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Cloudflare recommends multipart upload for large files because failed parts can be retried without restarting the whole file. R2 currently supports up to 10,000 parts and objects up to 5 TiB. See the official [R2 upload guide](https://developers.cloudflare.com/r2/objects/upload-objects/) and [R2 limits](https://developers.cloudflare.com/r2/platform/limits/).

## Free processor setup

The website dispatches `.github/workflows/process-ebook.yml` after a PDF upload. GitHub creates a temporary Ubuntu runner, installs Poppler, downloads the private source PDF, renders one page at a time, converts each page to WebP, uploads the pages, writes a manifest, marks the publication `published`, deletes the large source PDF to conserve the R2 free storage allowance, and then destroys the runner.

Add these repository Actions secrets in GitHub under **Settings → Secrets and variables → Actions**:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `EBOOK_PROCESSOR_SECRET`

The workflow reports publication status to the website through an authenticated callback, so Redis credentials remain only in Vercel and are not duplicated in GitHub.

Create a fine-grained GitHub personal access token restricted to `obinna-paul/adeseun-website` with **Actions: Read and write** permission. Add it only to Vercel as `GITHUB_ACTIONS_TOKEN`. Also add the non-secret variables `GITHUB_REPOSITORY=obinna-paul/adeseun-website`, `GITHUB_EBOOK_WORKFLOW=process-ebook.yml`, and `GITHUB_EBOOK_REF=main` to Vercel.

The workflow file must first be deployed on the default branch before the website can dispatch it. Standard GitHub-hosted runners are free for public repositories. Private repositories use the account's included monthly Actions minutes. Do not enable paid overages if the requirement is a hard zero-cost ceiling.

A replacement is written to versioned object keys, so the previously published edition stays readable until the new manifest is ready and becomes live atomically. If processing fails, the source PDF is retained so **Restart processing** can retry it. After a successful publication, the source is deleted; reprocessing that edition later requires uploading the PDF again.

`Dockerfile.ebook-processor` and `EBOOK_PROCESSOR_URL` remain available only as an optional self-hosted fallback. They are not needed for the GitHub Actions path.

For a manual processing run:

```bash
npm run ebook:process -- --book-id people-we-never-meet --source-key ebooks/sources/people-we-never-meet/source.pdf
```

The machine running that command needs `pdfinfo` and `pdftoppm` from Poppler.

## Publishing workflow

1. Set all required environment variables.
2. Open `/admin/ebooks` and sign in with `EBOOK_ADMIN_SECRET`.
3. Choose the matching catalog book, enter the e-book price, and upload the PDF.
4. Keep the tab open while the resumable multipart upload completes.
5. GitHub Actions publishes the rendered pages. Refresh the admin page to see the final state.
6. Once status is `published`, the online-reading purchase option appears automatically in The Library.

## Reader protection

- Original PDFs are private and never delivered to the browser.
- Every page request requires a signed reader session and a matching permanent entitlement.
- Returned page images have purchaser-specific visible watermarks and `private, no-store` caching.
- The reader disables ordinary dragging, context menus, selection, and printing as deterrents.
- Request throttling makes bulk page scraping harder.

No normal website can prevent operating-system screenshots, photographs of the screen, or a determined purchaser from reconstructing content they are allowed to view. The system therefore combines access control, page-by-page delivery, rate limits, and attribution rather than making an impossible DRM promise.
