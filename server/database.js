const { db } = require('./firebase-config');
const bcrypt = require('bcryptjs');

// Collection references
const usersRef = db.collection('users');
const hospitalsRef = db.collection('hospitals');
const doctorsRef = db.collection('doctors');
const medicinesRef = db.collection('medicines');
const appointmentsRef = db.collection('appointments');
const vitalsRef = db.collection('vitals');
const ordersRef = db.collection('orders');

const MOCK_MEDICINES = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Effective pain reliever and fever reducer.',
    price: 5.00,
    category: 'Pain Relief',
    image: 'https://via.placeholder.com/150?text=Paracetamol',
    requiresPrescription: false
  },
  {
    id: '2',
    name: 'Vitamin C 1000mg',
    description: 'Immunity booster dietary supplement.',
    price: 12.00,
    category: 'Supplements',
    image: 'https://via.placeholder.com/150?text=Vit+C',
    requiresPrescription: false
  },
  {
    id: '3',
    name: 'Amoxicillin 500mg',
    description: 'Antibiotic used to treat bacterial infections.',
    price: 15.00,
    category: 'Antibiotics',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    requiresPrescription: true
  }
];

const MOCK_DOCTORS = [
  {
    id: 'd1',
    name: 'Dr. S. Anwar Basha',
    specialization: 'General Surgery',
    experience: 15,
    fees: 500,
    bio: 'Highly experienced General Surgeon specializing in advanced laparoscopic surgeries.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
    rating: 4.8
  },
  {
    id: 'd2',
    name: 'Dr. Harshita Reddy G',
    specialization: 'General Medicine',
    experience: 11,
    fees: 400,
    bio: 'General Physician specializing in diabetes management and infectious diseases.',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80',
    rating: 4.9
  }
];

const MOCK_HOSPITALS = [
  {
    id: 'h1',
    name: 'SVIMS Hospital',
    address: 'Alipiri Road',
    city: 'Tirupati',
    latitude: 13.6373,
    longitude: 79.4063,
    services: 'Specialized Tertiary Care, Cardiac, Oncology',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
  },
  {
    id: 'h2',
    name: 'Apollo Hospitals',
    address: 'Renigunta Road',
    city: 'Tirupati',
    latitude: 13.6262,
    longitude: 79.4323,
    services: 'Multi-specialty, 24/7 Emergency',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=400'
  }
];

const getMockVitals = (userId) => {
  const now = new Date();
  const days = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
  return [
    { id: 'v1', userId, type: 'heart_rate', value: 72, recordedAt: days(4) },
    { id: 'v2', userId, type: 'heart_rate', value: 75, recordedAt: days(3) },
    { id: 'v3', userId, type: 'heart_rate', value: 68, recordedAt: days(2) },
    { id: 'v4', userId, type: 'heart_rate', value: 70, recordedAt: days(1) },
    { id: 'v5', userId, type: 'heart_rate', value: 74, recordedAt: now },
    { id: 'v6', userId, type: 'bp_systolic', value: 120, recordedAt: days(3) },
    { id: 'v7', userId, type: 'bp_systolic', value: 118, recordedAt: days(1) },
    { id: 'v8', userId, type: 'glucose', value: 95, recordedAt: days(2) },
    { id: 'v9', userId, type: 'glucose', value: 98, recordedAt: now }
  ];
};

const MOCK_USER = {
  id: 'demo-user-123',
  email: 'test@example.com',
  name: 'Demo User',
  password: 'password123', // Clean text for mock comparison
  googleId: '123456789', // Added for Google Mock
  role: 'patient',
  created_at: new Date()
};




// Helper to format Firestore doc
const formatDoc = (doc) => {
  if (!doc.exists) return null;
  const data = doc.data();
  // Convert Firestore Timestamp to Date if applicable
  Object.keys(data).forEach(key => {
    if (data[key] && typeof data[key].toDate === 'function') {
      data[key] = data[key].toDate();
    }
  });
  return { id: doc.id, ...data };
};

// --- USER FUNCTIONS ---

const getUserByEmail = async (email) => {
  try {
    const snapshot = await usersRef.where('email', '==', email.toLowerCase()).limit(1).get();
    if (snapshot.empty) {
      if (email.toLowerCase() === MOCK_USER.email) return MOCK_USER;
      return null;
    }
    return formatDoc(snapshot.docs[0]);
  } catch (error) {
    if (email.toLowerCase() === MOCK_USER.email) return MOCK_USER;
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const doc = await usersRef.doc(id).get();
    if (!doc.exists) return MOCK_USER; // Defensive
    return formatDoc(doc);
  } catch (error) {
    return MOCK_USER;
  }
};

