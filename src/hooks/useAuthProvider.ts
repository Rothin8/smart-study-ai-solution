
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneForOTP, setPhoneForOTP] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "You have signed in successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        throw error;
      }

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        toast({
          title: "Check your email",
          description: "We've sent you a verification link to complete your signup.",
        });
      } else {
        toast({
          title: "Success",
          description: "Your account has been created successfully!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestOTP = async (phone: string) => {
    setIsLoading(true);
    try {
      // Format phone number if needed
      let formattedPhone = phone;
      if (!phone.startsWith('+')) {
        formattedPhone = `+${phone}`;
      }

      setPhoneForOTP(formattedPhone);

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone
      });

      if (error) {
        throw error;
      }

      toast({
        title: "OTP Sent",
        description: `We've sent a verification code to ${formattedPhone}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    if (!phoneForOTP) {
      toast({
        title: "Error",
        description: "No phone number found for verification. Please request a new OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneForOTP,
        token: otp,
        type: 'sms'
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "You have signed in successfully!",
      });

      setPhoneForOTP(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?tab=reset`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password Reset Email Sent",
        description: "Check your inbox for the password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
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
