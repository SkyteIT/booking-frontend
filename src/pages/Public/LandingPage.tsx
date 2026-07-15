// src/pages/Public/LandingPage.tsx
import HeroSection from "../../components/sections/landing/HeroSection";
import CategoriesSection from "../../components/sections/landing/CategoriesSection";
import FeaturedSection from "../../components/sections/landing/FeaturedSection";
import HowItWorksSection from "../../components/sections/landing/HowItWorksSection";
//import CTASection from '../../components/sections/landing/CTASection';
//import TestimonialsSection from '../../components/sections/landing/TestimonialsSection';
import FAQSection from "../../components/sections/landing/FAQSection";

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedSection />
      <HowItWorksSection />

      <FAQSection />
    </>
  );
};

export default LandingPage;
