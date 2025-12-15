import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
    // --- STATE PROPERTIES ---
    user: null,
    token: null,
    isLoading: false,

    // --- STORE METHOD 1: register ---
    register: async (firstName, lastName, username, phone, email, password) => {
        set({ isLoading: true });

        try {
            const response = await fetch("https://quickbite-h5oz.onrender.com/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    phone,
                    username,
                    email,
                    password
                }),
            })

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Something went wrong during registration");

            await AsyncStorage.setItem("user", JSON.stringify(data.user)); // Store only the user object
            await AsyncStorage.setItem("token", data.token);

            set({ token: data.token, user: data.user, isLoading: false });

            return { success: true };

        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },
    
    // -------------------------------------------------------------------
    // ⬇️ STORE METHOD 2: checkAuth (Function Signature Only) ⬇️
    // -------------------------------------------------------------------
    checkAuth: async () => {
        try{
            const token = await AsyncStorage.getItem("token");
            const userJson = await AsyncStorage.getItem("user");
            const user = userJson ? JSON.parse(userJson) : null;

            set({token, user});
        } catch (error) {
            console.log("Auth check failed", error);
        }
    }, login: async (username, password) => {
    set({ isLoading: true });

    try {
        const response = await fetch("https://quickbite-h5oz.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, // <-- now correctly sending username
                password
            })
        });

        const data = await response.json();
        console.log("Login response:", data);

        if (!response.ok) throw new Error(data.message || "Something went wrong");

        // Store user and token in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        await AsyncStorage.setItem("token", data.token);

        set({ token: data.token, user: data.user, isLoading: false });

        return { success: true };
    } catch (error) {
        set({ isLoading: false });
        console.log("Login error:", error.message);
        return { success: false, error: error.message };
    }
}
    
    
    
    
    
    
    
    
    
    
    
    // updateUser: (updates) => {
       // set((state) => {
          //  const newUser = { ...state.user, ...updates };

            // Store the updated user object in AsyncStorage
           // AsyncStorage.setItem("user", JSON.stringify(newUser)).catch(console.error);

           // return { user: newUser };
       // });
    //},
    
    
}));