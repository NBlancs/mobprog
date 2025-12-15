// app/profile/orderHistory.tsx (MODIFIED)
import { FontAwesome } from "@expo/vector-icons";
import { Order, useOrders } from "context/OrderContext"; // ⭐️ NEW IMPORT
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- MOCK DATA REMOVED --- 

// Component to display a single order card
const OrderCard = ({ order }: { order: Order }) => {
    const handleReorder = () => {
        alert(`Reordering items from ${order.id}`);
    };
    
    const handleViewDetails = () => {
        // Navigate to the Order Details/Tracking screen using the order ID
        router.push({
            pathname: '/order-success', 
            params: { id: order.id } 
        });
    };

    // Convert the items list to a single summary string for display
    const itemSummary = order.items
        .map(item => `${item.name} (x${item.quantity})`)
        .join(', ');

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: order.color }]}>
                    {/* Use order.icon and order.color from context data */}
                    <FontAwesome name={order.icon as any} size={12} color="#fff" style={{ marginRight: 5 }} />
                    <Text style={styles.statusText}>{order.status}</Text>
                </View>
            </View>
            
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailValue}>{order.date}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Total:</Text>
                <Text style={styles.totalValue}>₱{order.total.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Items:</Text>
                {/* Use the dynamically created item summary */}
                <Text style={styles.detailValueItems} numberOfLines={1}>{itemSummary}</Text>
            </View>

            <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.detailButton} onPress={handleViewDetails}>
                    <Text style={styles.detailButtonText}>View Details</Text>
                </TouchableOpacity>
                {order.status === 'Delivered' && (
                    <TouchableOpacity style={styles.reorderButton} onPress={handleReorder}>
                        <FontAwesome name="refresh" size={16} color="#fff" style={{ marginRight: 5 }} />
                        <Text style={styles.reorderButtonText}>Reorder</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default function OrderHistoryScreen() {
    const { orders } = useOrders(); // ⭐️ NEW: Fetch the real list of orders
    
    // We can filter out actively delivering orders if we only want 'history', 
    // but for now, showing all orders is a safe default.
    const historicalOrders = orders.filter(order => order.status !== 'Delivering');

    return (
        <View style={styles.container}>
            {/* Header Bar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <FontAwesome name="chevron-left" size={22} color="#DA7807" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order History</Text>
                <View style={{ width: 22 }} />
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {historicalOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                ))}

                {historicalOrders.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <FontAwesome name="shopping-bag" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>You haven't placed any completed orders yet!</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
// ... (The styles remain the same as the ones you provided previously)
    container: {
        flex: 1,
        backgroundColor: "#fefaf5",
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#DA7807",
    },
    backIcon: {
        padding: 5,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    // Card Styles
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderLeftWidth: 5,
        borderLeftColor: '#DA7807',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        paddingBottom: 8,
        marginBottom: 8,
    },
    orderId: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 3,
    },
    detailLabel: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 15,
        color: '#333',
        fontWeight: '600',
    },
    detailValueItems: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
        flexShrink: 1,
        marginLeft: 10,
        textAlign: 'right',
    },
    totalValue: {
        fontSize: 18,
        color: '#DA7807',
        fontWeight: '800',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
        paddingTop: 10,
    },
    detailButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DA7807',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailButtonText: {
        color: '#DA7807',
        fontWeight: '600',
        fontSize: 14,
    },
    reorderButton: {
        flexDirection: 'row',
        backgroundColor: '#DA7807',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reorderButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
        marginTop: 50,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginTop: 15,
        fontWeight: '600',
    }
});