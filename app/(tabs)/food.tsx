import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../context/CartContext";
import RatingStars from "../components/RatingStars";

// ⭐️ EXTENDED FOOD DATA: 9 new items added (Total of 15 items)
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
    
    // NEW ITEMS ADDED
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

const Food: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [searchText, setSearchText] = useState<string>("");

    const { itemCount } = useCart();

    // Dynamically generates categories: All, Fast Food, Japanese, Italian, Drinks, Mexican, etc.
    const categories = ["All", ...new Set(foods.map((item) => item.category))];

    const filteredFoods = foods.filter((item) => {
        const matchesCategory =
            selectedCategory === "All" || item.category === selectedCategory;
        const matchesSearch = item.name
            .toLowerCase()
            .includes(searchText.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <View style={styles.container}>
            {/* Header Bar */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>QuickBite</Text>
                {/* --- CART ICON WITH BADGE --- */}
                <TouchableOpacity onPress={() => router.push("/cart")}>
                    <FontAwesome name="shopping-cart" size={22} color="#DA7807" />
                    {itemCount > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{itemCount ?? 0}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                {/* --- END CART ICON --- */}
            </View>

            {/* Search Bar */}
            <TextInput
                style={styles.searchBar}
                placeholder="Search for a quick bite..."
                placeholderTextColor="#888"
                value={searchText}
                onChangeText={setSearchText}
            />

            {/* Scrollable Category Bar */}
            <View style={{ marginTop: 10 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryContainer}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category && styles.categoryButtonActive,
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === category && styles.categoryTextActive,
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Food Grid */}
            <FlatList
                data={filteredFoods}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                contentContainerStyle={styles.foodList}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() =>
                            router.push({
                                pathname: "/food/[id]",
                                params: { id: item.id.toString() },
                            })
                        }
                        activeOpacity={0.8}
                    >
                        <Image
                            source={item.image}
                            style={styles.foodImage}
                            resizeMode="cover"
                        />
                        <Text style={styles.foodName}>{item.name}</Text>
                        
                        {/* RatingStars Component */}
                        <View style={styles.ratingContainer}>
                            <RatingStars 
                                rating={item.rating} 
                                size={14} 
                                reviews={item.reviews} 
                                showReviews={true}
                                color="#DA7807" 
                            />
                        </View>
                        {/* END RATING */}

                        <Text style={styles.foodPrice}>₱{item.price}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default Food;

// 🧭 Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fefaf5",
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    
    // HEADER
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: "900",
        color: "#DA7807",
    },
    // <--- CART BADGE STYLES ---
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
    },
    cartBadgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    // <--- END CART BADGE STYLES ---

    // SEARCH
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
    },

    // CATEGORY
    categoryContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    categoryButton: {
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginRight: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    categoryButtonActive: {
        backgroundColor: "#DA7807",
    },
    categoryText: {
        fontSize: 16,
        color: "#444",
        fontWeight: "500",
    },
    categoryTextActive: {
        color: "#fff",
        fontWeight: "600",
    },

    // FOOD GRID
    foodList: {
        paddingBottom: 20,
        marginTop: 10,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 16,
        alignItems: "center",
        flex: 0.48,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    foodImage: {
        width: "100%",
        height: 120,
        borderRadius: 12,
    },
    foodName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginTop: 8,
        textAlign: "center",
        marginBottom: 5, 
    },
    ratingContainer: {
        marginVertical: 4, 
    },
    foodPrice: {
        fontSize: 15,
        color: "#DA7807",
        fontWeight: "700",
        marginVertical: 4,
    },
});