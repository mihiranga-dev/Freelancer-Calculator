# 💸 Freelancer Income Calculator & Project Tracker

![Project Status](https://img.shields.io/badge/Status-Live-success) ![Tech Stack](https://img.shields.io/badge/Stack-PERN-blue)

A full-stack utility application designed for freelancers (Fiverr/Upwork) to accurately calculate "take-home" pay after platform fees and track project income history. This app solves the common problem of currency conversion and hidden fee miscalculations.

**🔗 Live Demo:** [https://freelancer-calczip--mihirangadev.replit.app](https://freelancer-calczip--mihirangadev.replit.app)

---

## ✨ Key Features

* **Smart Fee Calculator:** Automatically calculates net income based on platform fees (e.g., standard 20% Fiverr deduction).
* **Real-Time Currency Conversion:** Instantly converts USD earnings to LKR (Sri Lankan Rupee) or any other currancy type for local financial planning.
* **User Authentication:** Secure login system to maintain personal project history.
* **Income Dashboard:** specific table view to track past projects, clients, and total earnings over time.
* **Responsive Design:** Built with Tailwind CSS for a seamless mobile and desktop experience.

## 🛠️ Tech Stack

* **Frontend:** React (Vite), TypeScript, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Managed via Drizzle ORM)
* **Deployment:** Replit
* **Version Control:** Git & GitHub

## 🚀 Local Setup Instructions

If you want to run this project locally, follow these steps:

### 1. Clone the Repository
```bash
git clone [https://github.com/mihiranga-dev/Freelancer-Calculator.git](https://github.com/mihiranga-dev/Freelancer-Calculator.git)
cd Freelancer-Calculator
```

### 2. Install Dependencies
```bash
npm install
```

### 4. Database Setup
This project uses a PostgreSQL database. You can initialize the required tables by running the SQL commands found in `schema.sql`.

* Run the script in your SQL client (pgAdmin, DBeaver, or Replit Database tool) to create the `users`, `calculations`, and `sessions` tables.

### 5. Run the App
Start the development server:

```bash
npm run dev
```

## 📂 Project Structure

```text
Freelancer-Calculator/
├── client/           # React Frontend logic
├── server/           # Node/Express Backend API
├── shared/           # Shared Types/Schemas (Drizzle)
├── schema.sql        # Database initialization script
└── package.json      # Project dependencies
```

## 👨‍💻 Author

**Mihiranga Dissanayake**
* [LinkedIn](https://www.linkedin.com/in/mihiranga-dev/)
* [GitHub](https://github.com/mihiranga-dev)
