// app/(tabs)/settings.tsx

import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUser } from "../../context/UserContext";

// A generic touchable row component for settings items
const SettingsRow = ({ title, icon, onPress, isDestructive = false }: { title: string, icon: string, onPress: () => void, isDestructive?: boolean }) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
        <View style={styles.rowLeft}>
            <FontAwesome name={icon as any} size={20} color={isDestructive ? "#D9534F" : "#DA7807"} style={styles.rowIcon} />
            <Text style={[styles.rowTitle, isDestructive && styles.destructiveText]}>{title}</Text>
        </View>
        <FontAwesome name="chevron-right" size={16} color="#bbb" />
    </TouchableOpacity>
);

export default function SettingsScreen() {
    const t = (key: string) => key; // Dummy function to replace the removed useTranslation hook
    const { user } = useUser(); 

    // --- Handlers ---
    
    // ⭐️ REMOVED: handleFeedbackPress function ⭐️

    const handleLogout = () => {
        Alert.alert(
            "Logout", 
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: () => {
                        // Perform actual logout logic here
                        router.replace('/login'); 
                    },
                },
            ]
        );
    };
    
    // Handler for Order History navigation
    const handleOrderHistoryPress = () => {
        router.push('/profile/orderHistory'); 
    }

    // Handler for Profile Details navigation
    const handleProfilePress = () => {
        router.push('/profile/profileDetails');
    }

    // Handler for Help Center navigation
    const handleHelpCenterPress = () => {
        router.push('/profile/helpSupport');
    }
    
    // Handler: For Terms of Service navigation
    const handleTermsOfServicePress = () => {
        router.push('/profile/profileDetails'); // Placeholder path
    }

    // Handler: For Privacy Policy
    const handlePrivacyPress = () => {
        router.push('/profile/privacyPolicy'); // Placeholder path
    }


    return (
        <View style={styles.container}>
            {/* Header Bar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                     <FontAwesome name="chevron-left" size={22} color="#DA7807" />
                </TouchableOpacity>
            {/* Change from translation key to static text */}
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 22 }} /> 
            </View>
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                {/* PROFILE CARD */}
                <TouchableOpacity style={styles.profileCard} onPress={handleProfilePress}>
                    <Image
                        source={{ uri: user.profilePictureUri || 'https://i.pravatar.cc/150?img=68' }}
                        style={styles.profileImage}
                    />
                    <View style={styles.profileTextContainer}>
                        <Text style={styles.profileName}>{user.name}</Text>
                        <Text style={styles.profileEmail}>{user.email}</Text> 
                    </View>
                    <FontAwesome name="chevron-right" size={18} color="#DA7807" />
                </TouchableOpacity>

                
                <Text style={styles.sectionHeader}>Account</Text>
                <View style={styles.card}>
                    <SettingsRow title="Change Password" icon="lock" onPress={() => Alert.alert("Feature", "Change Password")} />
                    <SettingsRow title="Order History" icon="history" onPress={handleOrderHistoryPress} /> 
                </View>

                <Text style={styles.sectionHeader}>Support & Info</Text>
                <View style={styles.card}>
                    <SettingsRow title="Help Center" icon="question-circle" onPress={handleHelpCenterPress} />
                </View>
                
                <Text style={styles.sectionHeader}>Legal & Policy</Text>
                <View style={styles.card}>
                    <SettingsRow title="Terms of Service" icon="file-text-o" onPress={handleTermsOfServicePress} /> 
                    <SettingsRow title="Privacy Policy" icon="shield" onPress={handlePrivacyPress} />
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>

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
    // Profile Card Styles
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#DA7807',
    },
    profileTextContainer: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    profileEmail: {
        fontSize: 14,
        color: '#666',
    },
    // End Profile Card Styles
    sectionHeader: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        marginTop: 15,
        marginBottom: 8,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 10,
        overflow: 'hidden', 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowIcon: {
        width: 30,
        textAlign: 'center',
    },
    rowTitle: {
        fontSize: 16,
        color: "#333",
        fontWeight: '500',
        marginLeft: 10,
    },
    destructiveText: {
        color: "#D9534F",
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: "#fff",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
        borderWidth: 1,
        borderColor: '#D9534F',
    },
    logoutButtonText: {
        color: "#D9534F",
        fontSize: 18,
        fontWeight: '700',
    }
});