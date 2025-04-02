import PaymentClient from "@/components/PaymentClient";
import { Suspense } from "react";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading Payment Page...</div>}>
      <PaymentClient />
    </Suspense>
  );
}
