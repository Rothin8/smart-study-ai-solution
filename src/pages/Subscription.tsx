
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { loadRazorpayScript } from "@/utils/razorpay";

const Subscription = () => {
  const { isAuthenticated } = useAuth();
  const { isSubscribed } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Razorpay script when component mounts
    loadRazorpayScript();
    
    // If not authenticated, redirect to auth page
    if (!isAuthenticated) {
      navigate("/auth");
    }

    // If already subscribed, redirect to chat
    if (isSubscribed) {
      navigate("/chat");
    }
  }, [isAuthenticated, isSubscribed, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-12 px-6 hero-pattern">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get unlimited access to our AI-powered study assistant with a subscription that fits your needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <SubscriptionCard
                type="basic"
                title="Basic Plan"
                price="1200"
                dailyPrice="3.2"
                features={[
                  "Access to AI study assistant",
                  "Class 1-12 curriculum support",
                  "SEBA, CBSE, and AHSEC board support",
                  "Chat history download",
                  "24/7 availability"
                ]}
              />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
              <SubscriptionCard
                type="premium"
                title="Premium Plan"
                price="1500"
                dailyPrice="4.1"
                features={[
                  "Everything in Basic Plan",
                  "Priority response times",
                  "Advanced concept explanations",
                  "Practice question generation",
                  "Exam preparation materials"
                ]}
                recommended
              />
            </div>
          </div>
          
          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: "600ms" }}>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              By subscribing, you agree to our Terms of Service and Privacy Policy. 
              Subscriptions automatically renew annually until canceled. 
              You can cancel anytime from your account settings.
            </p>
            <p className="text-xs text-gray-400 mt-4">
              Powered by Razorpay | Secure payment gateway
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Subscription;
