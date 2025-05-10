
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Handles email/password authentication
 */
export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password
  });
}

/**
 * Creates a new user with email, password, and name
 */
export async function signUpWithEmail(email: string, password: string, name: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name
      }
    }
  });
}

/**
 * Signs out the current user
 */
export async function signOutUser() {
  return supabase.auth.signOut();
}

/**
 * Requests a one-time password via SMS
 */
export async function requestPhoneOTP(phone: string) {
  // Format phone number if needed
  let formattedPhone = phone;
  if (!phone.startsWith('+')) {
    formattedPhone = `+${phone}`;
  }

  return supabase.auth.signInWithOtp({
    phone: formattedPhone
  });
}

/**
 * Verifies a one-time password
 */
export async function verifyPhoneOTP(phone: string, otp: string) {
  return supabase.auth.verifyOtp({
    phone,
    token: otp,
    type: 'sms'
  });
}

/**
 * Sends a password reset email
 */
export async function resetUserPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth?tab=reset`,
  });
}
