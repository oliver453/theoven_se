import { Header, Footer } from "@/components/layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { WelcomeSection } from "@/components/sections/WelcomeSection";
import { InfoSections } from "@/components/sections/InfoSections";
import { HoursSection } from "@/components/sections/HoursSection";
import { FAQSection } from "@/components/sections/FAQSection";
import SocialSidebar from "@/components/layout/SocialSidebar";
import { BookingButton } from "@/components/booking";
import { NewMenuModal } from "@/components/NewMenuModal";

export default function HomePage() {
  return (
    <main>
      <Header />
      <HeroSection />
      <WelcomeSection />
      <InfoSections />
      <HoursSection />
      <FAQSection />
      <Footer />
      <BookingButton />
      <SocialSidebar />
      <NewMenuModal />
    </main>
  );
}
