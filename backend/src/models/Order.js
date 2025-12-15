import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: "Order must have at least one item"
        }
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Delivering', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    icon: {
        type: String,
        default: 'cogs'
    },
    color: {
        type: String,
        default: '#DA7807'
    },
    deliveryAddress: {
        street: { type: String },
        city: { type: String },
        province: { type: String }
    },
    paymentMethod: {
        type: String,
        default: 'Cash on Delivery'
    }
}, { timestamps: true });

// Generate unique order ID before saving
orderSchema.pre('save', function(next) {
    if (!this.orderId) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const uniqueNum = Math.floor(Math.random() * 900) + 100;
        this.orderId = `ORD-${year}${month}${day}-${uniqueNum}`;
    }
    next();
});

export default mongoose.model('Order', orderSchema);
