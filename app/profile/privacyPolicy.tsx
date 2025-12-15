// app/settings/privacyPolicy.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- Static Privacy Policy Content ---
const policyContent = {
    effectiveDate: "Effective Date: December 10, 2025",
    sections: [
        {
            title: "1. Information We Collect",
            body: "We collect two types of information: (a) **Personal Data** (Name, email address, phone number, payment information, and delivery address) provided directly by you during account creation and ordering; and (b) **Usage Data** (IP address, device ID, app activity, and geolocation data during order placement) collected automatically through analytics tools."
        },
        {
            title: "2. How We Use Your Information",
            body: "Your information is primarily used to: process and fulfill your food orders, communicate with you regarding your order status, improve and personalize the app experience, and comply with legal obligations."
        },
        {
            title: "3. Sharing Your Data",
            body: "We share your Personal Data only when necessary to provide the service: (a) with the **Restaurant** to prepare your order; (b) with the **Delivery Driver** for fulfillment; and (c) with **Payment Processors** to complete transactions. We do not sell your personal data to third parties."
        },
        {
            title: "4. Data Security",
            body: "We use industry-standard measures (including encryption and secure servers) to protect the confidentiality and security of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure."
        },
        {
            title: "5. Your Data Rights",
            body: "You have the right to access, update, or delete your personal data. You can usually manage or delete your account information directly within the Profile settings of the app."
        },
    ]
};


export default function PrivacyPolicyScreen() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <FontAwesome name="chevron-left" size={22} color="#DA7807" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <Text style={styles.effectiveDate}>{policyContent.effectiveDate}</Text>
                
                {policyContent.sections.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={styles.sectionBody}>{section.body}</Text>
                    </View>
                ))}

                <Text style={styles.contactFooter}>
                    For questions about this policy, please reach out via our Help Center.
                </Text>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
    effectiveDate: {
        fontSize: 14,
        color: "#888",
        marginBottom: 20,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        marginBottom: 5,
    },
    sectionBody: {
        fontSize: 16,
        lineHeight: 24,
        color: "#555",
        textAlign: 'justify',
    },
    contactFooter: {
        fontSize: 15,
        color: "#DA7807",
        marginTop: 30,
        fontWeight: '600',
    }
});