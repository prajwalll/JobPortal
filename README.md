# 🚀 Job Portal (Microservices Architecture)

A scalable Job Portal application built using **Microservices Architecture** with modern technologies.

---

## 🧩 Tech Stack

### 🔹 Frontend

* Next.js (App Router)
* Tailwind CSS
* TypeScript

### 🔹 Backend (Microservices)

* Node.js
* Express.js
* PostgreSQL (Serverless)
* Kafka (Event-driven communication)
* JWT Authentication
* Cloudinary (File Uploads)
* Nodemailer (Email Service)
* Gemini AI (AI Integration)

---

## 🏗️ Architecture

This project follows **Microservices Architecture**:

```
service/
  ├── auth-service
  ├── user-service
  ├── job-service
  └── shared-utils
```

Each service is independent and communicates via **Kafka events**.

---

## 📁 Project Structure

```
frontend/   → Next.js frontend
service/    → Backend microservices
```

---

## ⚙️ Setup Instructions

### 1. Clone repository

```bash
git clone https://github.com/YOUR_USERNAME/JobPortal.git
cd JobPortal
```

---

### 2. Install dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend (each service)

```bash
cd service/auth
npm install

cd ../job
npm install

cd ../user
npm install
```

---

### 3. Setup Environment Variables

Create `.env` in each service:

#### Example:

```env
PORT=5000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret
CLOUDINARY_URL=your_cloudinary
KAFKA_BROKER=your_kafka_url
```

---

### 4. Run Services

#### Start backend services

```bash
cd service/auth && npm run dev
cd service/job && npm run dev
cd service/user && npm run dev
```

#### Start frontend

```bash
cd frontend
npm run dev
```

---

## 🔥 Features

* User Authentication (JWT)
* Job Posting & Management
* File Upload (Cloudinary)
* Email Notifications (Nodemailer)
* Event-driven architecture using Kafka
* AI Integration (Gemini)

---

## 🚧 Status

Frontend is currently under development.

---

## 📌 Future Improvements

* API Gateway
* Docker & Kubernetes deployment
* CI/CD pipeline
* Advanced AI job recommendations

---

## 👨‍💻 Author

Prajwal M

---

## ⭐ Give a star if you like this project!
