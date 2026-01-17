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

### 🏥 **Hospital Management**
- Search and browse hospitals by location
- View hospital details, specialties, and ratings
- Interactive map integration for hospital locations
- Filter hospitals by services and facilities

### 👨‍⚕️ **Doctor Services**
- Browse doctors by specialty and availability
- View detailed doctor profiles with experience and ratings
- Book appointments with preferred doctors
- Real-time appointment scheduling

### 💊 **Online Pharmacy**
- Browse medicines by category
- Search functionality for quick medicine lookup
- Shopping cart with localStorage persistence
- Prescription requirement indicators
- Secure checkout process

### 📊 **Health Dashboard**
- Personalized user dashboard
- Appointment history and upcoming bookings
- Order tracking for medicines
- Health vitals monitoring
- Quick access to all services

### 🔐 **Authentication & Security**
- Secure user registration and login
- Google OAuth 2.0 integration
- Password encryption with bcryptjs
- Session management with express-session
- Protected routes with authentication middleware
- Security headers with Helmet
- Rate limiting for API protection

### 🌍 **Multi-language Support**
- English, Hindi (हिंदी), and Telugu (తెలుగు)
- Dynamic language switching
- LocalStorage persistence for language preferences

### 📱 **Responsive Design**
- Mobile-first approach
- Optimized for all screen sizes
- Modern gradient UI with smooth animations
- Professional healthcare-themed design

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Sequelize** - ORM for database management
- **SQLite3** - Database (development)
- **Firebase Admin** - Cloud services integration
- **Passport.js** - Authentication middleware
- **EJS** - Server-side templating

### Frontend
- **Vanilla JavaScript** - Client-side logic
- **CSS3** - Styling with gradients and animations
- **SVG** - Custom healthcare logo
- **Web Speech API** - Voice command support
- **LocalStorage** - Client-side data persistence

### Security & Performance
- **Helmet** - Security headers
- **express-rate-limit** - API rate limiting
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **dotenv** - Environment configuration

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jeevanasreekonnipati-ops/carehealthplatform.app.git
   cd smart-health
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your configuration:
   ```env
   PORT=3000
   SESSION_SECRET=your-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **Initialize the database**
   ```bash
   node scripts/sync-db.js
   ```

5. **Seed the database with sample data**
   ```bash
   node scripts/seed-data.js
   ```

6. **Start the development server**
   ```bash
   npm start
   ```

7. **Access the application**
   ```
   Open your browser and navigate to: http://localhost:3000
   ```

### Demo Credentials

For testing purposes, use these credentials:
- **Email:** user@example.com
- **Password:** 1234

## 📁 Project Structure

```
smart-health/
├── server/
│   ├── config/
│   │   └── passport.js          # Passport authentication config
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   ├── errorHandler.js      # Error handling middleware
│   │   ├── rateLimiter.js       # Rate limiting middleware
│   │   └── validation.js        # Input validation
│   ├── models/
│   │   ├── index.js             # Model associations
│   │   ├── user.js              # User model
│   │   ├── doctor.js            # Doctor model
│   │   ├── hospital.js          # Hospital model
│   │   ├── medicine.js          # Medicine model
│   │   ├── appointment.js       # Appointment model
│   │   ├── order.js             # Order model
│   │   ├── orderItem.js         # Order item model
│   │   └── vital.js             # Health vitals model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── doctors.js           # Doctor routes
│   │   ├── hospitals.js         # Hospital routes
│   │   ├── medicines.js         # Pharmacy routes
│   │   ├── appointments.js      # Appointment routes
│   │   ├── orders.js            # Order routes
│   │   └── vitals.js            # Health vitals routes
│   ├── services/
│   │   └── emailService.js      # Email service (future)
│   ├── views/
│   │   ├── partials/
│   │   │   └── header.ejs       # Shared header component
│   │   ├── index.ejs            # Home page
│   │   ├── login.ejs            # Login page
│   │   ├── dashboard.ejs        # User dashboard
│   │   ├── doctors.ejs          # Doctors listing
│   │   ├── pharmacy.ejs         # Pharmacy page
│   │   ├── cart.ejs             # Shopping cart
│   │   ├── 404.ejs              # Not found page
│   │   └── 500.ejs              # Error page
│   ├── config.js                # App configuration
│   ├── database.js              # Database setup
│   ├── firebase-config.js       # Firebase configuration
│   └── server.js                # Main server file
├── public/
│   ├── i18n/
│   │   ├── en.json              # English translations
│   │   ├── hi.json              # Hindi translations
│   │   └── te.json              # Telugu translations
│   ├── logo.svg                 # Healthcare logo
│   ├── style.css                # Global styles
│   ├── app.js                   # Client-side logic
│   ├── map.js                   # Map integration
│   └── voice.js                 # Voice commands
├── scripts/
│   ├── sync-db.js               # Database sync script
│   ├── seed-data.js             # Seed all data
│   ├── seed-hospitals.js        # Seed hospitals
│   └── seed-users.js            # Seed users
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── Dockerfile                   # Docker configuration
├── Procfile                     # Heroku deployment
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Session Secret
SESSION_SECRET=your-super-secret-session-key-change-this

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Firebase Configuration (Optional)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Database (Production)
DATABASE_URL=your-database-url
```

## 💾 Database Setup

### Development (SQLite)

The application uses SQLite for development. The database is automatically created when you run:

```bash
node scripts/sync-db.js
```

### Seeding Data

Populate the database with sample data:

```bash
# Seed all data (recommended)
node scripts/seed-data.js

