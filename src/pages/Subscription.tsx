
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubscriptionCard from "@/components/SubscriptionCard";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { loadRazorpayScript } from "@/utils/razorpay";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const Subscription = () => {
  const { isAuthenticated } = useAuth();
  const { isSubscribed, subscriptionType, expiryDate, cancelSubscription, isProcessing, fetchUserSubscription } = useSubscription();
  const navigate = useNavigate();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    // Load Razorpay script when component mounts
    loadRazorpayScript();
    
    // If not authenticated, redirect to auth page
    if (!isAuthenticated) {
      navigate("/auth");
    }
    
    // Refresh subscription status
    fetchUserSubscription();
  }, [isAuthenticated, navigate, fetchUserSubscription]);

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-12 px-6 hero-pattern">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {isSubscribed ? "Manage Your Subscription" : "Choose Your Plan"}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isSubscribed 
                ? "Thank you for subscribing to Solution.AI! Here's your current subscription details."
                : "Get unlimited access to our AI-powered study assistant with a subscription that fits your needs."}
            </p>
          </div>
          
          {isSubscribed && (
            <div className="max-w-2xl mx-auto mb-12 animate-fade-in">
              <Alert className="bg-white border-chatbot">
                <Calendar className="h-5 w-5" />
                <AlertTitle>Active Subscription</AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Plan:</span>
                      <span className="capitalize">{subscriptionType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Expires on:</span>
                      <span>{formatDate(expiryDate)}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {!showCancelConfirm ? (
                        <Button 
                          variant="destructive" 
                          className="w-full mt-2"
                          onClick={() => setShowCancelConfirm(true)}
                        >
                          Cancel Subscription
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-gray-600 text-sm">Are you sure you want to cancel your subscription? You will lose access to premium features once your current billing period ends.</p>
                          <div className="flex space-x-3">
                            <Button 
                              variant="outline" 
                              className="w-full" 
                              onClick={() => setShowCancelConfirm(false)}
                            >
                              Keep Subscription
                            </Button>
                            <Button 
                              variant="destructive" 
                              className="w-full"
                              onClick={cancelSubscription}
                              disabled={isProcessing}
                            >
                              {isProcessing ? "Processing..." : "Confirm Cancellation"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
              
              <p className="text-center text-gray-600 mt-4">
                You can continue to use your subscription until the expiry date.
              </p>
              <div className="text-center mt-4">
                <Button 
                  onClick={() => navigate("/chat")} 
                  className="bg-chatbot hover:bg-chatbot/90"
                >
                  Go to Chat
                </Button>
              </div>
            </div>
          )}
          
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
