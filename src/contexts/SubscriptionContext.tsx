
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { openRazorpayCheckout, RazorpayOptions } from "@/utils/razorpay";

type SubscriptionType = "none" | "basic" | "premium";

type SubscriptionContextType = {
  subscriptionType: SubscriptionType;
  isSubscribed: boolean;
  expiryDate: Date | null;
  subscribe: (type: "basic" | "premium") => Promise<void>;
  cancelSubscription: () => Promise<void>;
  isProcessing: boolean;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>("none");
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const storedSubscription = localStorage.getItem(`subscription_${user.id}`);
      
      if (storedSubscription) {
        const { type, expiry } = JSON.parse(storedSubscription);
        setSubscriptionType(type);
        setExpiryDate(expiry ? new Date(expiry) : null);
      } else {
        setSubscriptionType("none");
        setExpiryDate(null);
      }
    } else {
      setSubscriptionType("none");
      setExpiryDate(null);
    }
  }, [user]);

  const subscribe = async (type: "basic" | "premium") => {
    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to subscribe.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Amount in paise (₹1200 = 120000 paise, ₹1500 = 150000 paise)
      const amount = type === "basic" ? 120000 : 150000;
      
      // In a real app, this order_id would come from your backend
      // For this demo, we're using a mock order ID
      const mockOrderId = `order_${Date.now()}`;
      
      const options: RazorpayOptions = {
        key: "rzp_test_RG9YwDUQ0QSfXa", // Replace with your Razorpay test key
        amount: amount,
        currency: "INR",
        name: "Solution.AI",
        description: `${type === "basic" ? "Basic" : "Premium"} Subscription`,
        order_id: mockOrderId,
        prefill: {
          name: user.email?.split('@')[0] || "",
          email: user.email || "",
        },
        theme: {
          color: "#7152F3"
        },
        handler: (response) => {
          console.log("Payment successful:", response);
          
          // Set expiry to one year from now
          const newExpiryDate = new Date();
          newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
          
          setSubscriptionType(type);
          setExpiryDate(newExpiryDate);
          
          localStorage.setItem(
            `subscription_${user.id}`,
            JSON.stringify({
              type,
              expiry: newExpiryDate.toISOString(),
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            })
          );
          
          toast({
            title: "Subscription Activated",
            description: `Your ${type} subscription has been activated!`,
          });
        },
      };

      await openRazorpayCheckout(options);
    } catch (error) {
      console.error("Payment failed:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelSubscription = async () => {
    if (!user) return;

    try {
      // In a real app, this would call an API to cancel the subscription
      setSubscriptionType("none");
      setExpiryDate(null);
      
      localStorage.removeItem(`subscription_${user.id}`);
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionType,
        isSubscribed: subscriptionType !== "none",
        expiryDate,
        subscribe,
        cancelSubscription,
        isProcessing,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  
  return context;
};
