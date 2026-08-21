import React from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation } from "lucide-react";

export const ContactMapSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Store Info Cards */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-stone-200/80 dark:border-slate-800 shadow-xl space-y-6">
          <h3 className="text-xl font-bold text-stone-900 dark:text-white">
            Visit Our Flagship Retail Store
          </h3>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="block font-semibold text-stone-900 dark:text-white">
                  Address Location
                </strong>
                <span className="text-stone-600 dark:text-stone-400 leading-relaxed block mt-0.5">
                  #42 Heritage Design Arcade, Indiranagar 100ft Road, Bengaluru, Karnataka 560038, India
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <strong className="block font-semibold text-stone-900 dark:text-white">
                  Opening Hours
                </strong>
                <span className="text-stone-600 dark:text-stone-400 block mt-0.5">
                  Monday – Sunday: 10:00 AM – 9:00 PM IST
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <strong className="block font-semibold text-stone-900 dark:text-white">
                  Phone & Helpline
                </strong>
                <span className="text-stone-600 dark:text-stone-400 block mt-0.5">
                  +91 (80) 4567-8900 / +91 98765 43210
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="block font-semibold text-stone-900 dark:text-white">
                  Email Support
                </strong>
                <span className="text-stone-600 dark:text-stone-400 block mt-0.5">
                  contact@urbanneststore.com
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/918045678900?text=Hi%20UrbanNest,%20I%20have%20a%20question%20about%20your%20products!"
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Embedded Google Maps View */}
      <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-xl border border-stone-200 dark:border-slate-800 min-h-[380px] relative bg-stone-100 dark:bg-slate-800">
        <iframe
          title="UrbanNest Store Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.973418579998!2d77.64020921482204!3d12.973550890854495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a7223b2d13%3A0x6b9d62888e2d45c5!2s100%20Feet%20Rd%2C%20Indiranagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: "380px" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full min-h-[380px]"
        />
      </div>
    </div>
  );
};
