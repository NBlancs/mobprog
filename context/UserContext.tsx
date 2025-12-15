// context/UserContext.tsx
import { createContext, ReactNode, useContext, useState } from 'react';

// Define the new types for Civil Status and Gender
export type CivilStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated' | '';
export type Gender = 'Male' | 'Female' | 'Other' | '';

// Define the shape of the user data
export interface User {
    name: string;
    email: string;
    profilePictureUri: string | null; // Nullable for default image
    
    // NEW FIELDS ADDED (replacing the single 'address' field)
    phone: string;
    birthdate: string;
    gender: Gender; 

    // Address breakdown
    street: string;
    city: string;
    province: string;

    // New profile fields
    nationality: string;
    civilStatus: CivilStatus;
}

// Define the shape of the context object
interface UserContextType {
    user: User;
    updateUser: (updates: Partial<User>) => void;
}

// Default user data (initial state)
const DEFAULT_USER: User = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    profilePictureUri: 'https://i.pravatar.cc/150?img=68', 
    
    // INITIALIZE NEW FIELDS
    phone: '',
    birthdate: '',
    gender: '',
    street: '',
    city: '',
    province: '',
    nationality: 'Filipino', // Default suggested value
    civilStatus: 'Single', // Default suggested value
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(DEFAULT_USER);

    const updateUser = (updates: Partial<User>) => {
        setUser(prevUser => ({
            ...prevUser,
            ...updates,
        }));
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};