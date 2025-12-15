import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Import the updated Zustand store
import { useAuthStore } from 'store/authStore';

const Registration = () => {
  const router = useRouter(); 

  // Local state for all input fields (7 fields total)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState(''); 
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Destructure state and actions from the Zustand store
  const { user, isLoading, register } = useAuthStore();

  // Handler function for registration
  const handleRegister = async () => {
    // Basic Frontend Validation
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      Alert.alert("Input Error", "Please fill in all required fields (Name, Username, Email, Password).");
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Input Error", "Passwords do not match!");
      return;
    }
    
    // Optional phone validation (checks if not empty and 10 digits)
    if (phone && phone.length !== 10) {
        Alert.alert("Input Error", "Please enter a valid 10-digit phone number, or leave it empty.");
        return;
    }

    // Call the register action from the Zustand store with ALL FIELDS
    const result = await register(
      firstName, 
      lastName, 
      username, 
      phone, 
      email, 
      password
    );

    if (result.success) {
      // SUCCESS BLOCK
      console.log('User object received and stored:', user); 
      console.log('Auth Token received and stored:', useAuthStore.getState().token); 
      
      Alert.alert("Success", "Registration successful! Welcome to QuickBite.");
      router.replace('/(tabs)/home'); 
    } else {
      // FAILURE BLOCK
      Alert.alert("Registration Failed", result.error || "An unknown error occurred during registration.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Decorative Shape Container */}
        <View style={styles.topImageContainer}>
          <Image source={require("../assets/images/shape.png")} />
        </View>

        {/* Logo Re-Added and Sized */}
        <View style={styles.logo}>
          <Image 
            source={require("../assets/images/Vector.png")}
            style={styles.logoImage}
          />
        </View>

        {/* Header */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>QuickBite</Text>
          <Text style={styles.text1}>Make an account</Text>
        </View>

        {/* --- Input Fields --- */}
        
        {/* First Name */}
        <View style={styles.inputRowContainer}>
          <FontAwesome name="user" size={20} color="#DA7807" style={styles.icon} />
          <TextInput style={styles.textInput} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
        </View>

        {/* Last Name */}
        <View style={styles.inputRowContainer}>
          <FontAwesome name="user" size={20} color="#DA7807" style={styles.icon} />
          <TextInput style={styles.textInput} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
        </View>

        {/* Username */}
        <View style={styles.inputRowContainer}>
          <FontAwesome name="at" size={20} color="#DA7807" style={styles.icon} />
          <TextInput style={styles.textInput} placeholder="Username" value={username} onChangeText={setUsername} />
        </View>

        {/* Phone */}
        <View style={styles.inputRowContainer}>
          <FontAwesome name="phone" size={20} color="#DA7807" style={styles.icon} />
          <TextInput style={styles.textInput} placeholder="Phone (9xxxxxxxxx)" keyboardType="phone-pad" maxLength={10} value={phone} onChangeText={setPhone} />
        </View>

        {/* Email */}
        <View style={styles.inputRowContainer}>
          <FontAwesome name="envelope" size={20} color="#DA7807" style={styles.icon} />
          <TextInput style={styles.textInput} placeholder="Email Address" keyboardType="email-address" value={email} onChangeText={setEmail} />
        </View>

        {/* Password */}
        <View style={styles.inputRowContainer}>
          <FontAwesome name="lock" size={20} color="#DA7807" style={styles.icon} />
          <TextInput style={styles.textInput} placeholder="Password" secureTextEntry={true} value={password} onChangeText={setPassword} />
        </View>

        {/* Confirm Password */}
        <View style={styles.inputRowContainer}>
          <FontAwesome name="lock" size={20} color="#DA7807" style={styles.icon} />
          <TextInput style={styles.textInput} placeholder="Confirm Password" secureTextEntry={true} value={confirmPassword} onChangeText={setConfirmPassword} />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleRegister} 
          disabled={isLoading} 
        >
          {isLoading ? (
            <ActivityIndicator color="white" /> 
          ) : (
            <Text style={styles.loginButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Already have an account? </Text>
          <Link href="/login">
            <Text style={styles.signupColor}>Login</Text>
          </Link>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: { backgroundColor: "white", flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 10, paddingTop: 0 }, 
  topImageContainer: {},
  logo: { marginTop: 10, alignItems: "center" },
  logoImage: { width: 80, height: 80, resizeMode: 'contain' },
  textContainer: { marginTop: 2, alignItems: "center" },
  text: { textAlign: "center", fontSize: 24, fontWeight: "bold", color: "#DA7807" },
  text1: { marginTop: 2, textAlign: "center", fontSize: 18, fontWeight: "bold", color: "#333" },
  inputRowContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20, 
    marginHorizontal: 40,
    elevation: 5,
    marginVertical: 2, 
    paddingHorizontal: 15,
    height: 50,
  },
  icon: { marginRight: 10, marginLeft: 5 },
  textInput: { flex: 1, paddingVertical: 10, fontSize: 16, color: "#333", height: 50 },
  loginButton: { 
    backgroundColor: "#DA7807", 
    marginHorizontal: 40, 
    marginTop: 10, 
    borderRadius: 25, 
    paddingVertical: 15, 
    alignItems: "center", 
    elevation: 5 
  },
  loginButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  signupContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginTop: 5 
  },
  signupText: { fontSize: 14, color: "#666" },
  signupColor: { fontSize: 14, fontWeight: "bold", color: "blue" },
});

export default Registration;