# Smart Health Connect - Complete App Overview

## 🏥 Application Features

### **Home Page** (`/`)
- **Premium Dark UI**: Glassmorphism aesthetic with vibrant cyan/indigo accents
- **Interactive Maps**: Real-time Google Maps integration showing Tirupati hospitals
- **AI FAB**: Floating Action Button for instant access to the SmartHealth AI Assistant
- **6 Feature Cards**:
  1. Find Hospitals (Live Tirupati Data)
  2. Book Doctors (Specialist Directory)
  3. Track Health (Live Vitals Dashboard)
  4. Medicine Orders (90+ Item Pharmacy)
  5. Multi-Language Support (EN, HI, TE)
  6. AI Triage (Automated Symptom Checker)
- **Voice Commands**: Integrated Web Speech API for hands-free navigation

### **SmartHealth AI Assistant**
- **Medical Triage**: Automated symptom checking using OpenAI GPT models
- **Smart Demo Mode**: Built-in fallback responses for common symptoms if no API key is set
- **Concise Advice**: Empathetic, disclaimer-aware triage guidance
- **Emergency Detection**: Instant emergency service redirection for critical symptoms

### **Tirupati Health Directory**
- **Hospitals**: Real data for SVIMS, Apollo, and Amara Hospitals
- **Doctors**: Profiles for specialists like Dr. S. Anwar Basha (Surgery) and Dr. Harshita Reddy (Medicine)
- **Live Search**: Specialty and name-based filtering

### **Health Dashboard** (`/dashboard`)
- **Live Vitals**: Real-time graph/display of health metrics (Heart Rate, Score)
- **Personalized Greeting**: Dynamic user welcome message
- **Quick Actions**: One-click access to Appointments, Prescriptions, and Vitals

---

## 🎨 Design Elements

### Brand Identity
- **Logo**: Custom SVG combining a medical cross, heartbeat line, and modern gradients
- **Typography**: 'Inter' & 'Outfit' for a high-end, professional medical feel

### Color Palette (Premium Dark)
```
Primary:    #0ea5e9 (Vibrant Cyan)
Secondary:  #6366f1 (Indigo)
Background: #0f172a (Deep Obsidian)
Glass:      rgba(15, 23, 42, 0.7)
Text:       #f8fafc (Bright) / #94a3b8 (Dim)
```

---

## 🔒 Security & Architecture

1. **Authentication**: Passport.js with Google OAuth 2.0 & Local Bcrypt strategies
2. **Session Security**: Express-session with secure HTTP-only cookies
3. **Data Integrity**: Sequelize ORM with SQLite (transitioning to Firestore)
4. **Resiliency**: Automated database seeding of real Tirupati data on startup
5. **Rate Limiting**: Protection against brute-force and API abuse

---

## 🔧 Technical Stack

### Core
- **Node.js & Express**: Backend engine
- **Sequelize & SQLite**: Current database (Flexible for migration)
- **OpenAI Node SDK**: AI capability
- **Socket.io**: Real-time foundations

### Frontend Excellence
- **Vanilla JS**: No heavy frameworks, lightning-fast performance
- **Glassmorphism CSS**: Modern blurred backgrounds and subtle borders
- **Google Maps API**: Geographic intelligence
- **i18next-style Translation**: EN, HI, TE support

---

## 🎯 Current Status & Improvements

✅ **Real Tirupati Data**: Switched from placeholders to real medical facilities  
✅ **AI Triage Integration**: Functional medical assistant with demo fallback  
✅ **Premium Dark Mode**: Complete visual overhaul for high-end aesthetics  
✅ **Google Login**: Working OAuth 2.0 flow  
✅ **Pharmacy Expansion**: 90+ coded medicines across diverse categories  

---

## 🔮 Roadmap

1. **Firestore Completion**: Move all SQLite models to Firebase Cloud Firestore
2. **Push Notifications**: Real-time alerts for appointment reminders
3. **Doctor Portal**: Dedicated dashboard for medical professionals to manage queues
4. **Prescription OCR**: Upload photos of prescriptions for automated cart addition

---

**Version:** 1.2.0  
**Updated:** January 20, 2026  
**Status:** Feature Rich & Cloud Ready
