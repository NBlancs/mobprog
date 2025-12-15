// order-success.tsx (MODIFIED)
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router"; // Import useLocalSearchParams
import { useEffect, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useOrders } from "../context/OrderContext"; // ⭐️ NEW IMPORT: Get the orders and the update function
import RatingStars from "./components/RatingStars";

const { width } = Dimensions.get('window');

// --- Component Start ---
export default function OrderSuccessScreen() {
    // ⭐️ NEW: Get context functions and data
    const { orders, updateOrderStatus } = useOrders();
    const params = useLocalSearchParams();
    const orderId = params.id as string | undefined;

    // Find the specific order in the global state
    const order = orders.find(o => o.id === orderId);

    // If the order can't be found, navigate back or show an error
    if (!order) {
        // Fallback case: If we cannot find the order (e.g., initial load issue)
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 18, color: 'red' }}>Order not found. ID: {orderId}</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                     <Text style={styles.backToShopButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // State derived from the order status
    const isDelivered = order.status === 'Delivered';
    const [hasRated, setHasRated] = useState(false);
    const [currentRating, setCurrentRating] = useState(0);

    // Simulate delivery success after 4 seconds IF the order is currently 'Delivering'
    useEffect(() => {
        if (order.status === 'Delivering') {
            const timer = setTimeout(() => {
                // ⭐️ NEW: Update the global state when delivery is successful
                updateOrderStatus(orderId!, 'Delivered'); 
                Alert.alert("Delivery Complete!", `Order ${orderId} has been successfully delivered!`);
            }, 4000); 

            return () => clearTimeout(timer); 
        }
    }, [order.status, orderId, updateOrderStatus]); // Re-run effect if order status changes

    // ⭐️ Updated handler to navigate back
    const handleBackPress = () => {
        router.back(); 
    };

    const handleBackToShop = () => {
        router.replace("/(tabs)/food"); 
    };

    const handleRatingSubmit = (rating: number) => {
        setCurrentRating(rating);
        setHasRated(true);
        Alert.alert("Thank You!", `You rated your order ${rating} stars. Your feedback is appreciated!`);
    };

    const trackingView = (
        <View style={styles.trackingContainer}>
            <Text style={styles.trackingHeader}>📍 Driver Tracking: {orderId}</Text>
            <View style={styles.mapPlaceholder}>
                <FontAwesome name="map-marker" size={40} color="#DA7807" style={{ marginBottom: 10 }} />
                <Text style={styles.placeholderText}>
                    <Text style={{ fontWeight: 'bold' }}>Order Total: ₱{order.total.toFixed(2)}</Text>
                </Text>
                <Text style={styles.placeholderSubText}>
                    (Real-time tracking for order {orderId} is active)
                </Text>
                <Text style={styles.driverStatus}>
                    Driver: John D. | ETA: 25 mins
                </Text>
            </View>
        </View>
    );

    const RatingPrompt = () => (
        <View style={styles.ratingCard}>
            <Text style={styles.ratingHeader}>How was your food?</Text>
            {hasRated ? (
                <>
                    <Text style={styles.thankYouText}>You rated this order:</Text>
                    <RatingStars rating={currentRating} size={30} color="#DA7807" />
                </>
            ) : (
                <View style={styles.starSelectionContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => handleRatingSubmit(star)}
                            activeOpacity={0.8}
                        >
                            <FontAwesome 
                                name={currentRating >= star ? "star" : "star-o"} 
                                size={30} 
                                color="#DA7807" 
                                style={{ marginHorizontal: 5 }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* ⭐️ NEW: Back Button Icon */}
                <TouchableOpacity onPress={handleBackPress} style={styles.backIcon}>
                    <FontAwesome name="chevron-left" size={22} color="#DA7807" />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>Order Details</Text>
                
                {/* Placeholder for symmetry */}
                <View style={{ width: 22, padding: 5 }} /> 
            </View>

            <View style={styles.statusCard}>
                {/* Dynamically show icon based on current order status */}
                <FontAwesome name={isDelivered ? "check-circle" : "truck"} size={50} color={order.color} /> 
                <Text style={styles.statusText}>
                    {isDelivered ? "Delivery Successful!" : `Order Status: ${order.status}`}
                </Text>
                <Text style={styles.deliveryText}>
                    {isDelivered ? "Enjoy your meal! Please rate your experience." : "Your delivery is being tracked."}
                </Text>
            </View>

            {isDelivered ? <RatingPrompt /> : trackingView}
            
            <TouchableOpacity style={styles.backToShopButton} onPress={handleBackToShop}>
                <Text style={styles.backToShopButtonText}>
                    {isDelivered ? "Back to Shopping" : "Back to Home"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
// --- Component End ---

// --- Styles ---
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
        marginBottom: 30,
        paddingHorizontal: 0, 
    },
    backIcon: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#DA7807",
        flex: 1,
        textAlign: 'center',
        marginLeft: -15, 
    },
    statusCard: {
        backgroundColor: "#FFF2E5", 
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#DA7807',
    },
    statusText: {
        fontSize: 22,
        fontWeight: "700",
        color: "#333",
        marginTop: 10,
    },
    deliveryText: {
        fontSize: 16,
        color: "#555",
        marginTop: 5,
    },
    trackingContainer: {
        flex: 1,
        marginBottom: 20,
    },
    trackingHeader: {
        fontSize: 20,
        fontWeight: "700",
        color: "#DA7807",
        marginBottom: 15,
    },
    mapPlaceholder: {
        width: '100%',
        height: width * 0.9, 
        backgroundColor: '#eee',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    placeholderText: {
        fontSize: 18,
        color: '#DA7807',
    },
    placeholderSubText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginHorizontal: 20,
        marginTop: 5,
        marginBottom: 10,
    },
    driverStatus: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 10,
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#DA7807',
    },
    ratingCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    ratingHeader: {
        fontSize: 22,
        fontWeight: '800',
        color: '#333',
        marginBottom: 15,
    },
    starSelectionContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 15,
    },
    thankYouText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    backToShopButton: {
        backgroundColor: "#DA7807",
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        shadowColor: "#DA7807",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    backToShopButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 18,
    },
});