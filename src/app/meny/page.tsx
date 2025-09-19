import { menuMetadata } from "../metadata";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SocialSidebar from "@/components/layout/SocialSidebar";
import { BookingButton } from "@/components/booking";
import SwedishMenuClient from "./SwedishMenuClient";

export const metadata: Metadata = menuMetadata;

export default function MenuPage() {
  return (
    <main>
      <Header />
      <SwedishMenuClient />
      <Footer />
      <BookingButton />
      <SocialSidebar />
    </main>
  );
}