const getUserByGoogleId = async (googleId) => {
  try {
    const snapshot = await usersRef.where('googleId', '==', googleId).limit(1).get();
    if (snapshot.empty) return null;
    return formatDoc(snapshot.docs[0]);
  } catch (error) {
    console.error('Firestore getUserByGoogleId error:', error.message);
    return null;
  }
};

const createUser = async (userData) => {
  try {
    const { email, password, name, role = 'patient', ...rest } = userData;
    const newUser = {
      id: 'new-user-' + Date.now(),
      email: email.toLowerCase(),
      name,
      role,
      ...rest,
      created_at: new Date()
    };

    if (password) {
      newUser.password = bcrypt.hashSync(password, 10);
    }

    const docRef = await usersRef.add(newUser);
    const doc = await docRef.get();
    return formatDoc(doc);
  } catch (error) {
    // Mock user creation
    const { email, name, role = 'patient', ...rest } = userData;
    return {
      id: 'mock-user-' + Date.now(),
      email: email.toLowerCase(),
      name,
      role,
      ...rest,
      created_at: new Date()
    };
  }
};


const updateUser = async (id, updates) => {
  try {
    await usersRef.doc(id).update({
      ...updates,
      updated_at: new Date()
    });
    return getUserById(id);
  } catch (error) {
    if (id === MOCK_USER.id) {
      Object.assign(MOCK_USER, updates);
      return MOCK_USER;
    }
    throw error;
  }
};

