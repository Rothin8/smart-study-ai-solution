
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import NavbarUserMenu from "@/components/NavbarUserMenu";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isOnChatPage = location.pathname === "/chat";
  const isOnHomePage = location.pathname === "/";
  const isOnAuthPage = location.pathname === "/auth";

  return (
    <nav className="bg-white py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Logo size={isOnChatPage ? "large" : "medium"} showTagline={!isOnChatPage} />
        
        <div className="flex items-center space-x-4">
          {/* Only show sign in/sign up on non-home and non-auth pages if not authenticated */}
          {!isAuthenticated && !isOnHomePage && !isOnAuthPage && (
            <NavbarUserMenu />
          )}
          
          {/* Show user menu if authenticated */}
          {isAuthenticated && <NavbarUserMenu />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
