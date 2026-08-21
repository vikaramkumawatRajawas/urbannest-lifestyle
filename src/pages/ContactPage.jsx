import React from "react";
import { CustomerQueryForm } from "../components/query/CustomerQueryForm";
import { ContactMapSection } from "../components/contact/ContactMapSection";

export const ContactPage = () => {
  return (
    <div className="pt-28 pb-20 bg-stone-50/60 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            Get in Touch
          </span>
          <h1 className="text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Contact & Customer Support
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Submit a query to our N8N processing workflow or visit our flagship store in Indiranagar, Bengaluru.
          </p>
        </div>

        {/* Customer Query Form Section */}
        <div className="max-w-4xl mx-auto">
          <CustomerQueryForm />
        </div>

        {/* Store Location & Google Map */}
        <div className="pt-8">
          <ContactMapSection />
        </div>
      </div>
    </div>
  );
};
