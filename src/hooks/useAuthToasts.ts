
import { useToast } from "@/hooks/use-toast";

export function useAuthToasts() {
  const { toast } = useToast();

  const showSuccessToast = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  const showErrorToast = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  return {
    showSuccessToast,
    showErrorToast,
    showSignInSuccess: () => showSuccessToast("Success", "You have signed in successfully!"),
    showSignUpSuccess: () => showSuccessToast("Success", "Your account has been created successfully!"),
    showVerificationEmailSent: () => showSuccessToast("Check your email", "We've sent you a verification link to complete your signup."),
    showPasswordResetEmailSent: () => showSuccessToast("Password Reset Email Sent", "Check your inbox for the password reset link."),
    showOTPSent: (phone: string) => showSuccessToast("OTP Sent", `We've sent a verification code to ${phone}`),
    showAuthError: (error: Error | null) => showErrorToast("Error", error?.message || "An authentication error occurred. Please try again."),
  };
}
