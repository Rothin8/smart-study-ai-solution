
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface SubscriptionCardProps {
  type: "basic" | "premium";
  title: string;
  price: string;
  dailyPrice: string;
  features: string[];
  recommended?: boolean;
}

const SubscriptionCard = ({
  type,
  title,
  price,
  dailyPrice,
  features,
  recommended = false,
}: SubscriptionCardProps) => {
  const { subscriptionType, subscribe, isProcessing } = useSubscription();
  const isCurrentPlan = subscriptionType === type;

  const handleSubscribe = async () => {
    await subscribe(type);
  };

  return (
    <div
      className={`relative rounded-xl p-6 ${
        recommended
          ? "border-2 border-chatbot shadow-lg"
          : "border border-gray-200 shadow-md"
      } ${isCurrentPlan ? "bg-chatbot/5 ring-2 ring-chatbot" : "bg-white"}`}
    >
      {recommended && (
        <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-chatbot text-white px-4 py-1 rounded-full text-sm font-medium">
          Recommended
        </span>
      )}
      
      {isCurrentPlan && (
        <span className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-tr-xl rounded-bl-xl text-xs font-medium">
          Your Plan
        </span>
      )}
      
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      
      <div className="mb-4">
        <span className="text-3xl font-bold text-gray-900">₹{price}</span>
        <span className="text-gray-500"> / year</span>
        <p className="text-sm text-gray-500 mt-1">Just ₹{dailyPrice}/day</p>
      </div>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-chatbot flex-shrink-0 mr-2" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button
        className={`w-full ${
          isCurrentPlan
            ? "bg-green-500 hover:bg-green-600"
            : "bg-chatbot hover:bg-chatbot/90"
        }`}
        disabled={isCurrentPlan || isProcessing}
        onClick={handleSubscribe}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : isCurrentPlan ? (
          "Current Plan"
        ) : (
          "Subscribe Now"
        )}
      </Button>
    </div>
  );
};

export default SubscriptionCard;
