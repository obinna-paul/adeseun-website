import { PaymentConfirmation } from "@/components/sections/checkout/PaymentConfirmation";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Payment confirmation", path: "/checkout/thank-you", noIndex: true });

export default async function CheckoutThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const query = await searchParams;
  const reference = query.reference?.trim() || query.trxref?.trim() || null;

  return <PaymentConfirmation initialReference={reference} />;
}
