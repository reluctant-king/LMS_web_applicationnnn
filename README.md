# 🎓 LMS Web Application

A full-stack Learning Management System (LMS) built with **React**, **Node.js**, **Express**, and **MongoDB**, designed to manage institutions, courses, instructors, students, payments, quizzes, attendance, and more — all in one platform.

---

## 🚀 Key Highlights

- 🧑‍🎓 Student, Instructor & Admin roles  
- 🏫 Institution management  
- 📚 Course creation & enrollment  
- 🎥 Video lessons & assignments  
- 📝 Quizzes & evaluations  
- 💳 Online payments (Razorpay)  
- 📊 Admin dashboard with analytics  
- 🔐 JWT-based authentication  
- 📩 Email notifications & certificates  

---

## 🏗️ Project Architecture

    Frontend (User Website)  → React + Vite
    Admin Dashboard          → React + Vite
    Backend API              → Node.js + Express
    Database                 → MongoDB
    Authentication           → JWT + Passport
    Payments                 → Razorpay
    File Uploads             → Multer
    Emails                   → Nodemailer

---

## 📁 Repository Structure (Essential View)

    reluctant-king-lms_web_application/
    │
    ├── admin_dash_board/        # Admin panel (React)
    ├── website/
    │   └── lms/                 # User-facing LMS website (React)
    ├── server/                  # Backend API (Node.js + Express)
    └── README.md

---

## 🧩 Core Applications

### 🖥️ Admin Dashboard

- Manage courses, students, instructors  
- Attendance and batch scheduling  
- Fee management and payments  
- Notifications and announcements  
- Reports and analytics  

### 🌐 LMS Website (Users)

- Browse and purchase courses  
- Watch lessons and submit assignments  
- Attempt quizzes  
- Track learning progress  
- Instructor course management  

### ⚙️ Backend Server

- RESTful APIs  
- Authentication and authorization  
- Payment handling  
- Email services  
- File uploads  

---

## 🔐 Authentication & Roles

- Admin  
- Institution  
- Instructor  
- Student  

Each role has protected routes and permissions enforced via JWT middleware.

---

## 🛠️ Tech Stack

### Frontend

- React (Vite)  
- Tailwind CSS / Custom CSS  
- Redux Toolkit  
- Axios  
- React Router  

### Backend

- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT  
- Passport.js  
- Multer  
- Nodemailer  
- Razorpay SDK  

---

## 📦 API Modules

- Authentication and Authorization  
- Courses and Categories  
- Lessons and Recorded Videos  
- Quizzes and Submissions  
- Assignments  
- Attendance  
- Fee Structure and Payments  
- Notifications  
- Tickets and Support  

---

## 📂 Database Models

- Users  
- Institutions  
- Courses  
- Lessons  
- Quizzes  
- Assignments  
- Payments  
- Attendance  
- Notifications  
- Tickets  

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

    git clone https://github.com/Yadhukrishna123/LMS_web_application.git
    cd lms_web_application_

### 2️⃣ Backend Setup

    cd server
    npm install
    npm start

Create a `.env` file inside `server/`:

    PORT= Your_Port
    MONGO_URI=your_mongodb_url
    JWT_SECRET=your_secret_key
    RAZORPAY_KEY=your_key
    RAZORPAY_SECRET=your_secret
    EMAIL_USER=your_email
    EMAIL_PASS=your_password

### 3️⃣ Admin Dashboard Setup

    cd ../admin_dash_board
    npm install
    npm run dev

### 4️⃣ LMS Website Setup

    cd ../website/lms
    npm install
    npm run dev

---

## 🌐 Environment URLs

- Backend API: `http://localhost:8080`  
- Admin Panel: `http://localhost:5173`  
- LMS Website: `http://localhost:5174`  

---

## 🌐 Live Demo
- ## LMS Website
- https://lms-web-applicationnnn.vercel.app
- ## Admin Dashboard
- https://lms-web-applicationnnn-gqxc-n1byjqeaz.vercel.app/


## 🔒 Security Features

- JWT authentication  
- Role-based access control  
- Protected routes  
- Secure payment verification  
- Input validation  

---

## 📈 Future Enhancements

- 📱 Mobile app support  
- 🧠 AI-based course recommendations  
- 📊 Advanced analytics  
- 🌍 Multi-language support  
- 🧾 Invoice generation  

---

## 🤝 Contribution

Contributions are welcome!  
Fork the repository, create a feature branch, and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Authors

**Ambady Unnikrishnan**  
GitHub: https://github.com/reluctant-king  

**Yadhukrishna**  
GitHub: https://github.com/Yadhukrishna123
