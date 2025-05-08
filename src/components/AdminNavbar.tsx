
import { Link } from "react-router-dom";
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

const AdminNavbar = () => {
  const { signOut, user } = useAuth();
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || "Admin";

  return (
    <nav className="border-b bg-white py-4 shadow-sm">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/admin" className="mr-6">
            <Logo size="medium" showTagline={false} />
            <span className="ml-2 text-xs font-bold uppercase text-purple-600">Admin</span>
          </Link>
          
          <div className="hidden space-x-4 md:flex">
            <Link to="/admin" className="text-sm font-medium text-gray-700 hover:text-purple-600">
              Dashboard
            </Link>
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-purple-600">
              View Site
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="hidden text-sm text-gray-600 md:inline-block">
            Admin: {displayName}
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
                <Link to="/" className="w-full cursor-pointer">
                  Main Site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
