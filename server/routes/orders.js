const express = require('express');
const router = express.Router();
const { getMedicineById, createOrder, getOrdersByUser } = require('../database');
const { requireAuth } = require('../middleware/auth');

// Cart View
router.get('/cart', requireAuth, (req, res) => {
    res.render('cart', { user: req.user });
});

// Checkout Process
router.post('/checkout', requireAuth, async (req, res) => {
    try {
        const { items, address, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        let totalAmount = 0;
        const orderItems = [];

        // validate items and calculate total
        for (const item of items) {
            const medicine = await getMedicineById(item.id);
            if (medicine) {
                totalAmount += medicine.price * item.quantity;
                orderItems.push({
                    medicineId: medicine.id,
                    name: medicine.name,
                    quantity: item.quantity,
                    price: medicine.price
                });
            }
        }

        // Create Order in Firestore
        const order = await createOrder({
            userId: req.user.id,
            totalAmount,
            shippingAddress: address,
            paymentMethod: paymentMethod || 'credit_card',
            status: 'paid', // Mocking successful payment
            items: orderItems,
            createdAt: new Date()
        });

        res.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: 'Checkout failed' });
    }
});

// Order History
router.get('/my', requireAuth, async (req, res) => {
    try {
        const orders = await getOrdersByUser(req.user.id);
        res.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

module.exports = router;
