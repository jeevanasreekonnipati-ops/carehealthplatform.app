# API Endpoints Reference

This document lists the primary server endpoints for Smart Health Connect. Paths, methods, short descriptions, and sample requests/responses are provided.

Base URL (local): http://localhost:3000

Authentication
- POST /auth/login — local login (email + password)
- GET /auth/google — redirect to Google OAuth
- GET /auth/google/callback — OAuth callback
- POST /auth/logout — logout current session

Hospitals
- GET /hospitals — list hospitals (query params: q, city, specialty)
- GET /hospitals/:id — hospital details

Doctors
- GET /doctors — list doctors (filters: specialty, hospitalId)
- GET /doctors/:id — doctor profile

Appointments
- GET /appointments — user's appointments (requires auth)
- POST /appointments — create appointment
  Sample request:
  ```json
  {
    "doctorId": "123",
    "hospitalId": "456",
    "userId": "789",
    "datetime": "2026-02-01T10:30:00.000Z",
    "reason": "Routine checkup"
  }
  ```
- GET /appointments/:id — appointment details
- PUT /appointments/:id — update appointment (reschedule/cancel)
- DELETE /appointments/:id — cancel appointment

Pharmacy
- GET /pharmacy/medicines — list medicines (query: category, q)
- GET /pharmacy/medicines/:id — medicine details
- POST /pharmacy/cart — add item to cart (requires auth)
- GET /pharmacy/cart — get current cart
- POST /pharmacy/checkout — place order (requires auth)

AI Triage
- POST /api/triage — submit symptoms for triage (body: { symptoms: ["..."], age, sex })
  Sample request:
  ```json
  {
    "symptoms": ["fever", "cough", "shortness of breath"],
    "age": 45,
    "sex": "female"
  }
  ```
  Sample response:
  ```json
  {
    "urgency": "Moderate",
    "recommendation": "Visit primary care within 48 hours or seek emergency care if symptoms worsen",
    "possibleConditions": ["Bronchitis", "COVID-19", "Flu"]
  }
  ```

User
- GET /users/me — current user's profile (requires auth)
- PUT /users/me — update profile

Notes
- All endpoints requiring authentication will return 401 when unauthenticated.
- Input validation errors return 400 with a JSON body { error: "message", details: [...] }

If you want, I can expand this into a full OpenAPI/Swagger spec.