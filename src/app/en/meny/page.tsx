import { englishMenuMetadata } from "../../metadata";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SocialSidebar from "@/components/layout/SocialSidebar";
import { BookingButton } from "@/components/booking";
import EnglishMenuClient from "./EnglishMenuClient";

export const metadata: Metadata = englishMenuMetadata;

export default function MenuPage() {
  return (
    <main>
      <Header />
      <EnglishMenuClient />
      <Footer />
      <BookingButton />
      <SocialSidebar />
    </main>
  );
}