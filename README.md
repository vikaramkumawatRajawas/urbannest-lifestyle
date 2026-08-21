# UrbanNest Lifestyle Store 🏡✨

> **“Little Things. Beautiful Living.”**

UrbanNest Lifestyle Store is a modern, production-grade, highly responsive commercial e-commerce web platform built for a boutique retail store. It seamlessly blends elegant UI/UX design with automated **N8N.io AI Chatbot** and **N8N Customer Query Processing** workflows.

---

## 📌 Problem Statement

Traditional boutique retail shops often struggle to transition online without sacrificing their artisanal brand identity or overloading small staff teams with customer support queries. Customers expect fast online product discovery, instant inquiry resolution, and seamless mobile accessibility.

## 💡 Solution

UrbanNest provides a complete digital storefront solution featuring:
1. **Interactive Product Catalog**: Real-time category filtering, keyword searching, price range adjustments, and sorting in INR (₹).
2. **N8N Automated Customer Query System**: Direct submission of customer inquiries to an N8N backend workflow for instant store owner notification.
3. **Floating N8N AI Assistant**: An intelligent AI Chatbot widget providing 24/7 answers for store hours, location, delivery timelines, and catalog items.
4. **Full E-Commerce Experience**: Slide-over cart drawer with free shipping progress bar, promo code copy engine, dark/light mode toggle, and interactive Google Maps location.

---

## 🚀 Key Features

- **Landing Page**: Premium hero section, curated categories, featured products, 4 core value props ("Why UrbanNest"), special discount offers, and customer testimonials.
- **Product Filtering & Search**: Instant real-time search, category pill toggles, price range slider (up to ₹3,000), and 5 sorting options with "No products found" fallback.
- **Product Details Modal**: High-res images, feature list, quantity manager, stock indicators, and related product recommendations.
- **Shopping Cart Drawer**: Add/remove items, update quantity, subtotal & shipping calculation, free shipping progress bar (unlocked at ₹1,499), simulated checkout.
- **Customer Query Form (N8N Integrated)**: Complete client-side validation, category classification, loading states, success/error banners, and webhook dispatch to `VITE_N8N_QUERY_WEBHOOK_URL`.
- **N8N AI Chatbot**: Persistent floating action button, quick suggestion chips, message history, live N8N endpoint connection via `VITE_N8N_CHATBOT_URL` with fallback AI layer.
- **Contact & Map Integration**: Flagship Indiranagar Bengaluru store details, opening hours, WhatsApp direct chat link, and interactive Google Maps.
- **Dark/Light Mode**: Full dark theme adaptation across all pages and components.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, JavaScript (JSX)
- **Styling**: Tailwind CSS + Glassmorphic Design System
- **Icons**: Lucide React Icons
- **State Management**: React Context API (`CartContext`, `ThemeContext`, `ProductContext`)
- **Automation / AI**: N8N.io Webhooks & AI Agent Workflows
- **Deployment**: Render Static Site (with `render.yaml` & `public/_redirects`)

---

## ⚙️ N8N Integration Architecture

```
                                  ┌─────────────────────────────┐
                                  │   UrbanNest React Frontend  │
                                  └──────────────┬──────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        ▼                                                 ▼
        ┌───────────────────────────────┐                 ┌───────────────────────────────┐
        │     Customer Query Form       │                 │       N8N AI Chatbot          │
        │ (VITE_N8N_QUERY_WEBHOOK_URL)  │                 │    (VITE_N8N_CHATBOT_URL)     │
        └──────────────┬────────────────┘                 └──────────────┬────────────────┘
                       │                                                 │
                       ▼                                                 ▼
        ┌───────────────────────────────┐                 ┌───────────────────────────────┐
        │  N8N Webhook Receiver Workflow │                 │  N8N AI Agent & Vector Search │
        │  (Notifies Store Admin/Email) │                 │  (Generates Smart AI Replies) │
        └───────────────────────────────┘                 └───────────────────────────────┘
```

### Environment Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```env
VITE_N8N_QUERY_WEBHOOK_URL=https://your-n8n-instance.com/webhook/urbannest-query-form
VITE_N8N_CHATBOT_URL=https://your-n8n-instance.com/webhook/urbannest-ai-chatbot
```

If these environment variables are not populated, the application gracefully activates fallback handlers while maintaining complete error resilience.

---

## 💻 Local Installation & Run Instructions

```bash
# 1. Clone the repository
git clone https://github.com/your-username/urbannest-lifestyle-store.git

# 2. Navigate to project root
cd urbannest-lifestyle-store

# 3. Install dependencies
npm install

# 4. Copy environment template
cp .env.example .env

# 5. Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📦 Build & Production Verification

```bash
# Build production bundle
npm run build

# Preview build locally
npm run preview
```

---

## ☁️ Render Deployment Instructions

1. Log in to [Render.com](https://render.com) and create a **New Static Site**.
2. Connect your GitHub repository containing this codebase.
3. Configure the build parameters:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variables in Render Dashboard:
   - `VITE_N8N_QUERY_WEBHOOK_URL` = `<your_hackathon_n8n_query_url>`
   - `VITE_N8N_CHATBOT_URL` = `<your_hackathon_n8n_chatbot_url>`
5. Click **Create Static Site**. SPA redirects are pre-configured via `public/_redirects` and `render.yaml`.

---

## 👥 Team Contributions (Hackathon 3-Member Team)

- **Member 1 (Frontend Architect & UI/UX Specialist)**: Core React setup, component architecture, Tailwind CSS design system, glassmorphic themes, responsive layout, cart state management.
- **Member 2 (AI & N8N Integration Engineer)**: N8N query form webhook connection, N8N chatbot service layer, suggestion chip logic, fallback AI responses, error handling.
- **Member 3 (Product Designer & QA Engineer)**: Product catalog curation, image selection, search/filter algorithms, mobile UI optimization, README documentation, Render deployment pipeline.

---

## 🔮 Future Roadmap & Improvements

- [ ] **Real Payment Gateway**: Integration with Razorpay / Stripe for live transaction processing.
- [ ] **Real-time Inventory Tracking**: Direct database synchronization with N8N to lock stock when items sell out.
- [ ] **User Account Portal**: Saved addresses, wishlist items, and order history tracking.
- [ ] **AI Product Recommendations**: Personalized product suggestions based on browsing behavior.
- [ ] **Admin Dashboard**: Real-time sales analytics, inventory manager, and N8N query status monitor.
