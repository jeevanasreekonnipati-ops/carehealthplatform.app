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
    "id": "1",
    "name": "Paracetamol 5mg",
    "description": "Quality assured Paracetamol for effective care.",
    "price": 10,
    "category": "Pain Relief",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": true
  },
  {
    "id": "2",
    "name": "Azithromycin 55mg",
    "description": "Quality assured Azithromycin for effective care.",
    "price": 11,
    "category": "Antibiotics",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "3",
    "name": "B12 105mg",
    "description": "Quality assured B12 for effective care.",
    "price": 12,
    "category": "Supplements",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "4",
    "name": "Mucinex 155mg",
    "description": "Quality assured Mucinex for effective care.",
    "price": 13,
    "category": "Cold & Flu",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "5",
    "name": "Ecosprin 205mg",
    "description": "Quality assured Ecosprin for effective care.",
    "price": 14,
    "category": "Heart Health",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "6",
    "name": "Metformin 255mg",
    "description": "Quality assured Metformin for effective care.",
    "price": 15,
    "category": "Diabetes",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "7",
    "name": "Allegra 305mg",
    "description": "Quality assured Allegra for effective care.",
    "price": 16,
    "category": "Allergies",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "8",
    "name": "Ointment 355mg",
    "description": "Quality assured Ointment for effective care.",
    "price": 17,
    "category": "First Aid",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": true
  },
  {
    "id": "9",
    "name": "Magnesium 405mg",
    "description": "Quality assured Magnesium for effective care.",
    "price": 18,
    "category": "Vitamins",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "10",
    "name": "Naproxen 5mg",
    "description": "Quality assured Naproxen for effective care.",
    "price": 19,
    "category": "Pain Relief",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "11",
    "name": "Amoxicillin 55mg",
    "description": "Quality assured Amoxicillin for effective care.",
    "price": 20,
    "category": "Antibiotics",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "12",
    "name": "Multivitamin 105mg",
    "description": "Quality assured Multivitamin for effective care.",
    "price": 21,
    "category": "Supplements",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "13",
    "name": "Strepsils 155mg",
    "description": "Quality assured Strepsils for effective care.",
    "price": 22,
    "category": "Cold & Flu",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "14",
    "name": "Telmisartan 205mg",
    "description": "Quality assured Telmisartan for effective care.",
    "price": 23,
    "category": "Heart Health",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "15",
    "name": "Glucerna 255mg",
    "description": "Quality assured Glucerna for effective care.",
    "price": 24,
    "category": "Diabetes",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": true
  },
  {
    "id": "16",
    "name": "Cetirizine 305mg",
    "description": "Quality assured Cetirizine for effective care.",
    "price": 25,
    "category": "Allergies",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "17",
    "name": "Dettol 355mg",
    "description": "Quality assured Dettol for effective care.",
    "price": 26,
    "category": "First Aid",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "18",
    "name": "Zinc 405mg",
    "description": "Quality assured Zinc for effective care.",
    "price": 27,
    "category": "Vitamins",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "19",
    "name": "Dolo 650 5mg",
    "description": "Quality assured Dolo 650 for effective care.",
    "price": 28,
    "category": "Pain Relief",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "20",
    "name": "Doxycycline 55mg",
    "description": "Quality assured Doxycycline for effective care.",
    "price": 29,
    "category": "Antibiotics",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "21",
    "name": "Iron 105mg",
    "description": "Quality assured Iron for effective care.",
    "price": 30,
    "category": "Supplements",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "22",
    "name": "Vicks Vaporub 155mg",
    "description": "Quality assured Vicks Vaporub for effective care.",
    "price": 31,
    "category": "Cold & Flu",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": true
  },
  {
    "id": "23",
    "name": "Lisinopril 205mg",
    "description": "Quality assured Lisinopril for effective care.",
    "price": 32,
    "category": "Heart Health",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "24",
    "name": "Jalra 255mg",
    "description": "Quality assured Jalra for effective care.",
    "price": 33,
    "category": "Diabetes",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "25",
    "name": "Flonase 305mg",
    "description": "Quality assured Flonase for effective care.",
    "price": 34,
    "category": "Allergies",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "26",
    "name": "Bandages 355mg",
    "description": "Quality assured Bandages for effective care.",
    "price": 35,
    "category": "First Aid",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "27",
    "name": "Limcee 405mg",
    "description": "Quality assured Limcee for effective care.",
    "price": 36,
    "category": "Vitamins",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "28",
    "name": "Calpol 5mg",
    "description": "Quality assured Calpol for effective care.",
    "price": 37,
    "category": "Pain Relief",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "29",
    "name": "Cephalexin 55mg",
    "description": "Quality assured Cephalexin for effective care.",
    "price": 38,
    "category": "Antibiotics",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": true
  },
  {
    "id": "30",
    "name": "Vitamin D3 105mg",
    "description": "Quality assured Vitamin D3 for effective care.",
    "price": 39,
    "category": "Supplements",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "31",
    "name": "Cough Syrup 155mg",
    "description": "Quality assured Cough Syrup for effective care.",
    "price": 40,
    "category": "Cold & Flu",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "32",
    "name": "Amlodipine 205mg",
    "description": "Quality assured Amlodipine for effective care.",
    "price": 41,
    "category": "Heart Health",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "33",
    "name": "Insulin 255mg",
    "description": "Quality assured Insulin for effective care.",
    "price": 42,
    "category": "Diabetes",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "34",
    "name": "Zyrtec 305mg",
    "description": "Quality assured Zyrtec for effective care.",
    "price": 43,
    "category": "Allergies",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "35",
    "name": "Thermometer 355mg",
    "description": "Quality assured Thermometer for effective care.",
    "price": 44,
    "category": "First Aid",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "36",
    "name": "Becosules 405mg",
    "description": "Quality assured Becosules for effective care.",
    "price": 45,
    "category": "Vitamins",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": true
  },
  {
    "id": "37",
    "name": "Ibuprofen 5mg",
    "description": "Quality assured Ibuprofen for effective care.",
    "price": 46,
    "category": "Pain Relief",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "38",
    "name": "Ciprofloxacin 55mg",
    "description": "Quality assured Ciprofloxacin for effective care.",
    "price": 47,
    "category": "Antibiotics",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "39",
    "name": "Zincavit 105mg",
    "description": "Quality assured Zincavit for effective care.",
    "price": 48,
    "category": "Supplements",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "40",
    "name": "DayQuil 155mg",
    "description": "Quality assured DayQuil for effective care.",
    "price": 49,
    "category": "Cold & Flu",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "41",
    "name": "Atorvastatin 205mg",
    "description": "Quality assured Atorvastatin for effective care.",
    "price": 50,
    "category": "Heart Health",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "42",
    "name": "Glycomet 255mg",
    "description": "Quality assured Glycomet for effective care.",
    "price": 51,
    "category": "Diabetes",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "43",
    "name": "Claritin 305mg",
    "description": "Quality assured Claritin for effective care.",
    "price": 52,
    "category": "Allergies",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": true
  },
  {
    "id": "44",
    "name": "Savlon 355mg",
    "description": "Quality assured Savlon for effective care.",
    "price": 53,
    "category": "First Aid",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "45",
    "name": "Calcium 405mg",
    "description": "Quality assured Calcium for effective care.",
    "price": 54,
    "category": "Vitamins",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "46",
    "name": "Aspirin 5mg",
    "description": "Quality assured Aspirin for effective care.",
    "price": 55,
    "category": "Pain Relief",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "47",
    "name": "Azithromycin 55mg",
    "description": "Quality assured Azithromycin for effective care.",
    "price": 56,
    "category": "Antibiotics",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "48",
    "name": "Omega 3 105mg",
    "description": "Quality assured Omega 3 for effective care.",
    "price": 57,
    "category": "Supplements",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "49",
    "name": "Mucinex 155mg",
    "description": "Quality assured Mucinex for effective care.",
    "price": 58,
    "category": "Cold & Flu",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "50",
    "name": "Ecosprin 205mg",
    "description": "Quality assured Ecosprin for effective care.",
    "price": 59,
    "category": "Heart Health",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": true
  },
  {
    "id": "51",
    "name": "Metformin 255mg",
    "description": "Quality assured Metformin for effective care.",
    "price": 60,
    "category": "Diabetes",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "52",
    "name": "Allegra 305mg",
    "description": "Quality assured Allegra for effective care.",
    "price": 61,
    "category": "Allergies",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "53",
    "name": "Ointment 355mg",
    "description": "Quality assured Ointment for effective care.",
    "price": 62,
    "category": "First Aid",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "54",
    "name": "Magnesium 405mg",
    "description": "Quality assured Magnesium for effective care.",
    "price": 63,
    "category": "Vitamins",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "55",
    "name": "Crocin 5mg",
    "description": "Quality assured Crocin for effective care.",
    "price": 64,
    "category": "Pain Relief",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "56",
    "name": "Amoxicillin 55mg",
    "description": "Quality assured Amoxicillin for effective care.",
    "price": 65,
    "category": "Antibiotics",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "57",
    "name": "Vitamin C 105mg",
    "description": "Quality assured Vitamin C for effective care.",
    "price": 66,
    "category": "Supplements",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": true
  },
  {
    "id": "58",
    "name": "Strepsils 155mg",
    "description": "Quality assured Strepsils for effective care.",
    "price": 67,
    "category": "Cold & Flu",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "59",
    "name": "Telmisartan 205mg",
    "description": "Quality assured Telmisartan for effective care.",
    "price": 68,
    "category": "Heart Health",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "60",
    "name": "Glucerna 255mg",
    "description": "Quality assured Glucerna for effective care.",
    "price": 69,
    "category": "Diabetes",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "61",
    "name": "Cetirizine 305mg",
    "description": "Quality assured Cetirizine for effective care.",
    "price": 70,
    "category": "Allergies",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "62",
    "name": "Dettol 355mg",
    "description": "Quality assured Dettol for effective care.",
    "price": 71,
    "category": "First Aid",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "63",
    "name": "Zinc 405mg",
    "description": "Quality assured Zinc for effective care.",
    "price": 72,
    "category": "Vitamins",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "64",
    "name": "Paracetamol 5mg",
    "description": "Quality assured Paracetamol for effective care.",
    "price": 73,
    "category": "Pain Relief",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": true
  },
  {
    "id": "65",
    "name": "Doxycycline 55mg",
    "description": "Quality assured Doxycycline for effective care.",
    "price": 74,
    "category": "Antibiotics",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "66",
    "name": "B12 105mg",
    "description": "Quality assured B12 for effective care.",
    "price": 75,
    "category": "Supplements",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "67",
    "name": "Vicks Vaporub 155mg",
    "description": "Quality assured Vicks Vaporub for effective care.",
    "price": 76,
    "category": "Cold & Flu",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "68",
    "name": "Lisinopril 205mg",
    "description": "Quality assured Lisinopril for effective care.",
    "price": 77,
    "category": "Heart Health",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "69",
    "name": "Jalra 255mg",
    "description": "Quality assured Jalra for effective care.",
    "price": 78,
    "category": "Diabetes",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "70",
    "name": "Flonase 305mg",
    "description": "Quality assured Flonase for effective care.",
    "price": 79,
    "category": "Allergies",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "71",
    "name": "Bandages 355mg",
    "description": "Quality assured Bandages for effective care.",
    "price": 80,
    "category": "First Aid",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": true
  },
  {
    "id": "72",
    "name": "Limcee 405mg",
    "description": "Quality assured Limcee for effective care.",
    "price": 81,
    "category": "Vitamins",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "73",
    "name": "Naproxen 5mg",
    "description": "Quality assured Naproxen for effective care.",
    "price": 82,
    "category": "Pain Relief",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "74",
    "name": "Cephalexin 55mg",
    "description": "Quality assured Cephalexin for effective care.",
    "price": 83,
    "category": "Antibiotics",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "75",
    "name": "Multivitamin 105mg",
    "description": "Quality assured Multivitamin for effective care.",
    "price": 84,
    "category": "Supplements",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "76",
    "name": "Cough Syrup 155mg",
    "description": "Quality assured Cough Syrup for effective care.",
    "price": 85,
    "category": "Cold & Flu",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "77",
    "name": "Amlodipine 205mg",
    "description": "Quality assured Amlodipine for effective care.",
    "price": 86,
    "category": "Heart Health",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "78",
    "name": "Insulin 255mg",
    "description": "Quality assured Insulin for effective care.",
    "price": 87,
    "category": "Diabetes",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": true
  },
  {
    "id": "79",
    "name": "Zyrtec 305mg",
    "description": "Quality assured Zyrtec for effective care.",
    "price": 88,
    "category": "Allergies",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "80",
    "name": "Thermometer 355mg",
    "description": "Quality assured Thermometer for effective care.",
    "price": 89,
    "category": "First Aid",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "81",
    "name": "Becosules 405mg",
    "description": "Quality assured Becosules for effective care.",
    "price": 90,
    "category": "Vitamins",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "82",
    "name": "Dolo 650 5mg",
    "description": "Quality assured Dolo 650 for effective care.",
    "price": 91,
    "category": "Pain Relief",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "83",
    "name": "Ciprofloxacin 55mg",
    "description": "Quality assured Ciprofloxacin for effective care.",
    "price": 92,
    "category": "Antibiotics",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "84",
    "name": "Iron 105mg",
    "description": "Quality assured Iron for effective care.",
    "price": 93,
    "category": "Supplements",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "85",
    "name": "DayQuil 155mg",
    "description": "Quality assured DayQuil for effective care.",
    "price": 94,
    "category": "Cold & Flu",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": true
  },
  {
    "id": "86",
    "name": "Atorvastatin 205mg",
    "description": "Quality assured Atorvastatin for effective care.",
    "price": 95,
    "category": "Heart Health",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "87",
    "name": "Glycomet 255mg",
    "description": "Quality assured Glycomet for effective care.",
    "price": 96,
    "category": "Diabetes",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "88",
    "name": "Claritin 305mg",
    "description": "Quality assured Claritin for effective care.",
    "price": 97,
    "category": "Allergies",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "89",
    "name": "Savlon 355mg",
    "description": "Quality assured Savlon for effective care.",
    "price": 98,
    "category": "First Aid",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "90",
    "name": "Calcium 405mg",
    "description": "Quality assured Calcium for effective care.",
    "price": 99,
    "category": "Vitamins",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "91",
    "name": "Calpol 5mg",
    "description": "Quality assured Calpol for effective care.",
    "price": 10,
    "category": "Pain Relief",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "92",
    "name": "Azithromycin 55mg",
    "description": "Quality assured Azithromycin for effective care.",
    "price": 11,
    "category": "Antibiotics",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": true
  },
  {
    "id": "93",
    "name": "Vitamin D3 105mg",
    "description": "Quality assured Vitamin D3 for effective care.",
    "price": 12,
    "category": "Supplements",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "94",
    "name": "Mucinex 155mg",
    "description": "Quality assured Mucinex for effective care.",
    "price": 13,
    "category": "Cold & Flu",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "95",
    "name": "Ecosprin 205mg",
    "description": "Quality assured Ecosprin for effective care.",
    "price": 14,
    "category": "Heart Health",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "96",
    "name": "Metformin 255mg",
    "description": "Quality assured Metformin for effective care.",
    "price": 15,
    "category": "Diabetes",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "97",
    "name": "Allegra 305mg",
    "description": "Quality assured Allegra for effective care.",
    "price": 16,
    "category": "Allergies",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "98",
    "name": "Ointment 355mg",
    "description": "Quality assured Ointment for effective care.",
    "price": 17,
    "category": "First Aid",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "99",
    "name": "Magnesium 405mg",
    "description": "Quality assured Magnesium for effective care.",
    "price": 18,
    "category": "Vitamins",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": true
  },
  {
    "id": "100",
    "name": "Ibuprofen 5mg",
    "description": "Quality assured Ibuprofen for effective care.",
    "price": 19,
    "category": "Pain Relief",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "101",
    "name": "Amoxicillin 55mg",
    "description": "Quality assured Amoxicillin for effective care.",
    "price": 20,
    "category": "Antibiotics",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "102",
    "name": "Zincavit 105mg",
    "description": "Quality assured Zincavit for effective care.",
    "price": 21,
    "category": "Supplements",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  },
  {
    "id": "103",
    "name": "Strepsils 155mg",
    "description": "Quality assured Strepsils for effective care.",
    "price": 22,
    "category": "Cold & Flu",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "104",
    "name": "Telmisartan 205mg",
    "description": "Quality assured Telmisartan for effective care.",
    "price": 23,
    "category": "Heart Health",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "105",
    "name": "Glucerna 255mg",
    "description": "Quality assured Glucerna for effective care.",
    "price": 24,
    "category": "Diabetes",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "106",
    "name": "Cetirizine 305mg",
    "description": "Quality assured Cetirizine for effective care.",
    "price": 25,
    "category": "Allergies",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": true
  },
  {
    "id": "107",
    "name": "Dettol 355mg",
    "description": "Quality assured Dettol for effective care.",
    "price": 26,
    "category": "First Aid",
    "image": "https://images.unsplash.com/photo-1512428559087-560ad5ceab42?w=400",
    "requiresPrescription": false
  },
  {
    "id": "108",
    "name": "Zinc 405mg",
    "description": "Quality assured Zinc for effective care.",
    "price": 27,
    "category": "Vitamins",
    "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400",
    "requiresPrescription": false
  },
  {
    "id": "109",
    "name": "Aspirin 5mg",
    "description": "Quality assured Aspirin for effective care.",
    "price": 28,
    "category": "Pain Relief",
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    "requiresPrescription": false
  },
  {
    "id": "110",
    "name": "Doxycycline 55mg",
    "description": "Quality assured Doxycycline for effective care.",
    "price": 29,
    "category": "Antibiotics",
    "image": "https://images.unsplash.com/photo-1576073719710-aa5e3f4b5059?w=400",
    "requiresPrescription": false
  }
];

