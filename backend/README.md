# UrbanNest Lifestyle Store — Backend REST API 🚀

Production-grade Express.js + MongoDB REST API for **UrbanNest Lifestyle Store**, featuring direct integrations with **N8N Customer Query Webhooks** and **N8N AI Chatbots**, security rate limiters, Helmet headers, CORS restrictions, and robust error handling.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **Security**: Helmet, CORS, Express-Rate-Limit
- **Validation**: Joi
- **HTTP Client**: Axios (N8N webhook communication)
- **Logging**: Morgan + Logger utility

---

## 📌 Environment Variables Configuration

Create a `.env` file in `backend/`:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Atlas URI or local)
MONGODB_URI=mongodb://localhost:27017/urbannest

# Allowed Frontend Origin
FRONTEND_URL=http://localhost:5173

# N8N Integration Webhooks (Provided by Hackathon)
N8N_QUERY_WEBHOOK_URL=https://your-n8n-instance.com/webhook/urbannest-query-form
N8N_CHATBOT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/urbannest-ai-chatbot

# Rate Limits
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚀 API Endpoint Documentation

Base Path: `/api`

### 1. Health Check
- **GET** `/api/health`
- **Response**:
  ```json
  {
    "success": true,
    "message": "UrbanNest Backend is healthy",
    "data": {
      "status": "healthy",
      "service": "UrbanNest Backend REST API",
      "version": "1.0.0",
      "database": "connected",
      "timestamp": "2026-08-21T14:55:00.000Z"
    }
  }
  ```

---

### 2. Products API
- **GET** `/api/products`
  - **Query Parameters**:
    - `page` (default: 1)
    - `limit` (default: 12)
    - `search` (text search in name, description, tags)
    - `category` (Home Décor, Gifts, Stationery, etc.)
    - `minPrice` & `maxPrice`
    - `sort` (`price_asc`, `price_desc`, `rating`, `newest`)
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Products fetched successfully",
      "data": [...],
      "pagination": { "page": 1, "limit": 12, "total": 16, "totalPages": 2 }
    }
    ```

- **GET** `/api/products/featured`
  - Returns array of handpicked featured products.

- **GET** `/api/products/:id`
  - Returns target product object and related product recommendations.

---

### 3. Categories API
- **GET** `/api/categories`
  - Returns array of store categories with image & item count.

- **GET** `/api/categories/:slug`
  - Returns target category details and products belonging to the category.

---

### 4. Customer Query API (N8N Integrated)
- **POST** `/api/queries`
- **Rate Limit**: 10 requests / 15 minutes
- **Request Body**:
  ```json
  {
    "name": "Vikram",
    "email": "customer@example.com",
    "phone": "+91 98765 43210",
    "category": "Product Inquiry",
    "message": "Do you have decorative brass table lamps in stock?"
  }
  ```
- **Execution Flow**:
  1. Validates schema using Joi.
  2. Saves query document to MongoDB (`status: 'new'`, `n8nStatus: 'pending'`).
  3. Transmits payload to `N8N_QUERY_WEBHOOK_URL`.
  4. Updates MongoDB document (`n8nStatus: 'success'` or `'failed'`).
  5. Returns clean response to frontend client.

---

### 5. AI Chatbot API (N8N Integrated)
- **POST** `/api/chat`
- **Rate Limit**: 30 requests / 15 minutes
- **Request Body**:
  ```json
  {
    "message": "What are your store opening hours?",
    "sessionId": "urbannest-user-session-1"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "N8N Chatbot response received",
    "data": {
      "message": "Our flagship retail store is open Monday through Sunday from 10:00 AM to 9:00 PM IST."
    }
  }
  ```

---

### 6. Contact & Newsletter API
- **POST** `/api/contact` (Saves customer message to database)
- **POST** `/api/newsletter/subscribe` (Prevents duplicate email subscriptions)

---

### 7. Offers & Testimonials API
- **GET** `/api/offers` (Returns active promo codes & discount deals)
- **GET** `/api/testimonials` (Returns approved customer reviews)

---

## 📦 How to Run Locally

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Copy env variables
cp .env.example .env

# 4. Seed database (Optional if MongoDB is running)
npm run seed

# 5. Start development server
npm run dev
```

Server will start on `http://localhost:5000`.

---

## ☁️ Render Deployment Instructions

1. Create a **Web Service** on Render.com.
2. Select repository and set **Root Directory** to `backend`.
3. Set build configuration:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set Environment Variables on Render:
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `<your_mongodb_atlas_connection_string>`
   - `FRONTEND_URL` = `<your_frontend_render_url>`
   - `N8N_QUERY_WEBHOOK_URL` = `<your_n8n_query_webhook>`
   - `N8N_CHATBOT_WEBHOOK_URL` = `<your_n8n_chatbot_webhook>`
