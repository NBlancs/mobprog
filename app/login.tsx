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
  View,
} from 'react-native';

// Import the Zustand store
import { useAuthStore } from 'store/authStore';

const Login = () => {
  const router = useRouter();
  
  // Destructure login action and loading state from the store
  const { user, login, isLoading } = useAuthStore();
  
  // State variables to hold input values
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handler function for the login button
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username/email and password.");
      return;
    }

    console.log('Attempting Login for:', username);
    
    const result = await login(username, password);

    if (result.success) {
      console.log('Login successful! Token:', useAuthStore.getState().token);
      router.replace('/(tabs)/home');
    } else {
      Alert.alert("Login Failed", result.error || "Please check your credentials.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'white' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Top Decorative Shape */}
          <View style={styles.topImageContainer}>
            <Image source={require("../assets/images/shape.png")} />
          </View>

          {/* Logo */}
          <View style={styles.logo}>
            <Image source={require("../assets/images/Vector.png")} />
          </View>

          {/* Text Section */}
          <View style={styles.textContainer}>
            <Text style={styles.text}>QuickBite</Text>
            <Text style={styles.text1}>Welcome Back!</Text>
          </View>

          {/* Username/Email Input */}
          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={20} color="#DA7807" style={styles.emailAddressIcon} />
            <TextInput
              style={styles.emailAddress}
              placeholder="Enter Username or Email"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <FontAwesome name="lock" size={20} color="#DA7807" style={styles.passwordIcon} />
            <TextInput
              style={styles.password}
              placeholder="Enter Password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Signup Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Link href="/registration">
              <Text style={styles.signupColor}>Sign Up</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  topImageContainer: {},
  logo: {
    marginTop: 60,
    alignItems: "center",
  },
  textContainer: {},
  text: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  text1: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  inputContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 5,
    marginVertical: 40,
    paddingHorizontal: 10,
  },
  emailAddressIcon: {
    marginLeft: 5,
  },
  emailAddress: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    height: 50,
  },
  password: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    height: 50,
  },
  passwordContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 5,
    paddingHorizontal: 10,
  },
  passwordIcon: {
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: "#DA7807",
    marginHorizontal: 40,
    marginTop: 30,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    elevation: 5,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {},
  signupColor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "blue",
  },
});
