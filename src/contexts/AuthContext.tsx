
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type User = {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithPhone: (phone: string, otp: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signUpWithPhone: (phone: string, name: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  signOut: () => void;
  requestOTP: (phone: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tempPhone, setTempPhone] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // In a real application, we would check for existing session
    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem("solution_ai_user");
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, we would make an API call to authenticate
      // For now, simulate a successful login
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
      };
      
      setUser(newUser);
      localStorage.setItem("solution_ai_user", JSON.stringify(newUser));
      
      toast({
        title: "Success",
        description: "You have successfully signed in!",
      });
      
      navigate("/subscription");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithPhone = async (phone: string, otp: string) => {
    try {
      setIsLoading(true);
      // In a real app, verify OTP with backend
      // For now, simulate a successful login
      const newUser = {
        id: `user_${Date.now()}`,
        phone,
        name: `User ${phone.slice(-4)}`,
      };
      
      setUser(newUser);
      localStorage.setItem("solution_ai_user", JSON.stringify(newUser));
      
      toast({
        title: "Success",
        description: "You have successfully signed in!",
      });
      
      navigate("/subscription");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTempPhone(null);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      // In a real app, we would make an API call to register
      // For now, simulate a successful registration
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        name,
      };
      
      setUser(newUser);
      localStorage.setItem("solution_ai_user", JSON.stringify(newUser));
      
      toast({
        title: "Success",
        description: "Your account has been created!",
      });
      
      navigate("/subscription");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithPhone = async (phone: string, name: string) => {
    try {
      setIsLoading(true);
      // In a real app, we would make an API call to register with phone
      // For now, store the phone temporarily and request OTP
      setTempPhone(phone);
      
      toast({
        title: "OTP Sent",
        description: "Please verify your phone number with the OTP sent.",
      });
      
      // In a real application, this would trigger an OTP to be sent
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestOTP = async (phone: string) => {
    try {
      setIsLoading(true);
      setTempPhone(phone);
      
      toast({
        title: "OTP Sent",
        description: "An OTP has been sent to your phone number.",
      });
      
      // In a real application, this would trigger an OTP to be sent
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    try {
      setIsLoading(true);
      
      if (!tempPhone) {
        throw new Error("No phone number found");
      }
      
      // In a real app, verify OTP with backend
      // For now, simulate a successful verification
      const newUser = {
        id: `user_${Date.now()}`,
        phone: tempPhone,
        name: `User ${tempPhone.slice(-4)}`,
      };
      
      setUser(newUser);
      localStorage.setItem("solution_ai_user", JSON.stringify(newUser));
      
      toast({
        title: "Success",
        description: "Phone number verified successfully!",
      });
      
      navigate("/subscription");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setTempPhone(null);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("solution_ai_user");
    navigate("/");
    
    toast({
      title: "Signed out",
      description: "You have been signed out of your account.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signInWithPhone,
        signUp,
        signUpWithPhone,
        verifyOTP,
        signOut,
        requestOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
