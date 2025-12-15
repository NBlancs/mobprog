// context/OrderContext.tsx
import { createContext, ReactNode, useContext, useState } from 'react';
import { CartItem as CheckoutItem } from './CartContext'; // Use the CartItem type from your CartContext

// Define the type for a single Order History entry
export type Order = {
    id: string;
    date: string;
    status: 'Delivering' | 'Delivered' | 'Cancelled'; // Simplified status for history
    total: number;
    items: OrderItemSummary[];
    icon: string;
    color: string;
};

// Simplified item structure for the history summary
export type OrderItemSummary = {
    name: string;
    quantity: number;
    price: number;
};

// Define the context shape
interface OrderContextType {
    orders: Order[];
    // We are now accepting the CartItem type, which is alias to CheckoutItem
    addOrder: (newOrderItems: CheckoutItem[], grandTotal: number) => string; 
    // New function needed for the Orders page to update status
    updateOrderStatus: (orderId: string, status: Order['status']) => void; 
}

// 1. Create the Context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// --- MOCK INITIAL HISTORY DATA ---
const INITIAL_ORDERS: Order[] = [
    {
        id: "ORD-2023005",
        date: "12/9/2023",
        status: "Delivered",
        total: 350.00,
        items: [{name: "Cheese Burger", quantity: 1, price: 150}, {name: "Milk Tea", quantity: 2, price: 100}],
        icon: "truck",
        color: "#28A745", // Green (Delivered)
    },
    {
        id: "ORD-2023004",
        date: "11/28/2023",
        status: "Delivered",
        total: 220.00,
        items: [{name: "Chicken Kebab", quantity: 1, price: 220}],
        icon: "truck",
        color: "#28A745",
    },
];
// -----------------------------------------------------------------

// 2. Create the Provider Component
export const OrderProvider = ({ children }: { children: ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

    // Function to generate a unique ID
    const generateOrderId = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const uniqueNum = Math.floor(Math.random() * 900) + 100; 
        return `ORD-${year}${month}${day}-${uniqueNum}`;
    };

    /**
     * Adds a new order to the list upon successful checkout.
     */
    const addOrder = (newOrderItems: CheckoutItem[], grandTotal: number) => {
        const newOrderId = generateOrderId();
        
        // Map the detailed checkout items to the simplified order summary format
        const summaryItems: OrderItemSummary[] = newOrderItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        }));
        
        const now = new Date();
        const formattedDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

        const newOrder: Order = {
            id: newOrderId,
            date: formattedDate,
            status: 'Delivering', // Newly placed orders start as Delivering
            total: grandTotal,
            items: summaryItems,
            icon: "cogs", // Orange/active icon
            color: "#DA7807", 
        };

        // Prepend the new order to the list (so it shows up first)
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        
        return newOrderId;
    };
    
    /**
     * Updates the status of an existing order. Useful for simulating 'Delivered'.
     */
    const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
        setOrders(prevOrders => 
            prevOrders.map(order => {
                if (order.id === orderId) {
                    let icon = order.icon;
                    let color = order.color;
                    
                    if (newStatus === 'Delivered') {
                        icon = 'truck';
                        color = '#28A745'; // Green
                    } else if (newStatus === 'Cancelled') {
                        icon = 'times-circle';
                        color = '#D9534F'; // Red
                    }

                    return { ...order, status: newStatus, icon, color };
                }
                return order;
            })
        );
    };


    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
            {children}
        </OrderContext.Provider>
    );
};

// 3. Create a Custom Hook for easy consumption
export const useOrders = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};