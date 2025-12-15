import express from "express";
import Order from "../models/Order.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

// Helper to get icon and color based on status
const getStatusStyle = (status) => {
    switch (status) {
        case 'Delivered':
            return { icon: 'truck', color: '#28A745' };
        case 'Cancelled':
            return { icon: 'times-circle', color: '#D9534F' };
        case 'Delivering':
            return { icon: 'cogs', color: '#DA7807' };
        case 'Pending':
        default:
            return { icon: 'clock-o', color: '#FFC107' };
    }
};

// CREATE - Place a new order
router.post("/", protectRoute, async (req, res) => {
    try {
        const { items, total, deliveryAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Order must have at least one item" });
        }

        if (!total || total <= 0) {
            return res.status(400).json({ message: "Order total is required" });
        }

        const order = new Order({
            user: req.user._id,
            items,
            total,
            status: 'Pending',
            deliveryAddress: deliveryAddress || {
                street: req.user.street,
                city: req.user.city,
                province: req.user.province
            },
            paymentMethod: paymentMethod || 'Cash on Delivery'
        });

        await order.save();

        res.status(201).json({
            message: "Order placed successfully",
            order: {
                id: order.orderId,
                _id: order._id,
                date: order.createdAt,
                status: order.status,
                total: order.total,
                items: order.items,
                icon: order.icon,
                color: order.color,
                deliveryAddress: order.deliveryAddress,
                paymentMethod: order.paymentMethod
            }
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// READ - Get all orders for the authenticated user
router.get("/", protectRoute, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        const formattedOrders = orders.map(order => ({
            id: order.orderId,
            _id: order._id,
            date: `${order.createdAt.getMonth() + 1}/${order.createdAt.getDate()}/${order.createdAt.getFullYear()}`,
            status: order.status,
            total: order.total,
            items: order.items,
            icon: order.icon,
            color: order.color,
            deliveryAddress: order.deliveryAddress,
            paymentMethod: order.paymentMethod
        }));

        res.status(200).json({ orders: formattedOrders });

    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// READ - Get a single order by ID
router.get("/:id", protectRoute, async (req, res) => {
    try {
        const order = await Order.findOne({
            $or: [
                { _id: req.params.id },
                { orderId: req.params.id }
            ],
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            order: {
                id: order.orderId,
                _id: order._id,
                date: `${order.createdAt.getMonth() + 1}/${order.createdAt.getDate()}/${order.createdAt.getFullYear()}`,
                status: order.status,
                total: order.total,
                items: order.items,
                icon: order.icon,
                color: order.color,
                deliveryAddress: order.deliveryAddress,
                paymentMethod: order.paymentMethod
            }
        });

    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// UPDATE - Update order status
router.put("/:id", protectRoute, async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const validStatuses = ['Pending', 'Delivering', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findOne({
            $or: [
                { _id: req.params.id },
                { orderId: req.params.id }
            ],
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Prevent updating cancelled or delivered orders
        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: "Cannot update a cancelled order" });
        }

        if (order.status === 'Delivered' && status !== 'Delivered') {
            return res.status(400).json({ message: "Cannot change status of a delivered order" });
        }

        // Update status and style
        const { icon, color } = getStatusStyle(status);
        order.status = status;
        order.icon = icon;
        order.color = color;

        await order.save();

        res.status(200).json({
            message: "Order updated successfully",
            order: {
                id: order.orderId,
                _id: order._id,
                date: `${order.createdAt.getMonth() + 1}/${order.createdAt.getDate()}/${order.createdAt.getFullYear()}`,
                status: order.status,
                total: order.total,
                items: order.items,
                icon: order.icon,
                color: order.color
            }
        });

    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// DELETE - Soft delete (cancel) an order
router.delete("/:id", protectRoute, async (req, res) => {
    try {
        const order = await Order.findOne({
            $or: [
                { _id: req.params.id },
                { orderId: req.params.id }
            ],
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Can only cancel pending or delivering orders
        if (order.status === 'Delivered') {
            return res.status(400).json({ message: "Cannot cancel a delivered order" });
        }

        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: "Order is already cancelled" });
        }

        // Soft delete - set status to Cancelled
        const { icon, color } = getStatusStyle('Cancelled');
        order.status = 'Cancelled';
        order.icon = icon;
        order.color = color;

        await order.save();

        res.status(200).json({
            message: "Order cancelled successfully",
            order: {
                id: order.orderId,
                _id: order._id,
                status: order.status,
                icon: order.icon,
                color: order.color
            }
        });

    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
