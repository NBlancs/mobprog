import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../../context/CartContext";
import RatingStars from "../components/RatingStars";

// ⭐️ UPDATED FOOD DATA: Must match the data array in app/(tabs)/food.tsx
// This ensures that all 15 items, ratings, and new categories are available
const foods = [
    // Original Items
    {
        id: 1,
        name: "Cheese Burger",
        category: "Fast Food",
        price: 120,
        image: require("../../assets/images/burger.png"),
        rating: 4.5,
        reviews: 124,
    },
    {
        id: 2,
        name: "Pepperoni Pizza",
        category: "Fast Food",
        price: 180,
        image: require("../../assets/images/pizza.png"), // Placeholder
        rating: 3.9,
        reviews: 88,
    },
    {
        id: 3,
        name: "Sushi Roll",
        category: "Japanese",
        price: 250,
        image: require("../../assets/images/sushi.png"), // Placeholder
        rating: 4.8,
        reviews: 302,
    },
    {
        id: 4,
        name: "Pasta Carbonara",
        category: "Italian",
        price: 200,
        image: require("../../assets/images/pasta.png"), // Placeholder
        rating: 4.0,
        reviews: 55,
    },
    {
        id: 5,
        name: "Fried Chicken",
        category: "Fast Food",
        price: 150,
        image: require("../../assets/images/friedchicken.jpg"), // Placeholder
        rating: 4.7,
        reviews: 155,
    },
    {
        id: 6,
        name: "Milk Tea",
        category: "Drinks",
        price: 100,
        image: require("../../assets/images/milktea.jpg"), // Placeholder
        rating: 4.1,
        reviews: 250,
    },
    
    // NEW ITEMS ADDED (IDs 7 through 15)
    {
        id: 7,
        name: "Beef Tacos",
        category: "Mexican",
        price: 145,
        image: require("../../assets/images/beeftacos.jpg"),
        rating: 4.3,
        reviews: 92,
    },
    {
        id: 8,
        name: "Chicken Kebab",
        category: "Mediterranean",
        price: 220,
        image: require("../../assets/images/chickenkebab.jpg"),
        rating: 4.9,
        reviews: 410,
    },
    {
        id: 9,
        name: "Vegetable Curry",
        category: "Indian",
        price: 190,
        image: require("../../assets/images/vegecurry.jpg"),
        rating: 4.6,
        reviews: 180,
    },
    {
        id: 10,
        name: "Ramen Bowl",
        category: "Japanese",
        price: 320,
        image: require("../../assets/images/ramenbowl.jpg"),
        rating: 4.4,
        reviews: 215,
    },
    {
        id: 11,
        name: "Pork Adobo",
        category: "Filipino",
        price: 175,
        image: require("../../assets/images/adobo.jpg"),
        rating: 4.2,
        reviews: 110,
    },
    {
        id: 12,
        name: "Fruit Smoothie",
        category: "Drinks",
        price: 130,
        image: require("../../assets/images/fruitsmoothie.jpg"),
        rating: 4.8,
        reviews: 350,
    },
    {
        id: 13,
        name: "Lasagna",
        category: "Italian",
        price: 280,
        image: require("../../assets/images/lasagna.jpg"),
        rating: 4.5,
        reviews: 135,
    },
    {
        id: 14,
        name: "Chocolate Cake",
        category: "Desserts",
        price: 95,
        image: require("../../assets/images/chocolatecake.jpg"),
        rating: 4.9,
        reviews: 500,
    },
    {
        id: 15,
        name: "Grilled Fish",
        category: "Seafood",
        price: 350,
        image: require("../../assets/images/grilledfish.jpg"),
        rating: 4.1,
        reviews: 75,
    },
];

export default function FoodDetails() {
    const { id } = useLocalSearchParams();
    const foodId = Number(id);
    const food = foods.find((item) => item.id === foodId);

    const { addToCart, itemCount } = useCart(); // Use the cart context

    if (!food) {
        return (
            <View style={styles.container}>
                <Text style={styles.notFoundText}>Food item not found.</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleAddToCartPress = () => {
        addToCart(food); // Pass the entire food item
        Alert.alert("Added to Cart", `${food.name} has been added to your cart.`);
    };

    const handleBuyNow = () => {
        // Implementation remains the same
        router.push({
            pathname: '/checkout', 
            params: { 
                buyNow: 'true', 
                name: food.name,
                price: food.price.toString(),
                id: food.id.toString(),
                imageSource: food.image.toString(), 
            },
        });
    };

    return (
        <View style={styles.container}>
            {/* Header Bar - Consistent with Food.tsx */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <FontAwesome name="chevron-left" size={22} color="#DA7807" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Food Details</Text>
                {/* Cart Icon with Item Count */}
                <TouchableOpacity onPress={() => router.push('/cart')}>
                    <FontAwesome name="shopping-cart" size={22} color="#DA7807" />
                    {itemCount > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{itemCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image source={food.image} style={styles.image} />
                <Text style={styles.name}>{food.name}</Text>
                
                {/* Rating and Price Row */}
                <View style={styles.ratingPriceRow}>
                    <RatingStars 
                        rating={food.rating} 
                        size={20} 
                        reviews={food.reviews} 
                        showReviews={true} 
                        color="#DA7807" 
                    />
                    <Text style={styles.price}>₱{food.price}</Text>
                </View>

                <Text style={styles.category}>Category: {food.category}</Text>

                <View style={styles.descriptionCard}>
                    <Text style={styles.descriptionHeader}>About This Item</Text>
                    <Text style={styles.description}>
                        This delicious {food.name} is a fantastic choice from our {food.category} selection.
                        Prepared with fresh ingredients and served with care, it's perfect for a quick bite or a satisfying meal.
                        Enjoy this flavorful dish at an unbeatable price!
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCartPress}>
                        <FontAwesome name="cart-plus" size={18} color="#DA7807" style={{ marginRight: 10 }} />
                        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
                        <FontAwesome name="money" size={18} color="#fff" style={{ marginRight: 10 }} />
                        <Text style={styles.buyNowButtonText}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fefaf5",
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    notFoundText: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 50,
        color: "#DA7807",
    },
    backButton: {
        backgroundColor: "#DA7807",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 20,
        alignSelf: 'center',
    },
    backButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    scrollContent: {
        paddingBottom: 40,
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
    cartBadge: {
        position: 'absolute',
        right: -8,
        top: -8,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    image: {
        width: "100%",
        height: 260,
        borderRadius: 18,
        marginBottom: 10,
    },
    name: {
        fontSize: 32,
        fontWeight: "900",
        color: "#333",
        marginBottom: 5,
    },
    ratingPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingRight: 10,
    },
    price: {
        fontSize: 26,
        color: "#DA7807",
        fontWeight: "800",
    },
    category: {
        fontSize: 18,
        color: "#666",
        fontWeight: "500",
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        marginBottom: 25,
    },
    descriptionCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 30,
    },
    descriptionHeader: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: "#555",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 0,
        marginBottom: 20,
    },
    addToCartButton: {
        flexDirection: 'row',
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#DA7807",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    addToCartButtonText: {
        color: "#DA7807",
        fontWeight: "700",
        fontSize: 16,
    },
    buyNowButton: {
        flexDirection: 'row',
        backgroundColor: "#DA7807",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        marginLeft: 10,
        shadowColor: "#DA7807",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    buyNowButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});