import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  user: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      setLoading(true);
      const { sub } = await fetchUserAttributes();

      if (sub && typeof sub === "string") {
        setUser(sub);
        await AsyncStorage.setItem("user", sub);
      } else {
        console.error("Invalid user ID: ", sub); 
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const storedUser = await AsyncStorage.getItem("user"); 
      const storedToken = await AsyncStorage.getItem("token"); 
      console.log({ storedUser, storedToken });

      if (storedUser) {
        setUser(storedUser);
      } else {
        fetchUser(); 
      }
    };

    loadUserFromStorage(); 
  }, []);

  const contextData = { user, loading };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType | null => {
  return useContext(AuthContext);
};

export { useAuth, AuthContext, AuthProvider };
