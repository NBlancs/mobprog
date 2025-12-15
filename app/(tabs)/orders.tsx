// orders.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
// ⭐️ Import the useOrders hook
import { useOrders } from "context/OrderContext";

// MOCK DATA IS REMOVED - Data comes from useOrders()

export default function OrdersScreen() {
    // ⭐️ Use the context to get the real, dynamic list of orders
    const { orders, isLoading, fetchOrders } = useOrders(); 
    
    // Filter the orders to show active orders (Pending or Delivering)
    // These are orders that haven't been completed or cancelled yet
    const activeOrders = orders.filter(order => 
        order.status === "Pending" || order.status === "Delivering"
    );

    // Function to navigate directly to the tracking screen
    const handleOrderPress = (orderId: string) => {
        router.push({
            pathname: "/order-success",
            params: { id: orderId },
        });
    };

    // Refresh orders when screen is focused
    const handleRefresh = () => {
        fetchOrders();
    };

    return (
        <View style={styles.container}>
            {/* Header Bar */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Current Orders</Text>
                <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                    <FontAwesome name="refresh" size={20} color="#DA7807" />
                </TouchableOpacity>
            </View>

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading orders...</Text>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {activeOrders.map((order) => {
                    
                    // ⭐️ This is the correct way to build the summary string from the items array
                    const itemSummary = order.items
                        .map(item => `${item.name} (x${item.quantity})`)
                        .join(', ');

                    return (
                        <TouchableOpacity
                            key={order.id}
                            style={[styles.orderCard, { borderColor: order.color }]}
                            onPress={() => handleOrderPress(order.id)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.orderInfo}>
                                <Text style={styles.orderId}>Order #{order.id}</Text>
                                {/* ⭐️ Use itemSummary and limit line count */}
                                <Text style={styles.orderName} numberOfLines={1}>
                                    {itemSummary}
                                </Text>
                                {/* ⭐️ Use the date property */}
                                <Text style={styles.orderDate}>Placed: {order.date}</Text>
                            </View>
                            <View style={styles.orderStatusContainer}>
                                {/* ⭐️ Format the total number to two decimal places */}
                                <Text style={[styles.orderTotal, { color: order.color }]}>
                                    ₱{order.total.toFixed(2)}
                                </Text>
                                <Text style={[styles.orderStatus, { color: order.color, marginRight: 10 }]}>
                                    {order.status}
                                </Text>
                                <FontAwesome name="chevron-right" size={16} color="#DA7807" />
                            </View>
                        </TouchableOpacity>
                    );
                })}

                {/* Empty state placeholder */}
                {activeOrders.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <FontAwesome name="history" size={50} color="#DA7807" />
                        <Text style={styles.emptyText}>No active orders being delivered right now.</Text>
                        <TouchableOpacity style={styles.linkButton}>
                           <Text style={styles.linkText}>View Order History</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fefaf5",
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: "900",
        color: "#DA7807",
    },
    refreshButton: {
        padding: 10,
    },
    loadingContainer: {
        padding: 20,
        alignItems: "center",
    },
    loadingText: {
        color: "#DA7807",
        fontSize: 16,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    orderCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        borderLeftWidth: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    orderInfo: {
        flex: 1,
    },
    orderId: {
        fontSize: 12,
        color: "#999",
        marginBottom: 5,
    },
    orderName: { // Now holds the item summary string
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        marginBottom: 5,
    },
    orderDate: {
        fontSize: 14,
        color: "#666",
    },
    orderStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: "center",
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: "800",
        marginRight: 15,
    },
    orderStatus: {
        fontSize: 16,
        fontWeight: "bold",
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    emptyText: {
        marginTop: 15,
        fontSize: 16,
        color: "#666",
        fontWeight: '600',
        textAlign: 'center',
    },
    linkButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#DA7807',
        borderRadius: 25,
    },
    linkText: {
        color: '#DA7807',
        fontWeight: '700',
    }
});