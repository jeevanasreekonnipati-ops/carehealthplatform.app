# 🏥 Smart Health Connect

A comprehensive healthcare management platform that connects patients with hospitals, doctors, and pharmacy services. Built with Node.js, Express, and modern web technologies.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### 🏥 **Hospital Management (Live Tirupati Data)**
- Search and browse real hospitals in Tirupati (SVIMS, Apollo, Amara)
- View hospital details, specialties, and real-time ratings
- Interactive Google Maps integration for precise hospital locations
- Filter hospitals by services and facilities

### 👨‍⚕️ **Doctor Services (Real Specialists)**
- Browse real specialist doctors in Tirupati (General Surgery, Neurology, Pediatrics, etc.)
- View detailed profiles of doctors like Dr. S. Anwar Basha and Dr. Harshita Reddy
- Real-time appointment scheduling system
- Specialization-based filtering and search functionality

### 🤖 **SmartHealth AI Triage Assistant**
- 24/7 AI-powered medical triage assistant
- Automated symptom checking and urgency classification (Critical, Moderate, Mild)
- **Smart Demo Mode**: Provides realistic medical advice even without an API key
- OpenAI integration for advanced conversational health guidance

### 💊 **Advanced Online Pharmacy**
- 90+ medicines across 9 specialized categories
- Real-time stock management and prescription requirement indicators
- Enhanced shopping cart with persistent storage
- Category-wise browsing (Heart & BP, Diabetes, Skin Care, etc.)

### 📊 **Integrated Health Dashboard**
- Personalized user health overview
- **Live Vitals Tracking**: Monitor heart rate and health scores
- Appointment history and interactive prescription tracking
- Quick access to all healthcare services

### 🔐 **Advanced Security**
- Google OAuth 2.0 & traditional Email/Password login
- Secure session management with CSRF protections
- Premium Dark Mode UI with Glassmorphism aesthetics
- API Rate limiting and security header stabilization (Helmet)

### 🌍 **Multi-language Support**
- Full support for English, Hindi (हिंदी), and Telugu (తెలుగు)
- Instant language switching across all pages
- Native localization for specialized medical terms

## 🛠 Tech Stack

### Backend
- **Node.js**: Modern runtime environment
- **Express.js**: High-performance web framework
- **Sequelize & SQLite3**: Current reliable data persistence
- **Firebase Admin SDK**: Transitioning to Cloud Firestore
- **Passport.js**: Multi-strategy authentication (Local + Google)
- **EJS**: Dynamic server-side templating
- **OpenAI API**: Powering the AI Triage Assistant

### Frontend
- **Vanilla JavaScript**: Reactive client-side logic
- **CSS3 / Glassmorphism**: Premium dark UI with blur effects and gradients
- **Google Maps API**: Real-time location services
- **Socket.io**: Real-time communication foundation
- **Web Speech API**: Integrated voice command support

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0.0 or higher)
- Google Maps API Key (Optional, for maps)
- OpenAI API Key (Optional, for AI - defaults to Demo Mode)

### Installation
1. **Clone & Install**
   ```bash
   git clone https://github.com/jeevanasreekonnipati-ops/carehealthplatform.app.git
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file based on `.env.example`:
   ```env
   PORT=3000
   SESSION_SECRET=your-secret
   GOOGLE_API_KEY=your-maps-key
   OPENAI_API_KEY=your-ai-key
   GOOGLE_CLIENT_ID=your-google-id
   GOOGLE_CLIENT_SECRET=your-google-secret
   ```

3. **Initialize App**
   The application automatically seeds the latest Tirupati medical data on first run.
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure
- `server/routes/ai_chat.js`: AI Triage logic
- `server/scripts/seed.js`: Real-time Tirupati data seeds
- `public/style.css`: Premium Dark Theme styling
- `FIREBASE_SETUP.md`: Instructions for Cloud migration

---

## 🔮 Future Enhancements
- [ ] Complete Firestore migration for absolute scalability
- [ ] Integrated Video Consultations via WebRTC
- [ ] Multi-tenant Hospital Admin Dashboards
- [ ] AI-powered prescription analysis (OCR)
- [ ] Blood Bank real-time availability tracking

---
**Smart Health Connect**: Empowering healthcare through technology.
**Made with ❤️ for Tirupati and beyond**

---

**Made with ❤️ for better healthcare access**
