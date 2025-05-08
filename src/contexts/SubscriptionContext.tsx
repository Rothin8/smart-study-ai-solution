import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { openRazorpayCheckout, RazorpayOptions } from "@/utils/razorpay";
import { supabase } from "@/integrations/supabase/client";

type SubscriptionType = "none" | "basic" | "premium";

type SubscriptionContextType = {
  subscriptionType: SubscriptionType;
  isSubscribed: boolean;
  expiryDate: Date | null;
  subscribe: (type: "basic" | "premium") => Promise<void>;
  cancelSubscription: () => Promise<void>;
  isProcessing: boolean;
  fetchUserSubscription: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>("none");
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUserSubscription = async () => {
    if (!user) {
      setSubscriptionType("none");
      setExpiryDate(null);
      return;
    }

    try {
      // Check if user has an active subscription in Supabase
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching subscription:", error);
        return;
      }

      if (data) {
        const endDate = new Date(data.end_date);
        
        // Check if subscription is expired
        if (endDate < new Date()) {
          setSubscriptionType("none");
          setExpiryDate(null);
          
          // Update the subscription to inactive
          await supabase
            .from("subscribers")
            .update({ is_active: false })
            .eq("id", data.id);
        } else {
          setSubscriptionType(data.subscription_type as SubscriptionType);
          setExpiryDate(endDate);
        }
      } else {
        // Check localStorage as fallback (for existing users)
        const storedSubscription = localStorage.getItem(`subscription_${user.id}`);
        
        if (storedSubscription) {
          const { type, expiry } = JSON.parse(storedSubscription);
          const expiryDate = expiry ? new Date(expiry) : null;
          
          if (expiryDate && expiryDate > new Date()) {
            setSubscriptionType(type);
            setExpiryDate(expiryDate);
          } else {
            setSubscriptionType("none");
            setExpiryDate(null);
            localStorage.removeItem(`subscription_${user.id}`);
          }
        } else {
          setSubscriptionType("none");
          setExpiryDate(null);
        }
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      toast({
        title: "Error",
        description: "Failed to check subscription status.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUserSubscription();
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
        handler: async (response) => {
          console.log("Payment successful:", response);
          
          try {
            // Call the Supabase edge function to create order and subscription
            const { data, error } = await supabase.functions.invoke("create-order", {
              body: {
                user_id: user.id,
                order_id: mockOrderId,
                payment_id: response.razorpay_payment_id,
                amount: amount / 100, // Convert paise to rupees
                subscription_type: type,
              },
            });

            if (error) {
              console.error("Error creating order:", error);
              throw new Error("Failed to process order");
            }

            // Fetch updated subscription status
            await fetchUserSubscription();
            
            // Keep legacy local storage for backward compatibility
            // Set expiry to one year from now
            const newExpiryDate = new Date();
            newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
            
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
          } catch (error) {
            console.error("Subscription processing error:", error);
            toast({
              title: "Error",
              description: "Failed to process subscription. Please contact support.",
              variant: "destructive",
            });
          }
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
      setIsProcessing(true);

      // Update subscription in Supabase
      const { error } = await supabase
        .from("subscribers")
        .update({ 
          is_active: false,
          auto_renew: false
        })
        .eq("user_id", user.id);

      if (error) {
        throw new Error(error.message);
      }

      // Update local state
      setSubscriptionType("none");
      setExpiryDate(null);
      
      // Remove local storage item for backward compatibility
      localStorage.removeItem(`subscription_${user.id}`);
      
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully.",
      });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
        fetchUserSubscription,
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
