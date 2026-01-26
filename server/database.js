const { User, Hospital, Doctor, Medicine, Appointment, Vital, Order, OrderItem, sequelize, Op } = require('./models');
const bcrypt = require('bcryptjs');

// --- USER FUNCTIONS ---

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: { email: email.toLowerCase() }
    });
    return user ? user.toJSON() : null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user ? user.toJSON() : null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

const getUserByGoogleId = async (googleId) => {
  try {
    const user = await User.findOne({
      where: { googleId }
    });
    return user ? user.toJSON() : null;
  } catch (error) {
    console.error('Error getting user by Google ID:', error);
    throw error;
  }
};

const createUser = async (userData) => {
  try {
    const { email, password, name, role = 'patient', ...rest } = userData;
    const newUser = {
      email: email.toLowerCase(),
      name,
      role,
      ...rest
    };

    if (password) {
      newUser.password = bcrypt.hashSync(password, 10);
    }

    const user = await User.create(newUser);
    return user.toJSON();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const updateUser = async (id, updates) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.update(updates);
    return user.toJSON();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const verifyPassword = (plainPassword, hashedPassword) => {
  if (!hashedPassword) return false;
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// --- HOSPITAL FUNCTIONS ---

const getHospitals = async (filters = {}) => {
  try {
    const where = {};
    if (filters.city) {
      where.city = filters.city;
    }
    const hospitals = await Hospital.findAll({ where });
    return hospitals.map(h => h.toJSON());
  } catch (error) {
    console.error('Error getting hospitals:', error);
    throw error;
  }
};

const getHospitalById = async (id) => {
  try {
    const hospital = await Hospital.findByPk(id);
    return hospital ? hospital.toJSON() : null;
  } catch (error) {
    console.error('Error getting hospital by ID:', error);
    throw error;
  }
};

// --- DOCTOR FUNCTIONS ---

const getDoctors = async (filters = {}) => {
  try {
    const where = {};
    if (filters.specialty) {
      where.specialization = filters.specialty;
    }

    let doctors = await Doctor.findAll({
      where,
      include: [{ model: Hospital, as: 'hospital' }]
    });

    doctors = doctors.map(d => d.toJSON());

    // Client-side filtering for name search
    if (filters.query) {
      const q = filters.query.toLowerCase();
      doctors = doctors.filter(doc => doc.name.toLowerCase().includes(q));
    }

    return doctors;
  } catch (error) {
    console.error('Error getting doctors:', error);
    throw error;
  }
};

const getDoctorById = async (id) => {
  try {
    const doctor = await Doctor.findByPk(id, {
      include: [{ model: Hospital, as: 'hospital' }]
    });
    return doctor ? doctor.toJSON() : null;
  } catch (error) {
    console.error('Error getting doctor by ID:', error);
    throw error;
  }
};

// --- MEDICINE FUNCTIONS ---

const getMedicines = async (filters = {}) => {
  try {
    const where = {};
    if (filters.category) {
      where.category = filters.category;
    }

    let medicines = await Medicine.findAll({ where });
    medicines = medicines.map(m => m.toJSON());

    // Client-side filtering for name search
    if (filters.query) {
      const q = filters.query.toLowerCase();
      medicines = medicines.filter(m => m.name.toLowerCase().includes(q));
    }

    return medicines;
  } catch (error) {
    console.error('Error getting medicines:', error);
    throw error;
  }
};

const getMedicineById = async (id) => {
  try {
    const medicine = await Medicine.findByPk(id);
    return medicine ? medicine.toJSON() : null;
  } catch (error) {
    console.error('Error getting medicine by ID:', error);
    throw error;
  }
};

// --- VITAL FUNCTIONS ---

const addVital = async (vitalData) => {
  try {
    const vital = await Vital.create(vitalData);
    return vital.toJSON();
  } catch (error) {
    console.error('Error adding vital:', error);
    throw error;
  }
};

const getVitalsByUser = async (userId, limit = 50) => {
  try {
    const vitals = await Vital.findAll({
      where: { userId },
      order: [['recordedAt', 'DESC']],
      limit
    });
    return vitals.map(v => v.toJSON());
  } catch (error) {
    console.error('Error getting vitals by user:', error);
    throw error;
  }
};

// --- APPOINTMENT FUNCTIONS ---

const createAppointment = async (appointmentData) => {
  try {
    const appointment = await Appointment.create({
      ...appointmentData,
      status: appointmentData.status || 'pending'
    });
    return appointment.toJSON();
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

const getAppointmentsByUser = async (userId) => {
  try {
    const appointments = await Appointment.findAll({
      where: { userId },
      include: [{ model: Doctor, as: 'doctor', include: [{ model: Hospital, as: 'hospital' }] }],
      order: [['date', 'DESC']]
    });
    return appointments.map(a => a.toJSON());
  } catch (error) {
    console.error('Error getting appointments by user:', error);
    throw error;
  }
};

const cancelAppointment = async (id) => {
  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    await appointment.update({ status: 'cancelled' });
    return appointment.toJSON();
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

// --- ORDER FUNCTIONS ---

const createOrder = async (orderData) => {
  try {
    const order = await Order.create({
      ...orderData,
      status: orderData.status || 'pending'
    });
    return order.toJSON();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

const getOrdersByUser = async (userId) => {
  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
    return orders.map(o => o.toJSON());
  } catch (error) {
    console.error('Error getting orders by user:', error);
    throw error;
  }
};

// --- DATABASE INITIALIZATION ---

const initDB = async () => {
  try {
    // Sync database
    await sequelize.sync();
    console.log('SQLite database synced successfully');

    // Check if demo user exists
    // Check if demo user exists
    const demoUser = await User.findOne({
      where: { email: 'test@example.com' }
    });

    if (!demoUser) {
      // If demo user is missing, it's likely a fresh DB, so run the full seed
      const seed = require('./scripts/seed');
      await seed();
    } else {
      // Run seed anyway to ensure new data (doctors/meds) is added if missing
      // The seed function has built-in checks
      const seed = require('./scripts/seed');
      await seed();
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Initialize database on module load
initDB();

module.exports = {
  // Users
  getUserByEmail,
  getUserById,
  getUserByGoogleId,
  createUser,
  updateUser,
  verifyPassword,
  hashPassword,

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
  cancelAppointment,

  // Orders
  createOrder,
  getOrdersByUser,

  // Database
  sequelize
};
