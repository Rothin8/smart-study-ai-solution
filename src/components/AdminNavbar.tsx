
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { User, Home, Settings, LogOut } from "lucide-react";

const AdminNavbar = () => {
  const { signOut, user } = useAuth();
  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || "Admin";

  return (
    <nav className="border-b bg-white py-4 shadow-sm">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/admin" className="mr-6 flex items-center">
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
                <Link to="/profile" className="flex w-full cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/" className="flex w-full cursor-pointer items-center">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Main Site</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin?tab=settings" className="flex w-full cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="cursor-pointer flex items-center text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
