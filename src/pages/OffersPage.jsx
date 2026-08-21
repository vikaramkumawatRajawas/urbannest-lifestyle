import React from "react";
import { OffersSection } from "../components/home/OffersSection";

export const OffersPage = ({ setActivePage }) => {
  return (
    <div className="pt-28 pb-20 bg-stone-50/60 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OffersSection setActivePage={setActivePage} />
      </div>
    </div>
  );
};
