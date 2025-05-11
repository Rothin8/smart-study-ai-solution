
import { Session, User } from '@supabase/supabase-js';

export type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isAdminLoading: boolean;
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  requestOTP: (phone: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};
