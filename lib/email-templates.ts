import { formatCopyCount } from "@/lib/checkout-quantity";

type EmailTemplate = {
  subject: string;
  text: string;
  html: string;
};

type OrderEmailInput = {
  bookTitle: string;
  customerName: string;
  amount: string;
  unitPrice: string;
  quantity: number;
  reference: string;
  format: "ebook" | "paperback";
  readerAccessUrl?: string;
  libraryUrl: string;
  coverUrl?: string;
  address?: string;
};

type OwnerOrderEmailInput = OrderEmailInput & {
  customerEmail: string;
  customerPhone?: string;
};

type PrinterEmailInput = {
  bookTitle: string;
  quantity: number;
  reference: string;
  customerName: string;
  customerPhone: string;
  address: string;
  pageCount: string;
  trimSize: string;
  binding: string;
  notes?: string;
};

const COLORS = {
  ground: "#f8f4ec",
  surface: "#fffdf8",
  surfaceSunken: "#efe8dc",
  text: "#291f19",
  textSubdued: "#665950",
  textFaint: "#827268",
  hero: "#0b1712",
  emerald: "#1f573e",
  emeraldTint: "#edf6f0",
  brass: "#7a5b2b",
  brassTint: "#f4eddc",
  line: "#ded2c1",
} as const;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "Reader";
}

