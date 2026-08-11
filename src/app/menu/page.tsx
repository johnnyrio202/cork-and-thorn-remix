import type { Metadata } from "next";
import { MenuClient } from "./menu-client";

export const metadata: Metadata = {
  title: "Sips & Exhales | Cork & Thorn",
};

export default function MenuPage() {
  return <MenuClient />;
}
