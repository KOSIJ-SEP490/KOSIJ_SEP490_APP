import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  role: string;
  exp: number;
}

interface User {
  email: string;
  token: string;
  role: "Customer" | "Consulting" | "Delivery";
  expiresAt: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.expiresAt > Date.now()) {
            setUser(parsedUser);
          } else {
            await AsyncStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(
        "https://kosijapi.azurewebsites.net/api/authentication/login/email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      const token = data.value;

      const decoded: DecodedToken = jwtDecode(token);
      const role = decoded.role as "Customer" | "Consulting" | "Delivery";
      const expiresAt = decoded.exp * 1000;

      const userData = {
        email,
        token,
        role,
        expiresAt,
      };

      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Login error:", error);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    try {
      await fetch(
        "https://kosijapi.azurewebsites.net/api/authentication/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
    } catch (error) {
      console.error("Register error:", error);
    }
  }, []);

  const verifyOTP = useCallback(async (email: string, otp: string) => {
    try {
      await fetch(
        "https://kosijapi.azurewebsites.net/api/authentication/otp-veriification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
    } catch (error) {
      console.error("OTP Verification error:", error);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, register, verifyOTP, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
