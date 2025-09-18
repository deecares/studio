import { AppHeader } from "@/components/app-header";
import OfferForm from "./offer-form";

export default function OfferRidePage() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <AppHeader title="Offer a Ride" />
      <main className="flex-1 p-4 md:p-8">
        <OfferForm />
      </main>
    </div>
  );
}
