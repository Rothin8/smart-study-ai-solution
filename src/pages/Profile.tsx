
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderHistory from "@/components/OrderHistory";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, User } from "lucide-react";

const Profile = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const { isSubscribed, subscriptionType, expiryDate } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-12 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Your Account</h1>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg border shadow p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-chatbot/10 rounded-full p-2">
                      <User className="h-5 w-5 text-chatbot" />
                    </div>
                    <h2 className="text-lg font-semibold">Profile</h2>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        onClick={signOut}
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>

                {isSubscribed && (
                  <div className="bg-white rounded-lg border shadow p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-chatbot/10 rounded-full p-2">
                        <Calendar className="h-5 w-5 text-chatbot" />
                      </div>
                      <h2 className="text-lg font-semibold">Subscription</h2>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Plan</p>
                        <p className="font-medium capitalize">{subscriptionType}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium text-green-600">Active</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Expires on</p>
                        <p className="font-medium">{formatDate(expiryDate)}</p>
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          size="sm" 
                          className="w-full bg-chatbot hover:bg-chatbot/90"
                          onClick={() => navigate("/subscription")}
                        >
                          Manage Subscription
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {!isSubscribed && (
                  <div className="bg-white rounded-lg border border-dashed shadow p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-chatbot/10 rounded-full p-2">
                        <Calendar className="h-5 w-5 text-chatbot" />
                      </div>
                      <h2 className="text-lg font-semibold">Subscription</h2>
                    </div>
                    
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-4">
                        You don't have an active subscription
                      </p>
                      <Button 
                        className="w-full bg-chatbot hover:bg-chatbot/90"
                        onClick={() => navigate("/subscription")}
                      >
                        View Plans
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Main content */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-chatbot/10 rounded-full p-2">
                    <CreditCard className="h-5 w-5 text-chatbot" />
                  </div>
                  <h2 className="text-lg font-semibold">Payment History</h2>
                </div>
                
                <OrderHistory />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
