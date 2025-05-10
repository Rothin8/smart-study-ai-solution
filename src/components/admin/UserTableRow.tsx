
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { setUserAsAdmin, removeUserAsAdmin } from "@/utils/adminUtils";

type UserWithSubscription = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  subscription_type: string | null;
  is_active: boolean | null;
  is_admin?: boolean;
};

interface UserTableRowProps {
  user: UserWithSubscription;
  onUserUpdated: () => void;
}

const UserTableRow = ({ user, onUserUpdated }: UserTableRowProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const makeAdmin = async (userId: string) => {
    try {
      setIsUpdating(true);
      const { success, error } = await setUserAsAdmin(userId);
      
      if (!success) throw error;

      toast({
        title: "Success",
        description: "User has been granted admin privileges.",
      });
      
      // Refresh the list to get updated data
      onUserUpdated();
    } catch (error) {
      console.error("Error making user admin:", error);
      toast({
        title: "Error",
        description: "Failed to update user privileges.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const removeAdmin = async (userId: string) => {
    try {
      setIsUpdating(true);
      const { success, error } = await removeUserAsAdmin(userId);
      
      if (!success) throw error;

      toast({
        title: "Success",
        description: "Admin privileges have been removed from user.",
      });
      
      // Refresh the list to get updated data
      onUserUpdated();
    } catch (error) {
      console.error("Error removing admin status:", error);
      toast({
        title: "Error",
        description: "Failed to update user privileges.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">{user.email}</TableCell>
      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
      <TableCell>
        {user.last_sign_in_at 
          ? new Date(user.last_sign_in_at).toLocaleDateString() 
          : 'Never'}
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          user.last_sign_in_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {user.last_sign_in_at ? 'Active' : 'Inactive'}
        </span>
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          user.subscription_type === 'premium' ? 'bg-purple-100 text-purple-800' : 
          user.subscription_type === 'basic' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {user.subscription_type && user.is_active 
            ? user.subscription_type.charAt(0).toUpperCase() + user.subscription_type.slice(1) 
            : 'None'}
        </span>
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          user.is_admin ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {user.is_admin ? 'Yes' : 'No'}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isUpdating}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!user.is_admin ? (
              <DropdownMenuItem
                onClick={() => makeAdmin(user.id)}
                disabled={isUpdating}
              >
                Make Admin
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => removeAdmin(user.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                disabled={isUpdating}
              >
                Remove Admin
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
