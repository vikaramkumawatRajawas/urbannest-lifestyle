import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import { OrderProvider, useOrders } from "./context/OrderContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";

import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { Toast } from "./components/common/Toast";
import { PageLoader } from "./components/common/PageLoader";
import { CustomCursor } from "./components/common/CustomCursor";

import { CartDrawer } from "./components/cart/CartDrawer";
import { N8nChatbotDrawer } from "./components/chatbot/N8nChatbotDrawer";
import { ProductDetailModal } from "./components/products/ProductDetailModal";
import { OrdersModal } from "./components/orders/OrdersModal";
import { AuthModal } from "./components/auth/AuthModal";

import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { FAQPage } from "./pages/FAQPage";
import { OffersPage } from "./pages/OffersPage";
import { SettingsPage } from "./pages/SettingsPage";
import { WishlistPage } from "./pages/WishlistPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { NotFoundPage } from "./pages/NotFoundPage";

import aiAvatarImg from "./assets/ai-assistant-avatar.png";

function AppContent() {
  const [activePage, setActivePage] = useState("home");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { isOrdersModalOpen, setIsOrdersModalOpen } = useOrders();
  const { isAuthModalOpen, setIsAuthModalOpen } = useAuth();

  useEffect(() => {
    if (window.location.pathname.includes("reset-password") || window.location.search.includes("token=")) {
      setActivePage("reset-password");
    }
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return (
          <HomePage
            setActivePage={setActivePage}
            onOpenChatbot={() => setIsChatbotOpen(true)}
          />
        );
      case "products":
        return <ProductsPage />;
      case "offers":
        return <OffersPage setActivePage={setActivePage} />;
      case "about":
        return <AboutPage setActivePage={setActivePage} />;
      case "faq":
        return (
          <FAQPage
            setActivePage={setActivePage}
            onOpenChatbot={() => setIsChatbotOpen(true)}
          />
        );
      case "contact":
        return <ContactPage />;
      case "settings":
        return <SettingsPage />;
      case "wishlist":
        return <WishlistPage setActivePage={setActivePage} />;
      case "reset-password":
        return <ResetPasswordPage setActivePage={setActivePage} />;
      default:
        return <NotFoundPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#0B0D0E] text-[#141210] dark:text-[#F4EFE6] transition-colors duration-300 relative">
      {/* 1.2s Preloader */}
      <PageLoader />

      {/* Custom Desktop Magnetic Cursor */}
      <CustomCursor />

      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />

      <main className="flex-1">{renderPage()}</main>

      <Footer setActivePage={setActivePage} />

      {/* Fixed Viewport Pure Transparent 3D Robot Logo AI Assistant Button */}
      <button
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        className="fixed bottom-6 right-6 z-[9999] p-0 bg-transparent border-0 cursor-pointer group transition-transform duration-300 hover:scale-115 active:scale-95 focus:outline-none"
        title="UrbanNest AI Assistant"
        aria-label="UrbanNest AI Assistant"
      >
        <img
          src={aiAvatarImg}
          alt="UrbanNest AI Assistant Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] group-hover:drop-shadow-[0_15px_30px_rgba(127,255,212,0.4)] transition-all duration-300"
        />
      </button>

      {/* Drawers & Modals */}
      <CartDrawer setActivePage={setActivePage} />
      <ProductDetailModal onOpenChatbot={() => setIsChatbotOpen(true)} />
      <N8nChatbotDrawer
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        setActivePage={setActivePage}
      />
      <OrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <WishlistProvider>
                <AppContent />
              </WishlistProvider>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
