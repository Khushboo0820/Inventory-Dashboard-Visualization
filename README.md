**Inventory Dashboard Visualization**

* Project description
* Technologies used
* Folder structure
* Setup instructions (for both sides)
* Environment variables
* Data import
* API overview
* Deployment advice (optional)

---

### ✅ `README.md` (Full App)

```markdown
# 📊 Inventory Dashboard Visualization

An end-to-end MERN (MongoDB, Express, React, Node.js) application for managing and visualizing inventory data. Built for operational clarity using dashboards, charts, and clean data pipelines.

---

## 🚀 Tech Stack

| Layer       | Tech                    |
|-------------|-------------------------|
| Frontend    | React (Next.js), Tailwind CSS |
| Backend     | Node.js, Express, Mongoose |
| Database    | MongoDB Atlas           |
| Charting    | Recharts / Chart.js     |
| Tools       | Postman, Excel-to-JSON, dotenv, nodemon |

---

## 🗂️ Folder Structure

```

Inventory Dashboard Visualization/
├── backend/ # Express + MongoDB backend
│ ├── config/ # DB connection setup
│ ├── controllers/ # Route handlers for inventory & item master
│ ├── data/ # JSON files from Excel
│ ├── middlewares/ # (reserved) //not in use
│ ├── models/ # Mongoose schemas
│ ├── routes/ # API routes
│ ├── scripts/ # One-time migration scripts
│ ├── services/ # (reserved for business logic)// not in use
│ ├── utils/ # Helper functions
│ └── server.js # App entry point
│
├── frontend/ # Next.js frontend
│ ├── src/
│ │ ├── app/ # App router pages
│ │ ├── components/ # Reusable UI components
│ │ └── lib/ # API functions
│ └── *.config.mjs # Tailwind, PostCSS, etc.
└── README.md

````

---

## ⚙️ Setup Instructions

### 🔧 Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
````

2. **Install dependencies**

   ```bash
   npm install -y
   ```

3. **Create `.env`**

   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/inventoryDB
   PORT=5000
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Import data**
   Place Excel-exported JSON files into `/data`:

   * `inventoryData.json`
   * `itemMaster.json`

   Then run:

   ```bash
   node scripts/migrateExcelJSON.js
   ```

---

### 💻 Frontend Setup

1. **Navigate to frontend folder**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npx create-next-app@latest
   ```

3. **Create `.env.local`**

   ```
   NEXT_PUBLIC_API_BASE=http://localhost:5000/api
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**

   ```
   http://localhost:3000
   ```

---

## 📡 API Endpoints (Backend)

### Inventory Routes

| Method | Route                              | Description                        |
| ------ | ---------------------------------- | ---------------------------------- |
| GET    | `/inventory/all?page=1&limit=20`   | Paginated inventory + item info    |
| GET    | `/inventory/category-distribution` | Get category breakdown (pie chart) |
| GET    | `/inventory/itr`                   | Get Inventory Turnover Ratio       |
| GET    | `/inventory/monthly-consumption`   | Filtered consumption by dates      |
| GET    | `/inventory/stock-vs-msl`          | Closing Stock vs Minimum Stock Level
---

## 📈 Frontend Features

* Lazy-loaded inventory table with pagination
* ABC Classification filters
* Consumption trends chart
* Category-wise pie chart
* Inventory Turnover insights
* Responsive UI with Tailwind CSS


## 📦 Deployment

### Backend

* Can be deployed on Render, Railway, or EC2
* Make sure MongoDB URI is set in env

### Frontend

* Deploy on Vercel or Netlify
* Add `NEXT_PUBLIC_API_BASE` in Vercel settings

---

## 📄 License

This project is open-source and free to use.

---

## 🙌 Author

Built with ❤️ by **Khushboo**

Connect with me:

* LinkedIn: [Khushboo Parate]([https://github.com/Khushboo0820/})

```

---

### 📌 How to use

1. Save this as `README.md` at your **project root**.
2. Replace any placeholder values (e.g. `<username>`).
3. Add it to GitHub if this is going public.

```
