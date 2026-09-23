# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Visitors exploring Adeseun Oyeneye's professional work and published books.
- Book buyers in Nigeria purchasing either a delivered paperback or access to an online e-book.
- Returning e-book readers who need to continue from their last saved page across visits and devices.
- A small trusted publishing team that uploads and publishes e-book files.

## Product Purpose

The site presents Adeseun Oyeneye's executive profile, work, media, and library. The Library supports direct book sales through Paystack. Paperback orders are fulfilled through printing and delivery; e-book orders grant durable, account-light access to a private browser reader.

Success means a buyer can choose the appropriate format, pay securely, receive the correct fulfillment, and return to an e-book without losing their place.

## Positioning

The Library is both a storefront and a private reading room inside Adeseun's existing personal-professional site. E-books are read in the browser through purchase-gated page delivery rather than distributed as downloadable source files.

## Operating Context

- Paystack hosts payment collection and its verified webhook is the source of truth for a successful purchase.
- Resend sends order confirmations, fulfillment notices, and passwordless reader access links.
- Upstash Redis stores order state, e-book publication state, reader entitlements, access tokens, and reading progress.
- Large source PDFs can be 200-500 MB and contain full-color pages.
- Trusted staff upload source PDFs through a protected website screen using direct multipart object-storage uploads.
- A separate processing job converts source PDFs into optimized page images and a manifest before an e-book is published.

## Capabilities and Constraints

- Buyers choose paperback or e-book before payment.
- Paperback checkout requires delivery details and retains the existing printer-notification workflow.
- E-book checkout requires only the buyer's name and email, grants access after verified payment, and does not notify the printer.
- Readers authenticate through short-lived email links and a signed, HTTP-only browser session.
- Reading progress is stored server-side and restored on return.
- Original PDFs remain private and are never sent to a reader's browser.
- Reader pages are authorized per request and visibly watermarked for the purchaser.
- Browser controls can deter casual saving, printing, and redistribution, but no web product can guarantee prevention of operating-system screenshots or photography of the screen.
- E-book price and publication status are set per book by the publishing team; no price is inferred from the paperback price.
- The exact e-book prices, the initial books to publish, and the production host for the PDF-processing worker remain open operational decisions.

## Brand Commitments

- Preserve the established "Ivory Atrium & Emerald Brass" visual system, typography, book covers, and editorial voice.
- The reader should feel quiet, literary, and focused. Product controls recede behind the page being read.
- The public route remains `/books`, retaining the name "The Library."

## Evidence on Hand

- Thirteen real book records and cover assets in `components/sections/library/library-content.ts` and `public/images/`.
- Existing Paystack checkout and verified webhook fulfillment in `app/api/checkout/` and `app/api/paystack/webhook/`.
- Existing Redis order log in `lib/orders.ts`.
- Existing Resend wrapper in `lib/resend.ts`.
- No source e-book PDFs or confirmed e-book prices are currently present in the repository.

## Product Principles

1. Payment verification precedes every entitlement or fulfillment action.
2. Readers receive access, not source files.
3. Progress and access survive ordinary return visits and work across devices through email sign-in.
4. Large uploads bypass the application server and remain resumable.
5. Protection measures stay honest: deter redistribution without claiming impossible screenshot prevention.

## Accessibility & Inclusion

The purchase and reading flows must be keyboard accessible, work on phone and desktop, respect reduced-motion preferences, expose meaningful labels and status messages, and keep text and controls at WCAG AA contrast.
