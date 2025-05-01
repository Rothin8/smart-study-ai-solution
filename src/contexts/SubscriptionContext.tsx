
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

type SubscriptionType = "none" | "basic" | "premium";

type SubscriptionContextType = {
  subscriptionType: SubscriptionType;
  isSubscribed: boolean;
  expiryDate: Date | null;
  subscribe: (type: "basic" | "premium") => Promise<void>;
  cancelSubscription: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>("none");
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
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
      // In a real app, this would process payment through a payment gateway
      // For now, simulate a successful subscription

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
        })
      );
      
      toast({
        title: "Subscription Activated",
        description: `Your ${type} subscription has been activated!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cancelSubscription = async () => {
    if (!user) return;

    try {
      // In a real app, this would call an API to cancel the subscription
      // For now, simulate a successful cancellation
      
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
