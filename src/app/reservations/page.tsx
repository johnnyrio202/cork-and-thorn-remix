import type { Metadata } from "next";
import { ReservationsClient } from "./reservations-client";

export const metadata: Metadata = {
  title: "Reservations | Cork & Thorn",
};

export default function ReservationsPage() {
  return <ReservationsClient />;
}
