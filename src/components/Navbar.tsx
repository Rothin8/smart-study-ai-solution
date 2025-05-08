
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, signOut, user } = useAuth();
  const location = useLocation();
  const isOnChatPage = location.pathname === "/chat";
  const isOnHomePage = location.pathname === "/";
  const isOnAuthPage = location.pathname === "/auth";

  // Safely extract username from user_metadata or fall back to "User"
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || "User";

  return (
    <nav className="bg-white py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Logo size={isOnChatPage ? "large" : "medium"} showTagline={!isOnChatPage} />
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
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
                  {!isOnChatPage && (
                    <DropdownMenuItem asChild>
                      <Link to="/chat" className="w-full cursor-pointer">
                        Chat
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Only show sign in/sign up on non-home and non-auth pages */}
              {!isOnHomePage && !isOnAuthPage && (
                <>
                  <Link to="/auth">
                    <Button variant="outline" className="rounded-full">Sign In</Button>
                  </Link>
                  <Link to="/auth?tab=register">
                    <Button className="bg-chatbot hover:bg-chatbot/90 rounded-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