const MOCK_DOCTORS = [
  {
    "id": "d1",
    "name": "Dr. S. Anwar Basha",
    "specialization": "Cardiology",
    "experience": 5,
    "fees": 300,
    "bio": "Renowned expert in Cardiology with over 5 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    "rating": "4.8"
  },
  {
    "id": "d2",
    "name": "Dr. Harshita Reddy G",
    "specialization": "Pediatrics",
    "experience": 6,
    "fees": 400,
    "bio": "Renowned expert in Pediatrics with over 6 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
    "rating": "4.8"
  },
  {
    "id": "d3",
    "name": "Dr. Rajesh Khanna",
    "specialization": "Neurology",
    "experience": 7,
    "fees": 500,
    "bio": "Renowned expert in Neurology with over 7 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
    "rating": "4.8"
  },
  {
    "id": "d4",
    "name": "Dr. Smita Patil",
    "specialization": "Orthopedics",
    "experience": 8,
    "fees": 600,
    "bio": "Renowned expert in Orthopedics with over 8 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    "rating": "5.0"
  },
  {
    "id": "d5",
    "name": "Dr. Arjun Reddy",
    "specialization": "General Medicine",
    "experience": 9,
    "fees": 700,
    "bio": "Renowned expert in General Medicine with over 9 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    "rating": "4.6"
  },
  {
    "id": "d6",
    "name": "Dr. Vikram Seth",
    "specialization": "Dermatology",
    "experience": 10,
    "fees": 800,
    "bio": "Renowned expert in Dermatology with over 10 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
    "rating": "4.7"
  },
  {
    "id": "d7",
    "name": "Dr. Anjali Menon",
    "specialization": "General Surgery",
    "experience": 11,
    "fees": 900,
    "bio": "Renowned expert in General Surgery with over 11 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
    "rating": "4.7"
  },
  {
    "id": "d8",
    "name": "Dr. Sanjay Gupta",
    "specialization": "Gynecology",
    "experience": 12,
    "fees": 1000,
    "bio": "Renowned expert in Gynecology with over 12 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    "rating": "5.0"
  },
  {
    "id": "d9",
    "name": "Dr. Priya Mani",
    "specialization": "Psychiatry",
    "experience": 13,
    "fees": 1100,
    "bio": "Renowned expert in Psychiatry with over 13 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    "rating": "4.9"
  },
  {
    "id": "d10",
    "name": "Dr. Rahul Bose",
    "specialization": "Cardiology",
    "experience": 14,
    "fees": 1200,
    "bio": "Renowned expert in Cardiology with over 14 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
    "rating": "4.7"
  },
  {
    "id": "d11",
    "name": "Dr. Kavita Krishnamurthy",
    "specialization": "Pediatrics",
    "experience": 15,
    "fees": 300,
    "bio": "Renowned expert in Pediatrics with over 15 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
    "rating": "4.5"
  },
  {
    "id": "d12",
    "name": "Dr. Neeraj Chopra",
    "specialization": "Neurology",
    "experience": 16,
    "fees": 400,
    "bio": "Renowned expert in Neurology with over 16 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    "rating": "4.7"
  },
  {
    "id": "d13",
    "name": "Dr. Sindhu V.",
    "specialization": "Orthopedics",
    "experience": 17,
    "fees": 500,
    "bio": "Renowned expert in Orthopedics with over 17 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    "rating": "4.6"
  },
  {
    "id": "d14",
    "name": "Dr. Mahesh Babu",
    "specialization": "General Medicine",
    "experience": 18,
    "fees": 600,
    "bio": "Renowned expert in General Medicine with over 18 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
    "rating": "4.7"
  },
  {
    "id": "d15",
    "name": "Dr. Kamal Haasan",
    "specialization": "Dermatology",
    "experience": 19,
    "fees": 700,
    "bio": "Renowned expert in Dermatology with over 19 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
    "rating": "4.8"
  },
  {
    "id": "d16",
    "name": "Dr. Tabu",
    "specialization": "General Surgery",
    "experience": 20,
    "fees": 800,
    "bio": "Renowned expert in General Surgery with over 20 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    "rating": "4.8"
  },
  {
    "id": "d17",
    "name": "Dr. Irfan Khan",
    "specialization": "Gynecology",
    "experience": 21,
    "fees": 900,
    "bio": "Renowned expert in Gynecology with over 21 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    "rating": "4.9"
  },
  {
    "id": "d18",
    "name": "Dr. Nawazuddin",
    "specialization": "Psychiatry",
    "experience": 22,
    "fees": 1000,
    "bio": "Renowned expert in Psychiatry with over 22 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
    "rating": "4.7"
  },
  {
    "id": "d19",
    "name": "Dr. Pankaj Tripathi",
    "specialization": "Cardiology",
    "experience": 23,
    "fees": 1100,
    "bio": "Renowned expert in Cardiology with over 23 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
    "rating": "4.8"
  },
  {
    "id": "d20",
    "name": "Dr. Manoj Bajpayee",
    "specialization": "Pediatrics",
    "experience": 24,
    "fees": 1200,
    "bio": "Renowned expert in Pediatrics with over 24 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    "rating": "5.0"
  },
  {
    "id": "d21",
    "name": "Dr. Ratna Pathak",
    "specialization": "Neurology",
    "experience": 5,
    "fees": 300,
    "bio": "Renowned expert in Neurology with over 5 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    "rating": "4.6"
  },
  {
    "id": "d22",
    "name": "Dr. Naseeruddin Shah",
    "specialization": "Orthopedics",
    "experience": 6,
    "fees": 400,
    "bio": "Renowned expert in Orthopedics with over 6 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
    "rating": "4.6"
  },
  {
    "id": "d23",
    "name": "Dr. Shabana Azmi",
    "specialization": "General Medicine",
    "experience": 7,
    "fees": 500,
    "bio": "Renowned expert in General Medicine with over 7 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
    "rating": "4.9"
  },
  {
    "id": "d24",
    "name": "Dr. Om Puri",
    "specialization": "Dermatology",
    "experience": 8,
    "fees": 600,
    "bio": "Renowned expert in Dermatology with over 8 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    "rating": "4.8"
  },
  {
    "id": "d25",
    "name": "Dr. Amrish Puri",
    "specialization": "General Surgery",
    "experience": 9,
    "fees": 700,
    "bio": "Renowned expert in General Surgery with over 9 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    "rating": "4.6"
  },
  {
    "id": "d26",
    "name": "Dr. Rekha",
    "specialization": "Gynecology",
    "experience": 10,
    "fees": 800,
    "bio": "Renowned expert in Gynecology with over 10 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
    "rating": "4.9"
  },
  {
    "id": "d27",
    "name": "Dr. Hema Malini",
    "specialization": "Psychiatry",
    "experience": 11,
    "fees": 900,
    "bio": "Renowned expert in Psychiatry with over 11 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
    "rating": "5.0"
  },
  {
    "id": "d28",
    "name": "Dr. Amitabh",
    "specialization": "Cardiology",
    "experience": 12,
    "fees": 1000,
    "bio": "Renowned expert in Cardiology with over 12 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    "rating": "4.8"
  },
  {
    "id": "d29",
    "name": "Dr. Shah Rukh",
    "specialization": "Pediatrics",
    "experience": 13,
    "fees": 1100,
    "bio": "Renowned expert in Pediatrics with over 13 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    "rating": "4.7"
  },
  {
    "id": "d30",
    "name": "Dr. Salman",
    "specialization": "Neurology",
    "experience": 14,
    "fees": 1200,
    "bio": "Renowned expert in Neurology with over 14 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
    "rating": "4.9"
  },
  {
    "id": "d31",
    "name": "Dr. Aamir",
    "specialization": "Orthopedics",
    "experience": 15,
    "fees": 300,
    "bio": "Renowned expert in Orthopedics with over 15 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
    "rating": "4.9"
  },
  {
    "id": "d32",
    "name": "Dr. Katrina Kaif",
    "specialization": "General Medicine",
    "experience": 16,
    "fees": 400,
    "bio": "Renowned expert in General Medicine with over 16 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    "rating": "5.0"
  },
  {
    "id": "d33",
    "name": "Dr. Deepika P",
    "specialization": "Dermatology",
    "experience": 17,
    "fees": 500,
    "bio": "Renowned expert in Dermatology with over 17 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    "rating": "4.5"
  },
  {
    "id": "d34",
    "name": "Dr. Ranbir Kapoor",
    "specialization": "General Surgery",
    "experience": 18,
    "fees": 600,
    "bio": "Renowned expert in General Surgery with over 18 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
    "rating": "4.7"
  },
  {
    "id": "d35",
    "name": "Dr. Alia Bhatt",
    "specialization": "Gynecology",
    "experience": 19,
    "fees": 700,
    "bio": "Renowned expert in Gynecology with over 19 years of clinical excellence.",
    "image": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
    "rating": "4.7"
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

const MOCK_USERS_STORE = [];
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
      const stored = MOCK_USERS_STORE.find(u => u.email === email.toLowerCase());
      if (stored) return stored;
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
    const newUser = {
      id: 'mock-user-' + Date.now(),
      email: email.toLowerCase(),
      name,
      role,
      ...rest,
      created_at: new Date()
    };
    MOCK_USERS_STORE.push(newUser);
    return newUser;
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
