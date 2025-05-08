
import { createContext, useContext, ReactNode } from "react";
import { AuthContextType } from "@/types/auth.types";
import { useAuthProvider } from "@/hooks/useAuthProvider";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authValues = useAuthProvider();

  return (
    <AuthContext.Provider value={authValues}>
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
