import React from "react";
import { Hero } from "../components/home/Hero";
import { BrandStorySection } from "../components/home/BrandStorySection";
import { FeaturedCarousel } from "../components/home/FeaturedCarousel";
import { CategoriesSection } from "../components/home/CategoriesSection";
import { FeaturedSection } from "../components/home/FeaturedSection";
import { WhyChooseUs } from "../components/home/WhyChooseUs";
import { OffersSection } from "../components/home/OffersSection";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { CustomerQueryForm } from "../components/query/CustomerQueryForm";

export const HomePage = ({ setActivePage, onOpenChatbot }) => {
  return (
    <div className="space-y-0">
      <Hero setActivePage={setActivePage} onOpenChatbot={onOpenChatbot} />
      <BrandStorySection setActivePage={setActivePage} />
      <FeaturedCarousel />
      <CategoriesSection setActivePage={setActivePage} />
      <FeaturedSection setActivePage={setActivePage} />
      <WhyChooseUs />
      <OffersSection setActivePage={setActivePage} />
      <TestimonialsSection />

      {/* Customer Query Form Highlight Section */}
      <section className="py-16 md:py-24 bg-[#0B0D0E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CustomerQueryForm />
        </div>
      </section>
    </div>
  );
};
