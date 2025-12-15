// app/checkout.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CartItem, useCart } from "../context/CartContext"; // Import CartItem type
import { useOrders } from "../context/OrderContext"; // ⭐️ NEW IMPORT: For recording the order

// You can safely remove the custom CheckoutItem type definition
// We will use CartItem which has the correct structure (id, name, price, quantity)

export default function CheckoutScreen() {
    const { cart, cartTotal, clearCart } = useCart();
    // ⭐️ NEW HOOK USAGE: Get the function to record the order
    const { addOrder } = useOrders(); 
    const params = useLocalSearchParams();

    // --- 1. Flow Determination and Data Preparation ---
    const isBuyNowFlow = params.buyNow === 'true';
    const DELIVERY_FEE = 50.0;
    
    // Use the CartItem type from CartContext
    let orderItems: CartItem[] = []; 
    let subtotal = 0;

    if (isBuyNowFlow) {
        // Case 1: Buy Now Flow (Single Item) - Uses URL params
        const itemId = Number(params.id);
        const itemName = (params.name as string) || 'Single Item';
        const itemPrice = parseFloat((params.price as string) || '0'); 
        
        // Structure the single item to match the CartItem interface
        const singleItem: CartItem = { 
            id: itemId,
            name: itemName,
            price: itemPrice,
            // You must provide these two properties to match the CartItem interface
            quantity: 1, 
            image: null, 
        };
        
        orderItems = [singleItem]; 
        subtotal = itemPrice;
        
    } else {
        // Case 2: Cart Flow (Multiple Items) - Uses Cart Context
        orderItems = cart;
        subtotal = cartTotal;
    }
    
    const grandTotal = subtotal + DELIVERY_FEE;

    // --- 2. Handlers ---
    
    const handlePlaceOrder = async () => {
        if (orderItems.length === 0) {
            Alert.alert("Error", "No items to place an order.", [
                { text: "Go to Menu", onPress: () => router.replace('/food') }
            ]);
            return;
        }

        // ⭐️ STEP 1: Record the new order in the Order Context
        // This generates a unique ID and saves the order to the state
        const newOrderId = await addOrder(orderItems, grandTotal);

        if (!newOrderId) {
            Alert.alert("Error", "Failed to place order. Please try again.");
            return;
        }

        if (!isBuyNowFlow) {
            clearCart(); 
        }

        // ⭐️ STEP 2: Navigate to the Order Success screen, passing the NEW ID
        router.replace({
            pathname: '/order-success',
            params: { id: newOrderId } // Pass the generated ID here!
        });
    };

    const renderCheckoutItem = ({ item }: { item: CartItem }) => ( // Use CartItem type
        <View style={styles.itemRow}>
            <Text style={styles.itemName}>
                {item.name} (x{item.quantity})
            </Text>
            <Text style={styles.itemPrice}>
                ₱{(item.price * item.quantity).toFixed(2)}
            </Text>
        </View>
    );

    // ------------------------------------------------------------------
    if (orderItems.length === 0 && !isBuyNowFlow) {
        return (
            // ... (Empty state view remains the same)
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                        <FontAwesome name="chevron-left" size={22} color="#DA7807" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Checkout (Empty)</Text>
                    <View style={{ width: 22 }} />
                </View>
                <View style={styles.emptyCartContainer}>
                    <FontAwesome name="frown-o" size={80} color="#ccc" />
                    <Text style={styles.emptyCartText}>Your cart is empty!</Text>
                    <TouchableOpacity style={styles.backToShopButton} onPress={() => router.replace('/food')}>
                        <Text style={styles.backToShopButtonText}>Go to Menu</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    // ------------------------------------------------------------------


    return (
        <View style={styles.container}>
            {/* Header Bar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <FontAwesome name="chevron-left" size={22} color="#DA7807" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isBuyNowFlow ? 'Instant Checkout' : 'Finalize Order'}</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionHeader}>Order Summary</Text>
                
                <View style={styles.card}>
                    <FlatList
                        data={orderItems} 
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderCheckoutItem}
                        scrollEnabled={false}
                    />
                </View>

                <Text style={styles.sectionHeader}>Delivery Information</Text>
                <View style={styles.card}>
                    <Text style={styles.infoText}><FontAwesome name="user" size={16} color="#DA7807" /> John Doe</Text>
                    <Text style={styles.infoText}><FontAwesome name="phone" size={16} color="#DA7807" /> +63 912 345 6789</Text>
                    <Text style={styles.infoText}><FontAwesome name="map-marker" size={16} color="#DA7807" /> 123 Food Street, Delicious City, PH</Text>
                    <TouchableOpacity onPress={() => Alert.alert("Edit Address", "Implement address editing functionality here.")}>
                        <Text style={styles.editLink}>Edit Information</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionHeader}>Payment Method</Text>
                <View style={styles.card}>
                    <Text style={styles.infoText}><FontAwesome name="credit-card" size={16} color="#DA7807" /> Cash on Delivery (COD)</Text>
                    <TouchableOpacity onPress={() => Alert.alert("Change Payment", "Implement payment method selection here.")}>
                        <Text style={styles.editLink}>Change Method</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Total Summary and Place Order Button */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Subtotal:</Text>
                    <Text style={styles.totalValue}>₱{subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Delivery Fee:</Text>
                    <Text style={styles.totalValue}>₱{DELIVERY_FEE.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, marginTop: 10 }]}>
                    <Text style={styles.grandTotalLabel}>Grand Total:</Text>
                    <Text style={styles.grandTotalValue}>₱{grandTotal.toFixed(2)}</Text>
                </View>
                
                <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
                    <FontAwesome name="check-circle" size={20} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.placeOrderButtonText}>Place Order (₱{grandTotal.toFixed(2)})</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ... (The styles remain the same)
const styles = StyleSheet.create({
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
        fontSize: 24,
        fontWeight: "700",
        color: "#DA7807",
    },
    backIcon: {
        padding: 5,
    },
    scrollContent: {
        paddingBottom: 200, 
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333",
        marginTop: 15,
        marginBottom: 10,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    itemName: {
        fontSize: 16,
        color: "#555",
        flex: 1,
        fontWeight: '500',
    },
    itemPrice: {
        fontSize: 16,
        color: "#333",
        fontWeight: "600",
    },
    infoText: {
        fontSize: 16,
        color: "#333",
        marginVertical: 4,
        fontWeight: '500',
    },
    editLink: {
        color: "#DA7807",
        fontSize: 14,
        fontWeight: '600',
        marginTop: 5,
        alignSelf: 'flex-start',
    },
    summaryContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    totalLabel: {
        fontSize: 18,
        color: "#555",
        fontWeight: "500",
    },
    totalValue: {
        fontSize: 18,
        color: "#333",
        fontWeight: "600",
    },
    grandTotalLabel: {
        fontSize: 22,
        color: "#333",
        fontWeight: "700",
    },
    grandTotalValue: {
        fontSize: 22,
        color: "#DA7807",
        fontWeight: "800",
    },
    placeOrderButton: {
        flexDirection: 'row',
        backgroundColor: "#DA7807",
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        shadowColor: "#DA7807",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    placeOrderButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 18,
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyCartText: {
        fontSize: 20,
        color: "#666",
        marginTop: 15,
        marginBottom: 30,
        fontWeight: "500",
    },
    backToShopButton: {
        backgroundColor: "#DA7807",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 30,
        shadowColor: "#DA7807",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    backToShopButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});