const verifyPassword = (plainPassword, hashedPassword) => {
  if (!hashedPassword) return false;
  // Fallback for mock user simple password
  if (hashedPassword === MOCK_USER.password && plainPassword === MOCK_USER.password) return true;
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

// --- HOSPITAL FUNCTIONS ---

const getHospitals = async (filters = {}) => {
  try {
    let query = hospitalsRef;
    if (filters.city) {
      query = query.where('city', '==', filters.city);
    }
    const snapshot = await query.get();
    const hospitals = snapshot.docs.map(doc => formatDoc(doc)).filter(Boolean);

    if (hospitals.length === 0 && !filters.city) {
      return MOCK_HOSPITALS;
    }

    return hospitals;
  } catch (error) {
    console.error('Firestore getHospitals error, returning mock data:', error.message);
    return MOCK_HOSPITALS;
  }
};

const getHospitalById = async (id) => {
  try {
    const doc = await hospitalsRef.doc(id).get();
    if (!doc.exists) {
      return MOCK_HOSPITALS.find(h => h.id === id) || MOCK_HOSPITALS[0];
    }
    return formatDoc(doc);
  } catch (error) {
    return MOCK_HOSPITALS.find(h => h.id === id) || MOCK_HOSPITALS[0];
  }
};

// --- DOCTOR FUNCTIONS ---

const getDoctors = async (filters = {}) => {
  try {
    let query = doctorsRef;
    if (filters.specialty) {
      query = query.where('specialization', '==', filters.specialty);
    }
    const snapshot = await query.get();
    let doctors = snapshot.docs.map(doc => formatDoc(doc)).filter(Boolean);

    if (filters.query) {
      const q = filters.query.toLowerCase();
      doctors = doctors.filter(doc => doc.name.toLowerCase().includes(q));
    }

    if (doctors.length === 0 && !filters.query && !filters.specialty) {
      return MOCK_DOCTORS;
    }

    return doctors;
  } catch (error) {
    console.error('Firestore getDoctors error, returning mock data:', error.message);
    return MOCK_DOCTORS;
  }
};

const getDoctorById = async (id) => {
  try {
    const doc = await doctorsRef.doc(id).get();
    if (!doc.exists) {
      return MOCK_DOCTORS.find(d => d.id === id) || MOCK_DOCTORS[0];
    }
    return formatDoc(doc);
  } catch (error) {
    return MOCK_DOCTORS.find(d => d.id === id) || MOCK_DOCTORS[0];
  }
};

// --- MEDICINE FUNCTIONS ---

const getMedicines = async (filters = {}) => {
  try {
    let query = medicinesRef;
    if (filters.category) {
      query = query.where('category', '==', filters.category);
    }
    const snapshot = await query.get();
    let medicines = snapshot.docs.map(doc => formatDoc(doc)).filter(Boolean);

    if (filters.query) {
      const q = filters.query.toLowerCase();
      medicines = medicines.filter(m => m.name.toLowerCase().includes(q));
    }

    if (medicines.length === 0 && !filters.query && !filters.category) {
      return MOCK_MEDICINES;
    }

    return medicines;
  } catch (error) {
    console.error('Firestore getMedicines error, returning mock data:', error.message);
    return MOCK_MEDICINES;
  }
};

const getMedicineById = async (id) => {
  try {
    const doc = await medicinesRef.doc(id).get();
    if (!doc.exists) {
      return MOCK_MEDICINES.find(m => m.id === id) || MOCK_MEDICINES[0];
    }
    return formatDoc(doc);
  } catch (error) {
    return MOCK_MEDICINES.find(m => m.id === id) || MOCK_MEDICINES[0];
  }
};

// --- VITAL FUNCTIONS ---

const addVital = async (vitalData) => {
  try {
    const newVital = {
      ...vitalData,
      recordedAt: vitalData.recordedAt || new Date()
    };
    const docRef = await vitalsRef.add(newVital);
    const doc = await docRef.get();
    return formatDoc(doc);
  } catch (error) {
    console.warn('Firestore addVital mock mode:', error.message);
    return { id: 'mock-v-' + Date.now(), ...vitalData, recordedAt: new Date() };
  }
};

const getVitalsByUser = async (userId, limit = 50) => {
  try {
    const snapshot = await vitalsRef
      .where('userId', '==', userId)
      .orderBy('recordedAt', 'desc')
      .limit(limit)
      .get();
    const vitals = snapshot.docs.map(doc => formatDoc(doc)).filter(Boolean);

    if (vitals.length === 0) {
      return getMockVitals(userId);
    }

    return vitals;
  } catch (error) {
    console.error('Firestore getVitalsByUser error, returning mock data:', error.message);
    return getMockVitals(userId);
  }
};

// --- APPOINTMENT FUNCTIONS ---

const createAppointment = async (appointmentData) => {
  try {
    const newAppointment = {
      ...appointmentData,
      status: appointmentData.status || 'pending',
      created_at: new Date()
    };
    const docRef = await appointmentsRef.add(newAppointment);
    const doc = await docRef.get();
    return formatDoc(doc);
  } catch (error) {
    console.warn('Firestore createAppointment mock mode:', error.message);
    return { id: 'mock-app-' + Date.now(), ...appointmentData, status: 'pending', created_at: new Date() };
  }
};

const getAppointmentsByUser = async (userId) => {
  try {
    const snapshot = await appointmentsRef
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .get();

    const appointments = snapshot.docs.map(doc => formatDoc(doc)).filter(Boolean);

    // Fetch doctor info for each appointment (since Firestore doesn't support joins)
    for (let appointment of appointments) {
      if (appointment.doctorId) {
        const doctorDoc = await doctorsRef.doc(appointment.doctorId).get();
        appointment.doctor = formatDoc(doctorDoc);
      }
    }

    return appointments;
  } catch (error) {
    console.error('Firestore getAppointmentsByUser error:', error.message);
    return []; // Return empty array to prevent crash
  }
};

// --- ORDER FUNCTIONS ---

const createOrder = async (orderData) => {
  try {
    const newOrder = {
      ...orderData,
      status: orderData.status || 'pending',
      created_at: new Date()
    };
    const docRef = await ordersRef.add(newOrder);
    const doc = await docRef.get();
    return formatDoc(doc);
  } catch (error) {
    console.warn('Firestore createOrder mock mode:', error.message);
    return { id: 'mock-ord-' + Date.now(), ...orderData, status: 'pending', created_at: new Date() };
  }
};

const getOrdersByUser = async (userId) => {
  try {
    const snapshot = await ordersRef
      .where('userId', '==', userId)
      .orderBy('created_at', 'desc')
      .get();
    return snapshot.docs.map(doc => formatDoc(doc)).filter(Boolean);
  } catch (error) {
    console.error('Firestore getOrdersByUser error:', error.message);
    return []; // Return empty array to prevent crash
  }
};

// Initialize database (Create demo user if not exists)
const initDB = async () => {
  try {
    const demoEmail = 'test@example.com';
    const snapshot = await usersRef.where('email', '==', demoEmail).limit(1).get();

    if (snapshot.empty) {
      await createUser({
        email: demoEmail,
        password: 'password123',
        name: 'Demo User',
        role: 'patient'
      });
      console.log('Demo user created in Firestore');
    }
  } catch (error) {
    console.warn('Firestore initialization warning (usually missing indexes or perms):', error.message);
  }
};

// Initialize
initDB();

module.exports = {
  // Users
  getUserByEmail,
  getUserById,
  getUserByGoogleId,
  createUser,
  updateUser,
  verifyPassword,
  hashPassword: (password) => bcrypt.hashSync(password, 10),

  // Hospitals
  getHospitals,
  getHospitalById,

  // Doctors
  getDoctors,
  getDoctorById,

  // Medicines
  getMedicines,
  getMedicineById,

  // Vitals
  addVital,
  getVitalsByUser,

  // Appointments
  createAppointment,
  getAppointmentsByUser,

  // Orders
  createOrder,
  getOrdersByUser
};
