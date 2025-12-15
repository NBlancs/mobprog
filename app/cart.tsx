// app/cart.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { CartItem, useCart } from "../context/CartContext"; // Ensure this path is correct

export default function CartScreen() {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount } = useCart();

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItemCard}>
            <Image 
                source={item.image} 
                style={styles.cartItemImage} 
                resizeMode="cover" 
            />
            <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemName}>{item.name ?? 'Item Name Missing'}</Text>
                <Text style={styles.cartItemPrice}>₱{(item.price || 0).toFixed(2)}</Text> 
                
                <View style={styles.quantityControl}>
                    <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        style={styles.quantityButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <FontAwesome name="minus" size={16} color="#DA7807" />
                    </TouchableOpacity>
                    
                    <Text style={styles.quantityText}>{`${item.quantity || 0}`}</Text>
                    
                    <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        style={styles.quantityButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <FontAwesome name="plus" size={16} color="#DA7807" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeButton}>
                <FontAwesome name="trash" size={20} color="red" />
            </TouchableOpacity>
        </View>
    );

    const handleCheckout = () => {
        if (cart.length === 0) {
            Alert.alert("Cart is Empty", "Please add items to your cart before checking out.");
            return;
        }
        
        // Navigate directly to the checkout page
        router.push('/checkout');
    };

    return (
        <View style={styles.container}>
            {/* Header Bar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <FontAwesome name="chevron-left" size={22} color="#DA7807" />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>Your Cart ({`${itemCount ?? 0}`})</Text>
                
                {cart.length > 0 && ( // Only show clear cart if there are items
                    <TouchableOpacity onPress={clearCart}>
                        <FontAwesome name="trash" size={22} color="#DA7807" />
                    </TouchableOpacity>
                )}
                {/* Placeholder for alignment */}
                {cart.length === 0 && <View style={{ width: 22 }} />} 
            </View>

            {cart.length === 0 ? (
                <View style={styles.emptyCartContainer}>
                    <FontAwesome name="shopping-basket" size={80} color="#ccc" />
                    <Text style={styles.emptyCartText}>Your cart is empty.</Text>
                    <TouchableOpacity style={styles.backToShopButton} onPress={() => router.replace('/food')}>
                        <Text style={styles.backToShopButtonText}>Continue Shopping</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cart}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderCartItem}
                        contentContainerStyle={styles.cartList}
                        style={{ flex: 1, marginBottom: 160 }} 
                    />

                    <View style={styles.cartSummary}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Items ({`${itemCount ?? 0}`}):</Text>
                            <Text style={styles.summaryValue}>₱{(cartTotal || 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryTotalText}>Total:</Text>
                            <Text style={styles.summaryTotalValue}>₱{(cartTotal || 0).toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                            <FontAwesome name="arrow-right" size={18} color="#fff" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

// --- Stylesheet ---
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
    cartList: {
        paddingBottom: 20,
    },
    cartItemCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 15,
        marginBottom: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cartItemImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 15,
    },
    cartItemDetails: {
        flex: 1,
        justifyContent: "center",
    },
    cartItemName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    cartItemPrice: {
        fontSize: 16,
        color: "#DA7807",
        fontWeight: "700",
        marginBottom: 8,
    },
    quantityControl: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityButton: {
        backgroundColor: "#f0f0f0",
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    quantityText: {
        fontSize: 16,
        fontWeight: "500",
        marginHorizontal: 12,
        color: "#333",
    },
    removeButton: {
        padding: 10,
        marginLeft: 10,
    },
    cartSummary: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        position: 'absolute', 
        bottom: 0,
        left: 20,
        right: 20,
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    summaryText: {
        fontSize: 16,
        color: "#555",
        fontWeight: "500",
    },
    summaryValue: {
        fontSize: 16,
        color: "#333",
        fontWeight: "600",
    },
    summaryTotalText: {
        fontSize: 20,
        color: "#333",
        fontWeight: "700",
    },
    summaryTotalValue: {
        fontSize: 20,
        color: "#DA7807",
        fontWeight: "800",
    },
    checkoutButton: {
        flexDirection: 'row',
        backgroundColor: "#DA7807",
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        shadowColor: "#DA7807",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    checkoutButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 18,
    },
});