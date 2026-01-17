const express = require('express');
const router = express.Router();
const { Order, OrderItem, Medicine } = require('../models');
const { requireAuth } = require('../middleware/auth');

// Cart View
router.get('/cart', requireAuth, (req, res) => {
    res.render('cart', { user: req.user });
});

// Checkout Process
router.post('/checkout', requireAuth, async (req, res) => {
    try {
        const { items, address, paymentMethod } = req.body;
        // items = [{ id, quantity }]

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        let totalAmount = 0;
        const orderItemsData = [];

        // validate items and calculate total
        for (const item of items) {
            const medicine = await Medicine.findByPk(item.id);
            if (medicine) {
                totalAmount += medicine.price * item.quantity;
                orderItemsData.push({
                    medicineId: medicine.id,
                    quantity: item.quantity,
                    price: medicine.price
                });
            }
        }

        // Create Order
        const order = await Order.create({
            userId: req.user.id,
            totalAmount,
            shippingAddress: address,
            status: 'paid' // Mocking successful payment
        });

        // Create Order Items
        for (const data of orderItemsData) {
            await OrderItem.create({ ...data, orderId: order.id });
        }

        res.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: 'Checkout failed' });
    }
});

// Order History
router.get('/my', requireAuth, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [{ model: Medicine, as: 'medicine' }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

module.exports = router;
