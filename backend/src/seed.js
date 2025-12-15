import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import User from "./models/User.js";

dotenv.config();

// Product data matching the foods array in app/food/[id].tsx
const products = [
    {
        id: 1,
        name: "Cheese Burger",
        category: "Fast Food",
        price: 120,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        description: "Delicious cheese burger with fresh ingredients, crispy lettuce, and melted cheese.",
        rating: 4.5,
        reviews: 124,
        location: "Manila",
        contactNumber: "09123456789"
    },
    {
        id: 2,
        name: "Pepperoni Pizza",
        category: "Fast Food",
        price: 180,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
        description: "Classic pepperoni pizza with mozzarella cheese and crispy crust.",
        rating: 3.9,
        reviews: 88,
        location: "Manila",
        contactNumber: "09123456789"
    },
    {
        id: 3,
        name: "Sushi Roll",
        category: "Japanese",
        price: 250,
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500",
        description: "Fresh sushi rolls with premium fish and seasoned rice.",
        rating: 4.8,
        reviews: 302,
        location: "Makati",
        contactNumber: "09123456789"
    },
    {
        id: 4,
        name: "Pasta Carbonara",
        category: "Italian",
        price: 200,
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500",
        description: "Creamy pasta carbonara with bacon and parmesan cheese.",
        rating: 4.0,
        reviews: 55,
        location: "Quezon City",
        contactNumber: "09123456789"
    },
    {
        id: 5,
        name: "Fried Chicken",
        category: "Fast Food",
        price: 150,
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500",
        description: "Crispy fried chicken with secret spices and herbs.",
        rating: 4.7,
        reviews: 155,
        location: "Manila",
        contactNumber: "09123456789"
    },
    {
        id: 6,
        name: "Milk Tea",
        category: "Drinks",
        price: 100,
        image: "https://images.unsplash.com/photo-1558857563-b371033873b8?w=500",
        description: "Refreshing milk tea with tapioca pearls.",
        rating: 4.1,
        reviews: 250,
        location: "Manila",
        contactNumber: "09123456789"
    },
    {
        id: 7,
        name: "Beef Tacos",
        category: "Mexican",
        price: 145,
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500",
        description: "Authentic beef tacos with fresh salsa and guacamole.",
        rating: 4.3,
        reviews: 92,
        location: "Makati",
        contactNumber: "09123456789"
    },
    {
        id: 8,
        name: "Chicken Kebab",
        category: "Mediterranean",
        price: 220,
        image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500",
        description: "Grilled chicken kebab with Mediterranean spices.",
        rating: 4.9,
        reviews: 410,
        location: "Quezon City",
        contactNumber: "09123456789"
    },
    {
        id: 9,
        name: "Vegetable Curry",
        category: "Indian",
        price: 190,
        image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500",
        description: "Rich vegetable curry with aromatic Indian spices.",
        rating: 4.6,
        reviews: 180,
        location: "Manila",
        contactNumber: "09123456789"
    },
    {
        id: 10,
        name: "Ramen Bowl",
        category: "Japanese",
        price: 320,
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500",
        description: "Authentic Japanese ramen with rich pork broth and soft-boiled egg.",
        rating: 4.4,
        reviews: 215,
        location: "Makati",
        contactNumber: "09123456789"
    },
    {
        id: 11,
        name: "Pork Adobo",
        category: "Filipino",
        price: 175,
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500",
        description: "Traditional Filipino pork adobo in savory soy-vinegar sauce.",
        rating: 4.2,
        reviews: 110,
        location: "Manila",
        contactNumber: "09123456789"
    },
    {
        id: 12,
        name: "Fruit Smoothie",
        category: "Drinks",
        price: 130,
        image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500",
        description: "Fresh fruit smoothie made with seasonal fruits.",
        rating: 4.8,
        reviews: 350,
        location: "Quezon City",
        contactNumber: "09123456789"
    },
    {
        id: 13,
        name: "Lasagna",
        category: "Italian",
        price: 280,
        image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500",
        description: "Layered lasagna with meat sauce, ricotta, and mozzarella.",
        rating: 4.5,
        reviews: 135,
        location: "Makati",
        contactNumber: "09123456789"
    },
    {
        id: 14,
        name: "Chocolate Cake",
        category: "Desserts",
        price: 95,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
        description: "Rich chocolate cake with creamy chocolate frosting.",
        rating: 4.9,
        reviews: 500,
        location: "Manila",
        contactNumber: "09123456789"
    },
    {
        id: 15,
        name: "Grilled Fish",
        category: "Seafood",
        price: 350,
        image: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=500",
        description: "Fresh grilled fish with lemon butter sauce.",
        rating: 4.1,
        reviews: 75,
        location: "Quezon City",
        contactNumber: "09123456789"
    },
];

const seedDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Find or create a default user for the products
        let defaultUser = await User.findOne({ username: "admin" });
        
        if (!defaultUser) {
            console.log("Creating default admin user...");
            defaultUser = new User({
                firstName: "Admin",
                lastName: "User",
                username: "admin",
                email: "admin@quickbite.com",
                password: "admin123456", // Will be hashed by the pre-save hook
                phone: "+639000000000"
            });
            await defaultUser.save();
            console.log("✅ Default admin user created");
        }

        // Clear existing products
        await Product.deleteMany({});
        console.log("🗑️  Cleared existing products");

        // Add user reference to each product
        const productsWithUser = products.map(product => ({
            ...product,
            user: defaultUser._id
        }));

        // Insert products
        await Product.insertMany(productsWithUser);
        console.log(`✅ Successfully seeded ${products.length} products`);

        // List inserted products
        console.log("\n📦 Seeded Products:");
        products.forEach((p, i) => {
            console.log(`   ${i + 1}. ${p.name} (₱${p.price}) - ${p.category}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
