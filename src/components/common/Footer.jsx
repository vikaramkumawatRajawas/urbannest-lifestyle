import React from "react";
import {
  Heart,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  Globe
} from "lucide-react";

export const Footer = ({ setActivePage }) => {
  const handleNav = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 dark:bg-slate-950 dark:text-slate-400 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg">
                U
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Urban<span className="text-amber-500">Nest</span>
              </span>
            </div>
            <p className="text-amber-500 font-serif italic text-base">
              “Little Things. Beautiful Living.”
            </p>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Thoughtfully selected home décor, gifts, stationery, lifestyle accessories, and everyday essentials designed to make your space feel warm and personal.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/918045678900"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-emerald-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Explore Store
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleNav("home")} className="hover:text-amber-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("products")} className="hover:text-amber-400 transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("offers")} className="hover:text-amber-400 transition-colors">
                  Special Offers
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("about")} className="hover:text-amber-400 transition-colors">
                  About UrbanNest
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("faq")} className="hover:text-amber-400 transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleNav("products")} className="hover:text-amber-400 transition-colors">
                  Home Décor & Vases
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("products")} className="hover:text-amber-400 transition-colors">
                  Curated Gift Hampers
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("products")} className="hover:text-amber-400 transition-colors">
                  Stationery & Planners
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("products")} className="hover:text-amber-400 transition-colors">
                  Lifestyle Accessories
                </button>
              </li>
              <li>
                <button onClick={() => handleNav("products")} className="hover:text-amber-400 transition-colors">
                  Household Essentials
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Store Contact
            </h4>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>#42 Heritage Design Arcade, Indiranagar, Bengaluru 560038</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+91 (80) 4567-8900</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>contact@urbanneststore.com</span>
              </li>
              <li>
                <button
                  onClick={() => handleNav("contact")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-amber-600 text-white text-xs font-semibold transition-colors mt-1"
                >
                  <span>Submit Customer Query</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Hackathon Badge */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} UrbanNest Lifestyle Store. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Powered by React, Vite & N8N Automation Workflows</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
