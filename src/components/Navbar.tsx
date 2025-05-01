
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, signOut, user } = useAuth();
  const location = useLocation();
  const isOnChatPage = location.pathname === "/chat";

  return (
    <nav className="bg-white py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-chatbot to-blue-500 flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="text-xl font-bold text-gray-800">Solution.AI</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-600 hidden md:inline-block">
                Welcome, {user?.name || "User"}
              </span>
              {!isOnChatPage && (
                <>
                  <Link to="/chat">
                    <Button variant="outline">Chat</Button>
                  </Link>
                  <Button variant="ghost" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              )}
              {isOnChatPage && (
                <Link to="/">
                  <Button variant="outline">Home</Button>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/auth?tab=register">
                <Button className="bg-chatbot hover:bg-chatbot/90">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
