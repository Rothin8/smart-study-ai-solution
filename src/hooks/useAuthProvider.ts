
import { useState } from "react";
import { useAuthToasts } from "@/hooks/useAuthToasts";
import { useSessionManager } from "@/hooks/useSessionManager";
import {
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  requestPhoneOTP,
  verifyPhoneOTP,
  resetUserPassword
} from "@/utils/authUtils";

export function useAuthProvider() {
  const { user, session, isLoading } = useSessionManager();
  const [phoneForOTP, setPhoneForOTP] = useState<string | null>(null);
  const {
    showSignInSuccess,
    showSignUpSuccess,
    showVerificationEmailSent,
    showPasswordResetEmailSent,
    showOTPSent,
    showAuthError
  } = useAuthToasts();

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) throw error;
      showSignInSuccess();
    } catch (error: any) {
      showAuthError(error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error, data } = await signUpWithEmail(email, password, name);
      if (error) throw error;
      
      // Check if email confirmation is required
      if (data?.user && !data.session) {
        showVerificationEmailSent();
      } else {
        showSignUpSuccess();
      }
    } catch (error: any) {
      showAuthError(error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await signOutUser();
      if (error) throw error;
    } catch (error: any) {
      showAuthError(error);
    }
  };

  const requestOTP = async (phone: string) => {
    try {
      // Format phone number if needed
      let formattedPhone = phone;
      if (!phone.startsWith('+')) {
        formattedPhone = `+${phone}`;
      }

      setPhoneForOTP(formattedPhone);
      const { error } = await requestPhoneOTP(phone);
      
      if (error) throw error;
      showOTPSent(formattedPhone);
    } catch (error: any) {
      showAuthError(error);
      throw error;
    }
  };

  const verifyOTP = async (otp: string) => {
    if (!phoneForOTP) {
      showAuthError(new Error("No phone number found for verification. Please request a new OTP."));
      return;
    }

    try {
      const { error } = await verifyPhoneOTP(phoneForOTP, otp);
      if (error) throw error;
      showSignInSuccess();
      setPhoneForOTP(null);
    } catch (error: any) {
      showAuthError(error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await resetUserPassword(email);
      if (error) throw error;
      showPasswordResetEmailSent();
    } catch (error: any) {
      showAuthError(error);
      throw error;
    }
  };

  return {
    isAuthenticated: !!user,
    isLoading,
    user,
    session,
    signIn,
    signUp,
    signOut,
    requestOTP,
    verifyOTP,
    resetPassword
  };
}
