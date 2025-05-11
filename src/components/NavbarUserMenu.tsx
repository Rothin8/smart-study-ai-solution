
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

const NavbarUserMenu = () => {
  const { isAuthenticated, signOut, user, isAdmin } = useAuth();
  const { subscriptionType } = useSubscription();
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || "User";

  if (!isAuthenticated) {
    return (
      <>
        <Link to="/auth">
          <Button variant="outline" className="rounded-full">Sign In</Button>
        </Link>
        <Link to="/auth?tab=register">
          <Button className="bg-chatbot hover:bg-chatbot/90 rounded-full">Sign Up</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <span className="text-gray-600 hidden md:inline-block">
        Welcome, {displayName}
      </span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-10 w-10 rounded-full p-0">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to="/profile" className="w-full cursor-pointer">
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/subscription" className="w-full cursor-pointer">
              Subscription
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/chat" className="w-full cursor-pointer">
              Chat
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link to="/admin" className="w-full cursor-pointer">
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={signOut} className="cursor-pointer">
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default NavbarUserMenu;
