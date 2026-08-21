import React, { useState } from "react";
import { ChevronDown, HelpCircle, Bot, Mail } from "lucide-react";
import { FAQS } from "../data/faqData";

export const FAQPage = ({ setActivePage, onOpenChatbot }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="pt-28 pb-20 bg-stone-50/60 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            Help Center
          </span>
          <h1 className="text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Find instant answers regarding product categories, store hours, location, and N8N support integrations.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200/80 dark:border-slate-800 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-stone-900 dark:text-white flex items-center justify-between gap-4 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-amber-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-slate-800/60 animate-fadeIn">
                    <p className="pl-8">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-center space-y-4 shadow-xl">
          <h3 className="text-2xl font-bold">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-amber-100 max-w-lg mx-auto">
            Our N8N AI Assistant is available 24/7, or you can send an inquiry directly to our store team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenChatbot}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-stone-900 font-bold text-xs hover:bg-stone-100 shadow transition-colors flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-amber-600" />
              <span>Ask AI Assistant Now</span>
            </button>
            <button
              onClick={() => {
                setActivePage("contact");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Submit Form Query</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