# Or seed individually
node scripts/seed-users.js
node scripts/seed-hospitals.js
```

### Database Models

- **User** - User accounts and profiles
- **Doctor** - Doctor information and specialties
- **Hospital** - Hospital details and locations
- **Medicine** - Pharmacy inventory
- **Appointment** - Doctor appointments
- **Order** - Medicine orders
- **OrderItem** - Order line items
- **Vital** - Health vitals tracking

## 🔌 API Endpoints

### Authentication
```
POST   /auth/register          - Register new user
POST   /auth/login             - User login
GET    /auth/logout            - User logout
GET    /auth/google            - Google OAuth login
GET    /auth/google/callback   - Google OAuth callback
```

### Hospitals
```
GET    /api/hospitals          - Get all hospitals
GET    /api/hospitals/:id      - Get hospital by ID
GET    /api/hospitals/search   - Search hospitals
```

### Doctors
```
GET    /doctors                - View doctors page
GET    /api/doctors            - Get all doctors (API)
GET    /api/doctors/:id        - Get doctor by ID
GET    /api/doctors/specialty/:specialty - Filter by specialty
```

### Pharmacy
```
GET    /pharmacy               - View pharmacy page
GET    /api/medicines          - Get all medicines
GET    /api/medicines/:id      - Get medicine by ID
GET    /api/medicines/search   - Search medicines
```

### Appointments
```
GET    /api/appointments       - Get user appointments
POST   /api/appointments       - Book appointment
PUT    /api/appointments/:id   - Update appointment
DELETE /api/appointments/:id   - Cancel appointment
```

### Orders
```
GET    /api/orders/cart        - View cart page
POST   /api/orders/checkout    - Checkout cart
GET    /api/orders/my          - Get user orders
```

### Health Vitals
```
GET    /api/vitals             - Get user vitals
POST   /api/vitals             - Add vital record
```

## 🎨 Design Features

### Color Scheme
- **Primary:** #6a11cb (Purple) - Trust & Authority
- **Secondary:** #2575fc (Blue) - Calm & Care
- **Accent:** #ff6f61 (Coral) - Energy & Life
- **Gradients:** Modern purple-blue gradients throughout

### Typography
- **Font Family:** 'Segoe UI', system-ui, sans-serif
- **Headers:** Bold, prominent sizing
- **Body:** Clean, readable text

### Animations
- Smooth transitions on hover
- Floating logo animation
- Card hover effects
- Loading states

## 🚢 Deployment

### Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables**
   ```bash
   heroku config:set SESSION_SECRET=your-secret
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Docker Deployment

```bash
# Build image
docker build -t smart-health .

# Run container
docker run -p 3000:3000 --env-file .env smart-health
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run with coverage
npm run test:coverage
```

## 📝 Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
node scripts/sync-db.js    # Sync database schema
node scripts/seed-data.js  # Seed sample data
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Jeevana Sree Konnipati** - Initial work

## 🙏 Acknowledgments

- Healthcare icons and design inspiration
- Open source community
- All contributors

## 📞 Support

For support, email support@smarthealth.com or open an issue in the repository.

## 🔮 Future Enhancements

- [ ] Real-time chat with doctors
- [ ] Video consultation integration
- [ ] Payment gateway integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered health recommendations
- [ ] Prescription management system
- [ ] Lab test booking
- [ ] Insurance integration
- [ ] Multi-tenant support for hospitals

---

**Made with ❤️ for better healthcare access**
