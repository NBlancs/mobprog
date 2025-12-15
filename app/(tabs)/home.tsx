import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useCart } from "../../context/CartContext";
// ⭐️ NEW IMPORT: Import the RatingStars component
import { useAuthStore } from "store/authStore";
import RatingStars from "../components/RatingStars";

const { width } = Dimensions.get("window");

const Home = () => {
    const { user } = useAuthStore();
    const [searchText, setSearchText] = useState("");
    const { itemCount } = useCart(); 

    // ⭐️ UPDATED MOCK DATA: Added rating and reviews properties
    const popularOrders = [
        { id: "1", name: "Cheese Burger", price: "₱120", image: require("../../assets/images/burger.png"), rating: 4.5, reviews: 124 },
        { id: "2", name: "Pepperoni Pizza", price: "₱350", image: require("../../assets/images/pizza.png"), rating: 3.9, reviews: 88 },
        { id: "3", name: "Sushi Roll", price: "₱250", image: require("../../assets/images/sushi.png"), rating: 4.8, reviews: 302 },
        { id: "4", name: "Milk Tea", price: "₱100", image: require("../../assets/images/milktea.jpg"), rating: 4.1, reviews: 250 },
        { id: "5", name: "Fried Chicken", price: "₱180", image: require("../../assets/images/friedchicken.jpg"), rating: 4.7, reviews: 155 },
    ];

    const filteredFoods = popularOrders.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleCardPress = (id: string) => {
        router.push({
            pathname: "/food/[id]",
            params: { id },
        });
    };
    
    const handleCartPress = () => {
        router.push("/cart"); // Changed from '/' to '/cart' for clarity
    };

    const handleOrderNowPress = () => {
        // Navigate to the food ordering tab
        router.replace("/food"); 
    };


    return (
        <View style={styles.container}>
            {/* Header Bar - QuickBite Title and Cart Icon with Badge */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>QuickBite</Text>
                <TouchableOpacity onPress={handleCartPress}>
                    <FontAwesome name="shopping-cart" size={22} color="#DA7807" />
                    {itemCount > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{itemCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

                    {/* diri ang pagtawag sa name sa user*/}
            <Text style={styles.welcomeText}>
             Welcome,{" "}
                <Text style={styles.userName}>
                    {user ? user.firstName : ""}
                </Text>
            </Text>

            {/* Search Bar */}
            <TextInput
                style={styles.searchBar}
                placeholder="Search for your favorite food..."
                placeholderTextColor="#888"
                value={searchText}
                onChangeText={setSearchText}
            />

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                
                {/* Promo / Coupons Section - Interactive Cards */}
                <View style={styles.promoContainer}>
                    <Text style={styles.promoTitle}>🎁 Special Coupons</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.couponList}
                    >
                        {/* Coupon Card 1 (TouchableOpacity makes it interactive) */}
                        <TouchableOpacity style={styles.couponCard} activeOpacity={0.8}>
                            <Text style={styles.couponDiscount}>20% OFF</Text>
                            <Text style={styles.couponDesc}>On all pizza orders 🍕</Text>
                        </TouchableOpacity>
                        {/* Coupon Card 2 */}
                        <TouchableOpacity style={styles.couponCard} activeOpacity={0.8}>
                            <Text style={styles.couponDiscount}>₱50 OFF</Text>
                            <Text style={styles.couponDesc}>For first-time orders 🥳</Text>
                        </TouchableOpacity>
                        {/* Coupon Card 3 */}
                        <TouchableOpacity style={styles.couponCard} activeOpacity={0.8}>
                            <Text style={styles.couponDiscount}>Free Delivery</Text>
                            <Text style={styles.couponDesc}>On orders above ₱300 🚴</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Popular Orders Section - Interactive Food Cards */}
                <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Popular Orders</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalList}
                >
                    {filteredFoods.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.foodCard}
                            onPress={() => handleCardPress(item.id)} // Card is touchable
                            activeOpacity={0.8}
                        >
                            <Image source={item.image} style={styles.foodImage} />
                            <Text style={styles.foodName}>{item.name}</Text>
                            
                            {/* ⭐️ NEW: Display Rating */}
                            <RatingStars 
                                rating={item.rating} 
                                size={14} 
                                reviews={item.reviews} 
                                showReviews={true}
                            />

                            <Text style={styles.foodPrice}>{item.price}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Delivery Banner with Call to Action */}
                <View style={styles.deliveryContainer}>
                    <Text style={styles.deliveryTitle}>🚴 Fast Delivery, Fresh Meals</Text>
                    <Text style={styles.deliveryText}>
                        Get your favorite dishes delivered hot and fresh to your doorstep in
                        minutes!
                    </Text>
                    <TouchableOpacity 
                        style={styles.orderNowButton}
                        onPress={handleOrderNowPress}
                    >
                        <Text style={styles.orderNowText}>Order Now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;

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
    },
    headerTitle: { fontSize: 30, fontWeight: "900", color: "#DA7807" },

    cartBadge: {
        position: "absolute",
        right: -8,
        top: -8,
        backgroundColor: "red",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    cartBadgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },

    welcomeText: { fontSize: 16, color: "#666", marginTop: 8 },
    userName: { color: "#DA7807", fontWeight: "bold" },

    searchBar: {
        height: 45,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginTop: 10,
        marginBottom: 20,
    },

    scrollContent: { flex: 1 },

    sectionTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#333",
        marginBottom: 15,
    },
    horizontalList: {
        paddingBottom: 10,
        gap: 15,
    },

    foodCard: {
        backgroundColor: "#fff",
        borderRadius: 20,
        width: width * 0.7, 
        padding: 15,
        marginRight: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
        alignItems: "center",
        overflow: 'hidden', 
        paddingVertical: 20,
    },
    foodImage: {
        width: "100%",
        height: 150,
        borderRadius: 16,
        marginBottom: 10,
    },
    foodName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        textAlign: "center",
        marginBottom: 5, 
    },
    foodPrice: {
        fontSize: 18,
        color: "#DA7807",
        fontWeight: "800",
        marginVertical: 6,
    },

    promoContainer: { marginTop: 5 },
    promoTitle: { fontSize: 20, fontWeight: "700", color: "#333", marginBottom: 10 },
    couponList: { gap: 15, paddingBottom: 10 },
    couponCard: { 
        backgroundColor: "#FFF2E5", 
        borderRadius: 16, 
        padding: 15, 
        width: 180, 
        shadowColor: "#DA7807", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 3, 
        elevation: 4 
    },
    couponDiscount: { fontSize: 20, fontWeight: "900", color: "#DA7807" },
    couponDesc: { fontSize: 14, color: "#555", marginTop: 5 },

    deliveryContainer: { 
        backgroundColor: "#FFF6E9", 
        borderRadius: 20, 
        padding: 20, 
        marginTop: 25, 
        alignItems: "center",
        shadowColor: "#DA7807", 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 5, 
        elevation: 5,
    },
    deliveryTitle: { fontSize: 20, fontWeight: "800", color: "#DA7807", marginBottom: 5 },
    deliveryText: { fontSize: 14, color: "#555", textAlign: "center", marginBottom: 15 },
    orderNowButton: { 
        backgroundColor: "#DA7807", 
        borderRadius: 25, 
        paddingHorizontal: 25, 
        paddingVertical: 12,
        shadowColor: "#DA7807", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 3, 
        elevation: 5
    },
    orderNowText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});