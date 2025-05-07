
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";

const Navbar = () => {
  const { isAuthenticated, signOut, user } = useAuth();
  const location = useLocation();
  const isOnChatPage = location.pathname === "/chat";
  const isOnHomePage = location.pathname === "/";
  const isOnAuthPage = location.pathname === "/auth";

  // Safely extract username from user_metadata or fall back to "User"
  const displayName = user?.user_metadata?.name || "User";

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
              {isOnChatPage && (
                <Link to="/">
                  <Button variant="outline" size="sm" className="rounded-full">Home</Button>
                </Link>
              )}
              {!isOnChatPage && !isOnHomePage && (
                <>
                  <Link to="/chat">
                    <Button variant="outline" className="rounded-full">Chat</Button>
                  </Link>
                  <Button variant="ghost" onClick={signOut} className="rounded-full">
                    Sign Out
                  </Button>
                </>
              )}
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