function detailRows(rows: Array<[string, string]>): string {
  return rows
    .map(
      ([label, value]) => `
        <tr>
          <td class="detail-label" style="padding:10px 12px 10px 0;border-bottom:1px solid ${COLORS.line};font-family:Arial,sans-serif;font-size:11px;line-height:16px;letter-spacing:1.2px;text-transform:uppercase;color:${COLORS.textFaint};vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid ${COLORS.line};font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:21px;color:${COLORS.text};text-align:right;vertical-align:top;word-break:break-word;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");
}

function callout(title: string, copy: string): string {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0 0;background:${COLORS.emeraldTint};border-left:3px solid ${COLORS.emerald};">
      <tr>
        <td style="padding:16px 18px;">
          <p style="margin:0 0 3px;font-family:Arial,sans-serif;font-size:11px;line-height:16px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:${COLORS.emerald};">${escapeHtml(title)}</p>
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:23px;color:${COLORS.textSubdued};">${escapeHtml(copy)}</p>
        </td>
      </tr>
    </table>`;
}

function emailShell(input: {
  preheader: string;
  eyebrow: string;
  title: string;
  body: string;
  action?: { label: string; url: string };
  afterAction?: string;
}): string {
  const action = input.action
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="action-table" style="margin:30px 0 8px;">
        <tr>
          <td bgcolor="${COLORS.emerald}" style="border-radius:999px;">
            <a href="${escapeHtml(input.action.url)}" target="_blank" style="display:inline-block;padding:15px 26px;border:1px solid ${COLORS.emerald};border-radius:999px;font-family:Arial,sans-serif;font-size:13px;line-height:18px;font-weight:bold;letter-spacing:.4px;color:#ffffff;text-decoration:none;">${escapeHtml(input.action.label)} &nbsp;&rarr;</a>
          </td>
        </tr>
      </table>`
    : "";

  const afterAction = input.afterAction
    ? `<div style="margin-top:20px;font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:22px;color:${COLORS.textFaint};">${input.afterAction}</div>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>${escapeHtml(input.title)}</title>
    <style>
      body { margin: 0 !important; padding: 0 !important; width: 100% !important; background: ${COLORS.ground}; }
      table { border-collapse: collapse; }
      img { border: 0; display: block; height: auto; }
      a { color: ${COLORS.emerald}; }
      @media only screen and (max-width: 620px) {
        .email-pad { padding-left: 22px !important; padding-right: 22px !important; }
        .email-card { width: 100% !important; }
        .headline { font-size: 36px !important; line-height: 39px !important; }
        .action-table, .action-table tbody, .action-table tr, .action-table td { width: 100% !important; }
        .action-table a { display: block !important; text-align: center !important; }
        .cover-cell { display: block !important; width: 100% !important; padding: 0 0 20px !important; }
        .cover-cell img { width: 108px !important; margin: 0 auto !important; }
        .summary-cell { display: block !important; width: 100% !important; }
        .detail-label { width: 38% !important; }
      }
    </style>
  </head>
  <body>
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(input.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:${COLORS.ground};">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="email-card" style="width:600px;max-width:600px;background:${COLORS.surface};border:1px solid ${COLORS.line};">
            <tr>
              <td class="email-pad" style="padding:24px 44px;background:${COLORS.hero};border-bottom:3px solid ${COLORS.brass};">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="44" style="width:44px;">
                      <div style="width:38px;height:38px;border:1px solid ${COLORS.brass};border-radius:50%;font-family:Georgia,'Times New Roman',serif;font-size:23px;line-height:38px;font-style:italic;text-align:center;color:#f8f4ec;">A</div>
                    </td>
                    <td style="font-family:Arial,sans-serif;font-size:10px;line-height:15px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#f8f4ec;">Adeseun Oyeneye<br><span style="color:#bda671;font-weight:normal;letter-spacing:1.5px;">The Library</span></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-pad" style="padding:46px 44px 42px;">
                <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:11px;line-height:16px;font-weight:bold;letter-spacing:1.8px;text-transform:uppercase;color:${COLORS.brass};">${escapeHtml(input.eyebrow)}</p>
                <h1 class="headline" style="margin:0 0 22px;font-family:Georgia,'Times New Roman',serif;font-size:44px;line-height:47px;font-weight:normal;letter-spacing:-1px;color:${COLORS.text};">${escapeHtml(input.title)}</h1>
                ${input.body}
                ${action}
                ${afterAction}
              </td>
            </tr>
            <tr>
              <td class="email-pad" style="padding:24px 44px;background:${COLORS.surfaceSunken};border-top:1px solid ${COLORS.line};">
                <p style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:22px;font-style:italic;color:${COLORS.textSubdued};">A room for ideas, perspective, and the next chapter.</p>
                <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;line-height:16px;letter-spacing:1px;text-transform:uppercase;color:${COLORS.textFaint};">Adeseun Oyeneye &nbsp;&middot;&nbsp; The Library</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function orderSummary(input: OrderEmailInput): string {
  const cover = input.coverUrl
    ? `<td width="116" class="cover-cell" style="width:116px;padding:0 22px 0 0;vertical-align:top;"><img src="${escapeHtml(input.coverUrl)}" width="94" alt="Cover of ${escapeHtml(input.bookTitle)}" style="width:94px;max-width:94px;border:1px solid ${COLORS.line};box-shadow:0 8px 18px rgba(41,31,25,.12);"></td>`
    : "";

  const rows: Array<[string, string]> = [];
  if (input.format === "paperback") {
    rows.push(["Quantity", formatCopyCount(input.quantity)], ["Unit price", input.unitPrice]);
  }
  rows.push(["Amount paid", input.amount], ["Reference", input.reference]);

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 0;padding:20px;background:${COLORS.brassTint};border:1px solid ${COLORS.line};">
      <tr>
        ${cover}
        <td class="summary-cell" style="vertical-align:top;">
          <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:10px;line-height:15px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:${COLORS.brass};">Your ${input.format === "ebook" ? "e-book" : "paperback"}</p>
          <p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:21px;line-height:25px;color:${COLORS.text};">${escapeHtml(input.bookTitle)}</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            ${detailRows(rows)}
          </table>
        </td>
      </tr>
    </table>`;
}

export function readerAccessEmail(link: string): EmailTemplate {
  const subject = "The Library is open — your private sign-in link";
  const text = [
    "The Library is open.",
    "",
    "Your books and saved reading place are ready when you are. Use the private link below to return to your reading room:",
    "",
    link,
    "",
    "For your security, this link is valid for 3 days and can be used once. If it expires, request a new one from the reading room.",
  ].join("\n");

  const html = emailShell({
    preheader: "Your books are waiting. This private link is valid for 3 days.",
    eyebrow: "Your private invitation",
    title: "Come back to your books.",
    body: `<p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:29px;color:${COLORS.textSubdued};">Your Library, your books, and your saved reading place are ready when you are. Step back in and continue where you left off.</p>${callout("A note on access", "For your security, this link is valid for 3 days and can be used once. If it expires, simply request a new one from the reading room.")}`,
    action: { label: "Open my reading room", url: link },
    afterAction: `If the button does not work, copy and paste this address into your browser:<br><a href="${escapeHtml(link)}" style="color:${COLORS.emerald};word-break:break-all;">${escapeHtml(link)}</a>`,
  });

  return { subject, text, html };
}

