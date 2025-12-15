// context/OrderContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { CartItem as CheckoutItem } from './CartContext';

// Use localhost for web, your local IP for mobile devices
// To find your IP: run `ipconfig` in terminal and look for IPv4 Address
const getApiUrl = () => {
    if (Platform.OS === 'web') {
        return "http://localhost:3000";
    }
    // Replace with your machine's IP for mobile testing
    return "http://192.168.1.57:3000";
};

const API_URL = getApiUrl();

// Define the type for a single Order History entry
export type Order = {
    id: string;
    _id?: string;
    date: string;
    status: 'Pending' | 'Delivering' | 'Delivered' | 'Cancelled';
    total: number;
    items: OrderItemSummary[];
    icon: string;
    color: string;
    deliveryAddress?: {
        street?: string;
        city?: string;
        province?: string;
    };
    paymentMethod?: string;
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
    isLoading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    addOrder: (newOrderItems: CheckoutItem[], grandTotal: number, deliveryAddress?: Order['deliveryAddress'], paymentMethod?: string) => Promise<string | null>;
    updateOrderStatus: (orderId: string, status: Order['status']) => Promise<boolean>;
    cancelOrder: (orderId: string) => Promise<boolean>;
}

// 1. Create the Context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// 2. Create the Provider Component
export const OrderProvider = ({ children }: { children: ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Helper to get auth token
    const getToken = async () => {
        return await AsyncStorage.getItem('token');
    };

    // Fetch all orders for the user
    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const token = await getToken();
            if (!token) {
                setOrders([]);
                return;
            }

            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch orders');
            }

            setOrders(data.orders || []);
        } catch (err: any) {
            console.error('Error fetching orders:', err.message);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch orders on mount
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    /**
     * Adds a new order to the database
     */
    const addOrder = async (
        newOrderItems: CheckoutItem[], 
        grandTotal: number,
        deliveryAddress?: Order['deliveryAddress'],
        paymentMethod?: string
    ): Promise<string | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const token = await getToken();
            if (!token) {
                throw new Error('Please login to place an order');
            }

            const items = newOrderItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }));

            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items,
                    total: grandTotal,
                    deliveryAddress,
                    paymentMethod
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to place order');
            }

            // Add the new order to the local state
            setOrders(prevOrders => [data.order, ...prevOrders]);
            
            return data.order.id;
        } catch (err: any) {
            console.error('Error creating order:', err.message);
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };
    
    /**
     * Updates the status of an existing order
     */
    const updateOrderStatus = async (orderId: string, newStatus: Order['status']): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const token = await getToken();
            if (!token) {
                throw new Error('Please login to update order');
            }

            const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update order');
            }

            // Update local state
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, ...data.order } : order
                )
            );

            return true;
        } catch (err: any) {
            console.error('Error updating order:', err.message);
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Cancels an order (soft delete)
     */
    const cancelOrder = async (orderId: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const token = await getToken();
            if (!token) {
                throw new Error('Please login to cancel order');
            }

            const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to cancel order');
            }

            // Update local state
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, ...data.order } : order
                )
            );

            return true;
        } catch (err: any) {
            console.error('Error cancelling order:', err.message);
            setError(err.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <OrderContext.Provider value={{ 
            orders, 
            isLoading, 
            error, 
            fetchOrders, 
            addOrder, 
            updateOrderStatus,
            cancelOrder 
        }}>
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