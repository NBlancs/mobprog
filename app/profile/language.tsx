// app/settings/language.tsx
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// This MUST match the language codes used in i18n.js
const SUPPORTED_LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'tl', label: 'Tagalog (Filipino)' },
];

const LanguageRow = ({ code, label, currentLang, onPress }: { code: string, label: string, currentLang: string, onPress: (code: string) => void }) => {
    const isSelected = code === currentLang;
    return (
        <TouchableOpacity 
            style={styles.row} 
            onPress={() => onPress(code)}
        >
            <View style={styles.rowLeft}>
                <Text style={styles.languageLabel}>{label}</Text>
            </View>
            {isSelected && (
                <FontAwesome name="check-circle" size={22} color="#DA7807" />
            )}
        </TouchableOpacity>
    );
};


export default function LanguageScreen() {
    // Access the translator and i18n instance
    const { t, i18n } = useTranslation();

    const currentLanguage = i18n.language;

    const changeLanguage = async (newLangCode: string) => {
        if (newLangCode === currentLanguage) {
            router.back();
            return;
        }

        try {
            // This triggers the i18n update and saves to AsyncStorage
            await i18n.changeLanguage(newLangCode);
            
            Alert.alert(t('save'), `Language changed to ${newLangCode.toUpperCase()}!`);
            router.back(); 
        } catch (error) {
            console.error("Failed to change language:", error);
            Alert.alert("Error", "Could not change language.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <FontAwesome name="chevron-left" size={22} color="#DA7807" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('settings.language_title')}</Text> 
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <Text style={styles.sectionHeader}>
                    {t('current_lang')}: {currentLanguage.toUpperCase()}
                </Text>
                
                <View style={styles.card}>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <LanguageRow 
                            key={lang.code}
                            code={lang.code}
                            label={lang.label}
                            currentLang={currentLanguage}
                            onPress={changeLanguage}
                        />
                    ))}
                </View>

                <Text style={styles.noteText}>
                    {t('greeting')}
                </Text>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fefaf5", paddingHorizontal: 20, paddingTop: 60, },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, },
    headerTitle: { fontSize: 28, fontWeight: "700", color: "#DA7807", },
    backIcon: { padding: 5, },
    scrollContent: { paddingBottom: 40, },
    sectionHeader: { fontSize: 18, fontWeight: "700", color: "#333", marginTop: 15, marginBottom: 8, },
    card: { backgroundColor: "#fff", borderRadius: 12, marginBottom: 10, overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#f5f5f5', },
    rowLeft: { flexDirection: 'row', alignItems: 'center', },
    languageLabel: { fontSize: 16, color: "#333", fontWeight: '500', },
    noteText: { fontSize: 14, color: '#888', marginTop: 20, textAlign: 'center', }
});