export function customerOrderEmail(input: OrderEmailInput): EmailTemplate {
  const name = firstName(input.customerName);

  if (input.format === "ebook") {
    const readerAccessUrl = input.readerAccessUrl ?? input.libraryUrl;
    const subject = `Your reading room is ready — ${input.bookTitle}`;
    const text = [
      `Hello ${name},`,
      "",
      "Payment confirmed — your next chapter is waiting.",
      `${input.bookTitle} is now in your private Library.`,
      "",
      `Open your reading room: ${readerAccessUrl}`,
      "",
      "For your security, this link is valid for 3 days and can be used once. If it expires, request a fresh link from the reading room.",
      "",
      `Amount paid: ${input.amount}`,
      `Payment reference: ${input.reference}`,
    ].join("\n");

    const html = emailShell({
      preheader: `Payment confirmed. ${input.bookTitle} is ready to read.`,
      eyebrow: "Payment confirmed · Your book is ready",
      title: "Your next chapter is waiting.",
      body: `<p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:29px;color:${COLORS.textSubdued};">Hello ${escapeHtml(name)},</p><p style="margin:12px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:29px;color:${COLORS.textSubdued};"><em>${escapeHtml(input.bookTitle)}</em> has been added to your private Library. Settle in, open the book, and begin wherever curiosity leads.</p>${orderSummary(input)}${callout("Your link, your access", "This private link is valid for 3 days and can be used once. If it expires, visit the reading room and we will send you a fresh one.")}`,
      action: { label: "Enter your reading room", url: readerAccessUrl },
      afterAction: `Need a fresh link later? Visit <a href="${escapeHtml(input.libraryUrl)}" style="color:${COLORS.emerald};">your reading room</a> and use the email from this order.`,
    });

    return { subject, text, html };
  }

  const subject = `${input.quantity === 1 ? "Your copy is" : "Your copies are"} being prepared — ${input.bookTitle}`;
  const address = input.address ?? "Address supplied at checkout";
  const copyCount = formatCopyCount(input.quantity);
  const text = [
    `Hello ${name},`,
    "",
    `Your order is confirmed, and ${copyCount} ${input.quantity === 1 ? "is" : "are"} being prepared.`,
    `Book: ${input.bookTitle}`,
    `Quantity: ${copyCount}`,
    `Unit price: ${input.unitPrice}`,
    `Amount paid: ${input.amount}`,
    `Payment reference: ${input.reference}`,
    "",
    "Delivery address:",
    address,
    "",
    "Please allow 7–10 business days for delivery.",
  ].join("\n");

  const html = emailShell({
    preheader: `Order confirmed. ${copyCount} of ${input.bookTitle} ${input.quantity === 1 ? "is" : "are"} being prepared.`,
    eyebrow: `Order confirmed · ${input.quantity === 1 ? "Your copy is" : "Your copies are"} in motion`,
    title: input.quantity === 1 ? "A new book is on its way." : "Your new books are on their way.",
    body: `<p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:29px;color:${COLORS.textSubdued};">Hello ${escapeHtml(name)},</p><p style="margin:12px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:29px;color:${COLORS.textSubdued};">Thank you for choosing <em>${escapeHtml(input.bookTitle)}</em>. Your order is confirmed, and ${escapeHtml(copyCount)} ${input.quantity === 1 ? "is" : "are"} now being prepared with care.</p>${orderSummary(input)}${callout("What happens next", `Please allow 7–10 business days for delivery. Your ${input.quantity === 1 ? "copy" : "copies"} will be sent to the address shown below.`)}<div style="margin-top:24px;padding:18px;border:1px solid ${COLORS.line};"><p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:10px;line-height:15px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:${COLORS.brass};">Delivery address</p><p style="margin:0;white-space:pre-line;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:24px;color:${COLORS.text};">${escapeHtml(address)}</p></div>`,
    action: { label: "Visit The Library", url: input.libraryUrl },
  });

  return { subject, text, html };
}

