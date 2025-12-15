// app/settings/helpSupport.tsx (Updated with validated styles)
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// --- Mock FAQ Data ---
const faqData = [
    { id: 't1', title: "Order Issues", icon: "cutlery", color: "#DA7807" },
    { id: 't2', title: "Payment & Refunds", icon: "credit-card", color: "#38A169" },
    { id: 't3', title: "Account & Login", icon: "user", color: "#5A67D8" },
    { id: 't4', title: "Delivery & Tracking", icon: "truck", color: "#E53E3E" },
];

// --- Simple Accordion Component ---
const AccordionItem = ({ title, content }: { title: string, content: string }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <View style={accordionStyles.container}>
            <TouchableOpacity 
                style={accordionStyles.header} 
                onPress={() => setExpanded(!expanded)}
            >
                <Text style={accordionStyles.title}>{title}</Text>
                <FontAwesome 
                    name={expanded ? "chevron-up" : "chevron-down"} 
                    size={14} 
                    color="#666" 
                />
            </TouchableOpacity>
            {expanded && (
                <View style={accordionStyles.content}>
                    <Text style={accordionStyles.contentText}>{content}</Text>
                </View>
            )}
        </View>
    );
};


export default function HelpSupportScreen() { 
    const [searchText, setSearchText] = useState('');
    
    // Simulate filtered FAQ results based on search term
    const filteredFAQs = [
        { id: 'q1', q: 'How do I reset my password?', a: 'Go to Settings > Account > Change Password.' },
        { id: 'q2', q: 'Where is my order status?', a: 'Check the Orders tab for real-time status updates.' },
        { id: 'q3', q: 'How can I change my delivery address?', a: 'You can only change the address before the order is confirmed by the restaurant.' },
    ];

    const handleTopicPress = (topicId: string) => {
        Alert.alert("Topic Selected", `You clicked on topic ID: ${topicId}`);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <FontAwesome name="chevron-left" size={22} color="#DA7807" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <FontAwesome name="search" size={18} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search FAQs (e.g., 'refund', 'delivery')"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                {/* Quick Topics */}
                <Text style={styles.sectionHeader}>Quick Links</Text>
                <View style={styles.topicGrid}>
                    {faqData.map((topic) => (
                        <TouchableOpacity 
                            key={topic.id} 
                            style={styles.topicCard}
                            onPress={() => handleTopicPress(topic.id)}
                        >
                            <FontAwesome name={topic.icon as any} size={24} color={topic.color} />
                            <Text style={styles.topicText}>{topic.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
                {/* FAQ List */}
                <Text style={styles.sectionHeader}>Top Questions</Text>
                <View style={styles.faqList}>
                    {filteredFAQs.map(faq => (
                        <AccordionItem 
                            key={faq.id} 
                            title={faq.q} 
                            content={faq.a} 
                        />
                    ))}
                </View>

                {/* Contact Support */}
                <Text style={styles.sectionHeader}>Still need help?</Text>
                <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => Alert.alert("Contact Support", "Implement live chat or ticket submission here.")}
                >
                    <FontAwesome name="envelope-o" size={20} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.contactButtonText}>Contact Customer Support</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

// --- Component Specific Styles ---
const accordionStyles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flexShrink: 1,
    },
    content: {
        padding: 15,
        backgroundColor: '#f9f9f9',
    },
    contentText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
    },
});

// --- Main Page Styles ---
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
    // ⭐️ FIX: Ensuring sectionHeader is defined here
    sectionHeader: { 
        fontSize: 20,
        fontWeight: "700",
        color: "#333",
        marginTop: 20,
        marginBottom: 10,
    },
    // Search Styles
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        height: 50,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    // Topic Grid Styles
    topicGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    topicCard: {
        width: '48%', 
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        aspectRatio: 1.5,
    },
    topicText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    faqList: {
        marginTop: 10,
    },
    // Contact Button
    contactButton: {
        flexDirection: 'row',
        backgroundColor: "#DA7807",
        paddingVertical: 18,
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
    contactButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 18,
    },
});