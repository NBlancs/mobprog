// app/settings/termsOfService.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- Static Terms Content ---
const termsContent = {
    effectiveDate: "Effective Date: December 10, 2025",
    sections: [
        {
            title: "1. Agreement to Terms",
            body: "By accessing or using our food delivery application (the 'Service'), you agree to comply with and be bound by these Terms of Service. Please review them carefully. If you do not agree to these terms, you must not use the Service."
        },
        {
            title: "2. Registration and Accounts",
            body: "To use certain features of the Service, you must register for an account and provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account."
        },
        {
            title: "3. Ordering, Payments, and Billing",
            body: "All orders are subject to acceptance by the restaurant and us. Prices listed are subject to change without notice. You agree to pay all charges incurred by you or any users of your account, including applicable taxes, at the prices in effect when such charges are incurred. Refunds are processed according to our stated Refund Policy."
        },
        {
            title: "4. Limitations of Liability",
            body: "The Service is provided 'as is.' We do not guarantee the quality, accuracy, availability, or delivery time of meals prepared by third-party restaurants. We shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use the Service."
        },
        {
            title: "5. Intellectual Property Rights",
            body: "All content, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio) are owned by [Your Company Name], its licensors, or other providers of such material and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws."
        },
        {
            title: "6. Governing Law and Jurisdiction",
            body: "These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any legal action or proceeding relating to the Service shall be instituted in a federal or state court in [Your City/Region]."
        },
    ]
};


export default function TermsOfServiceScreen() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <FontAwesome name="chevron-left" size={22} color="#DA7807" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms of Service</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <Text style={styles.effectiveDate}>{termsContent.effectiveDate}</Text>
                
                {termsContent.sections.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={styles.sectionBody}>{section.body}</Text>
                    </View>
                ))}

                <Text style={styles.contactFooter}>
                    For questions or concerns regarding these terms, please consult our Help Center or contact legal support directly.
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