export function ownerOrderEmail(input: OwnerOrderEmailInput): EmailTemplate {
  const formatLabel = input.format === "ebook" ? "E-book" : "Paperback";
  const subject = `New ${input.format === "ebook" ? "e-book" : "paperback"} order: ${input.bookTitle}`;
  const rows: Array<[string, string]> = [
    ["Book", input.bookTitle],
    ["Format", formatLabel],
  ];
  if (input.format === "paperback") {
    rows.push(["Quantity", formatCopyCount(input.quantity)], ["Unit price", input.unitPrice]);
  }
  rows.push(
    ["Amount", input.amount],
    ["Reference", input.reference],
    ["Customer", input.customerName || "Not supplied"],
    ["Email", input.customerEmail],
  );
  if (input.format === "paperback") {
    rows.push(["Phone", input.customerPhone || "Not supplied"], ["Delivery address", input.address ?? "Not supplied"]);
  }

  const text = [
    `New ${formatLabel.toLowerCase()} order`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
  ].join("\n");
  const html = emailShell({
    preheader: `${input.customerName || "A customer"} ordered ${input.bookTitle}.`,
    eyebrow: `New ${formatLabel.toLowerCase()} order`,
    title: "A reader has chosen their next book.",
    body: `<p style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:27px;color:${COLORS.textSubdued};">A new paid order has been confirmed. The complete order record is below.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${detailRows(rows)}</table>`,
  });

  return { subject, text, html };
}

export function printerOrderEmail(input: PrinterEmailInput): EmailTemplate {
  const copyCount = formatCopyCount(input.quantity);
  const subject = `New print job: ${input.bookTitle} (Qty: ${input.quantity})`;
  const specificationRows: Array<[string, string]> = [
    ["Book", input.bookTitle],
    ["Quantity", String(input.quantity)],
    ["Page count", input.pageCount],
    ["Trim size", input.trimSize],
    ["Binding", input.binding],
  ];
  if (input.notes) specificationRows.push(["Notes", input.notes]);

  const text = [
    "New paid order to print.",
    `Payment reference: ${input.reference}`,
    "",
    ...specificationRows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Ship to:",
    input.customerName,
    input.address,
    `Phone: ${input.customerPhone}`,
  ].join("\n");
  const html = emailShell({
    preheader: `Print and ship ${copyCount} of ${input.bookTitle}.`,
    eyebrow: "Paid order · Print instruction",
    title: input.quantity === 1 ? "A new copy is ready for production." : "New copies are ready for production.",
    body: `<p style="margin:0 0 24px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:27px;color:${COLORS.textSubdued};">Please print ${escapeHtml(copyCount)} using the specifications below, then ship the order to the supplied delivery address.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${detailRows([["Payment reference", input.reference], ...specificationRows])}</table><div style="margin-top:26px;padding:20px;background:${COLORS.brassTint};border:1px solid ${COLORS.line};"><p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;line-height:15px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:${COLORS.brass};">Ship to</p><p style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:25px;color:${COLORS.text};">${escapeHtml(input.customerName)}</p><p style="margin:0;white-space:pre-line;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:23px;color:${COLORS.textSubdued};">${escapeHtml(input.address)}<br>${escapeHtml(input.customerPhone)}</p></div>`,
  });

  return { subject, text, html };
}
