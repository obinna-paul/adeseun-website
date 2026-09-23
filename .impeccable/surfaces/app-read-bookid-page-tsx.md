---
version: 1
slug: "app-read-bookid-page-tsx"
primary_target: "app/read/[bookId]/page.tsx"
related_targets: ["app/books/page.tsx","app/admin/ebooks/page.tsx","components/reader/EbookReader.tsx"]
---

# E-book purchase and reader

- Scope and mode: Operate + Read. Covers e-book discovery in the Library, format selection at checkout, passwordless access, the protected reader, and the private publishing console.
- Audience and job: Buyers choose the digital edition, pay, open their private library, and continue from the last saved page. The publisher uploads very large source PDFs, sets prices, and sees processing state.
- Primary actions: Buy “Read online”; request a private sign-in link; move between pages; upload and process a source PDF.
- Proof and content: Real catalog books and covers, explicit edition prices, publication state, page count, saved progress, and purchaser-attributed page watermarks.
- Constraints: Preserve the incumbent ivory/emerald/brass editorial system. Keep reader controls familiar, keyboard-accessible, and compact. Originals remain private; pages are authorized individually. Screenshot blocking is a deterrence claim only, never a guarantee. Large uploads go directly to private object storage in resumable parts.
- Direction: A quiet full-screen reading desk—one centered page, a compact title/zoom rail above, and a progress/navigation rail below. The interface recedes behind the page while remaining usable on mobile.
- Memorable moment: A buyer returns through an email link and lands exactly on the page where they stopped.
- Unresolved decisions: Final e-book prices, production storage/processor hosts, environment secrets, and the source PDFs themselves.
