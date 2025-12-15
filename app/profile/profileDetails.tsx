import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, KeyboardTypeOptions, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from 'store/authStore';

// ------------------------------------------
// INTERFACE DEFINITIONS AND HELPER COMPONENTS 
// ------------------------------------------

interface ProfileRowProps {
    label: string;
    value: string;
    onChangeText?: (text: string) => void;
    isEditing: boolean;
    keyboardType?: KeyboardTypeOptions;
    maxLength?: number;
    placeholder?: string;
}
const ProfileRow: React.FC<ProfileRowProps> = ({ label, value, onChangeText, isEditing, keyboardType = 'default', maxLength, placeholder }) => {
    const displayValue = label === "Phone" ? 
        (value.length === 10 ? `+63 ${value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}` : value) : 
        (value || 'N/A');

    return (
        <View style={styles.inputRow}>
            <Text style={styles.label}>{label}:</Text>
            {isEditing ? (
                <TextInput
                    style={styles.textInput}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
                    placeholderTextColor="#999"
                    keyboardType={keyboardType}
                    maxLength={maxLength} 
                />
            ) : (
                <Text style={styles.value}>{displayValue}</Text>
            )}
        </View>
    );
};

interface GenderSelectorProps {
    label: string;
    value: string; 
    onSelect: (gender: string) => void;
    isEditing: boolean;
}
const GenderSelector: React.FC<GenderSelectorProps> = ({ label, value, onSelect, isEditing }) => {
    const genders = ['Male', 'Female', 'Other'];
    return (
        <View style={styles.inputRow}>
            <Text style={styles.label}>{label}:</Text>
            {isEditing ? (
                <View style={styles.genderContainer}>
                    {genders.map((g) => (
                        <TouchableOpacity
                            key={g}
                            style={[styles.genderButton, value === g && styles.genderButtonActive]}
                            onPress={() => onSelect(g)}
                        >
                            <Text style={[styles.genderText, value === g && styles.genderTextActive]}>{g}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                <Text style={styles.value}>{value || 'N/A'}</Text>
            )}
        </View>
    );
};

interface CivilStatusSelectorProps {
    label: string;
    value: string; 
    onSelect: (status: string) => void;
    isEditing: boolean;
}
const CivilStatusSelector: React.FC<CivilStatusSelectorProps> = ({ label, value, onSelect, isEditing }) => {
    const statuses = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
    if (!isEditing) {
        return (
            <View style={styles.inputRow}>
                <Text style={styles.label}>{label}:</Text>
                <Text style={styles.value}>{value || 'N/A'}</Text>
            </View>
        );
    }
    return (
        <View style={styles.inputRow}>
            <Text style={styles.label}>{label}:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.civilStatusContainer}>
                {statuses.map((s) => (
                    <TouchableOpacity
                        key={s}
                        style={[styles.statusButton, value === s && styles.statusButtonActive]}
                        onPress={() => onSelect(s)}
                    >
                        <Text style={[styles.statusText, value === s && styles.statusTextActive]}>{s}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// DatePicker component
interface DatePickerProps {
    value: string;
    onUpdate: (newDate: string) => void;
    isEditing: boolean;
    label: string;
}
const DatePicker: React.FC<DatePickerProps> = ({ value, onUpdate, isEditing, label }) => {
    const parts = value.split('-');
    const currentMonth = parseInt(parts[0] || '0', 10);
    const currentDay = parseInt(parts[1] || '0', 10);
    const currentYear = parseInt(parts[2] || '0', 10);

    const getDaysInMonth = (month: number, year: number) => {
        if (month === 2) return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
        if ([4, 6, 9, 11].includes(month)) return 30;
        return 31;
    };

    const MIN_YEAR = 1900;
    const MAX_YEAR = 2025;

    const handleDateChange = (type: 'month' | 'day' | 'year', text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        let newMonth = currentMonth;
        let newDay = currentDay;
        let newYear = currentYear;
        let val = 0;

        if (numericText.length > 0) val = parseInt(numericText, 10);

        if (type === 'month') newMonth = numericText.length === 0 ? 0 : Math.min(12, Math.max(1, val));
        else if (type === 'day') {
            const daysMax = getDaysInMonth(newMonth, newYear);
            newDay = numericText.length === 0 ? 0 : Math.min(daysMax, Math.max(1, val));
        } else if (type === 'year') {
            if (numericText.length === 0) newYear = 0;
            else if (numericText.length === 4) newYear = Math.min(MAX_YEAR, Math.max(MIN_YEAR, val));
            else newYear = val;
        }

        const finalDaysMax = getDaysInMonth(newMonth, newYear);
        if (newDay > finalDaysMax) newDay = finalDaysMax;

        const newDateString = `${String(newMonth).padStart(2, '0')}-${String(newDay).padStart(2, '0')}-${String(newYear).padStart(4, '0')}`;
        onUpdate(newDateString);
    };

    const displayMonth = currentMonth > 0 ? String(currentMonth) : '';
    const displayDay = currentDay > 0 ? String(currentDay) : '';
    const displayYear = currentYear > 0 ? String(currentYear) : '';

    const formattedDisplayValue = (currentMonth > 0 && currentDay > 0 && String(currentYear).length === 4)
        ? `${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}-${currentYear}`
        : 'N/A';

    if (!isEditing) {
        return (
            <View style={styles.inputRow}>
                <Text style={styles.label}>{label}:</Text>
                <Text style={styles.value}>{formattedDisplayValue}</Text>
            </View>
        );
    }

    return (
        <View style={styles.inputRow}>
            <Text style={styles.label}>{label}:</Text>
            <View style={styles.datePickerContainer}>
                <View style={styles.datePickerUnit}>
                    <Text style={styles.datePickerLabel}>MM</Text>
                    <TextInput
                        value={displayMonth}
                        keyboardType="numeric"
                        onChangeText={(text) => handleDateChange('month', text)}
                        style={styles.datePickerInput}
                        maxLength={2}
                        placeholder="MM"
                    />
                </View>
                <Text style={styles.dateSeparator}>-</Text>
                <View style={styles.datePickerUnit}>
                    <Text style={styles.datePickerLabel}>DD</Text>
                    <TextInput
                        value={displayDay}
                        keyboardType="numeric"
                        onChangeText={(text) => handleDateChange('day', text)}
                        style={styles.datePickerInput}
                        maxLength={2}
                        placeholder="DD"
                    />
                </View>
                <Text style={styles.dateSeparator}>-</Text>
                <View style={styles.datePickerUnit}>
                    <Text style={styles.datePickerLabel}>YYYY</Text>
                    <TextInput
                        value={displayYear}
                        keyboardType="numeric"
                        onChangeText={(text) => handleDateChange('year', text)}
                        style={[styles.datePickerInput, { width: 50 }]}
                        maxLength={4}
                        placeholder="YYYY"
                    />
                </View>
            </View>
        </View>
    );
};

// ------------------
// MAIN COMPONENT
// ------------------

const ProfileDetails = () => {
    const { user, updateUser } = useAuthStore();

    const initialFirstName = user?.firstName || '';
    const initialLastName = user?.lastName || '';
    const rawPhoneInitial = user?.phone && user.phone.startsWith('+63') ? user.phone.substring(3) : user?.phone || '';
    const defaultBirthdate = user?.birthdate || '00-00-0000';

    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);
    const [phone, setPhone] = useState(rawPhoneInitial);
    const [birthdate, setBirthdate] = useState(defaultBirthdate);
    const [gender, setGender] = useState(user?.gender || '');
    const [street, setStreet] = useState(user?.street || '');
    const [city, setCity] = useState(user?.city || '');
    const [province, setProvince] = useState(user?.province || '');
    const [nationality, setNationality] = useState(user?.nationality || 'Filipino');
    const [civilStatus, setCivilStatus] = useState(user?.civilStatus || 'Single');
    const [isEditing, setIsEditing] = useState(false);

    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Please enable camera roll permissions to select a profile picture.');
                return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            updateUser({ profilePictureUri: result.assets[0].uri });
        }
    };

    const handleSave = () => {
        const newFullName = `${firstName.trim()} ${lastName.trim()}`;
        const cleanedPhone = phone.replace(/[^0-9]/g, '');
        const cleanBirthdate = birthdate;

        updateUser({
            name: newFullName,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: `+63${cleanedPhone}`,
            birthdate: cleanBirthdate,
            gender,
            street,
            city,
            province,
            nationality,
            civilStatus
        });

        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully!");
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backIcon}>
                    <FontAwesome name="chevron-left" size={22} color="#DA7807" />
                </TouchableOpacity>
                <Text style={styles.title}>My Profile</Text>
                {!isEditing ? (
                    <TouchableOpacity onPress={() => setIsEditing(true)}>
                        <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={[styles.editButton, styles.saveButtonText]}>Save</Text>
                    </TouchableOpacity>
                )}
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingContainer} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <TouchableOpacity onPress={isEditing ? pickImage : undefined} disabled={!isEditing} style={styles.profileImageWrapper}>
                        <Image source={{ uri: user?.profilePictureUri || 'https://i.pravatar.cc/150?img=68' }} style={styles.profileImage} />
                        {isEditing && (
                            <View style={styles.cameraIconContainer}>
                                <FontAwesome name="camera" size={24} color="#fff" />
                            </View>
                        )}
                    </TouchableOpacity>

                    <View style={styles.fieldsCard}>
                        <Text style={styles.sectionHeader}>Personal Information</Text>
                        <ProfileRow label="First Name" value={firstName} onChangeText={setFirstName} isEditing={isEditing} placeholder="Enter your first name" />
                        <ProfileRow label="Last Name" value={lastName} onChangeText={setLastName} isEditing={isEditing} placeholder="Enter your last name" />
                        <ProfileRow label="Email" value={user?.email || ''} isEditing={false} />
                        <ProfileRow label="Phone" value={phone} onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))} isEditing={isEditing} keyboardType="numeric" maxLength={10} placeholder="9xxxxxxxxx" />
                        <DatePicker label="Birthdate" value={birthdate} onUpdate={setBirthdate} isEditing={isEditing} />
                        <GenderSelector label="Gender" value={gender} onSelect={setGender} isEditing={isEditing} />
                        <CivilStatusSelector label="Civil Status" value={civilStatus} onSelect={setCivilStatus} isEditing={isEditing} />
                        <ProfileRow label="Nationality" value={nationality} onChangeText={setNationality} isEditing={isEditing} />
                    </View>

                    <View style={[styles.fieldsCard, { marginTop: 20 }]}>
                        <Text style={styles.sectionHeader}>Residential Address</Text>
                        <ProfileRow label="Street" value={street} onChangeText={setStreet} isEditing={isEditing} placeholder="House No./Street Name" />
                        <ProfileRow label="City" value={city} onChangeText={setCity} isEditing={isEditing} placeholder="City or Municipality" />
                        <ProfileRow label="Province" value={province} onChangeText={setProvince} isEditing={isEditing} placeholder="Province" />
                    </View>

                    <Text style={styles.memberInfo}>Member since 2023</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default ProfileDetails;

// ------------------
// STYLES (unchanged from your code)
// ------------------
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fefaf5' },
    keyboardAvoidingContainer: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
    title: { fontSize: 24, fontWeight: '700', color: '#DA7807' },
    backIcon: { padding: 5, marginRight: 10 },
    editButton: { fontSize: 16, fontWeight: '600', color: '#DA7807' },
    saveButtonText: { fontWeight: '700' },
    scrollContent: { padding: 20, flexGrow: 1 },
    profileImageWrapper: { alignSelf: 'center', marginBottom: 20 },
    profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#DA7807' },
    cameraIconContainer: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: 20, padding: 8, borderWidth: 2, borderColor: '#fff' },
    fieldsCard: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 15, marginBottom: 5, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
    sectionHeader: { fontSize: 16, fontWeight: '700', color: '#DA7807', paddingTop: 15, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', marginBottom: 5 },
    inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    label: { fontSize: 14, fontWeight: '600', color: '#333', width: 100 },
    textInput: { flex: 1, fontSize: 16, paddingVertical: 0, fontWeight: '500', color: '#DA7807', borderBottomWidth: 1, borderBottomColor: '#DA7807', marginLeft: 10 },
    value: { flex: 1, fontSize: 16, color: '#666', marginLeft: 10 },
    genderContainer: { flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginLeft: 10 },
    genderButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#f5f5f5' },
    genderButtonActive: { backgroundColor: '#DA7807' },
    genderText: { fontSize: 14, color: '#666', fontWeight: '500' },
    genderTextActive: { color: '#fff' },
    civilStatusContainer: { flexDirection: 'row', gap: 10 },
    statusButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: '#f5f5f5', marginRight: 5 },
    statusButtonActive: { backgroundColor: '#DA7807' },
    statusText: { fontSize: 14, color: '#666', fontWeight: '500' },
    statusTextActive: { color: '#fff' },
    datePickerContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    datePickerUnit: { flexDirection: 'column', alignItems: 'center', width: 40 },
    datePickerInput: { borderBottomWidth: 1, borderBottomColor: '#DA7807', width: 35, textAlign: 'center', color: '#DA7807', fontWeight: '500' },
    datePickerLabel: { fontSize: 10, color: '#999' },
    dateSeparator: { fontSize: 16, fontWeight: '700', marginHorizontal: 2 },
    memberInfo: { textAlign: 'center', marginTop: 20, fontSize: 12, color: '#999', fontStyle: 'italic' },
});
