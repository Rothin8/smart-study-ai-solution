
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setUserAsAdmin, removeUserAsAdmin } from "@/utils/adminUtils";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserTableRowProps {
  user: {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    subscription_type: string | null;
    is_active: boolean | null;
    is_admin?: boolean;
  };
  refreshUsers: () => void;
}

export default function UserTableRow({ user, refreshUsers }: UserTableRowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  const handleAdminStatusChange = async () => {
    setIsLoading(true);
    try {
      let result;
      
      if (user.is_admin) {
        result = await removeUserAsAdmin(user.id);
        if (result.success) {
          toast({
            title: "Admin access removed",
            description: `Admin access has been removed for ${user.email}`
          });
        }
      } else {
        result = await setUserAsAdmin(user.id);
        if (result.success) {
          toast({
            title: "Admin access granted",
            description: `Admin access has been granted to ${user.email}`
          });
        }
      }
      
      // Refresh the user list
      refreshUsers();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update admin status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{user.email}</TableCell>
      <TableCell>{formatDate(user.created_at)}</TableCell>
      <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
      <TableCell>
        {user.subscription_type ? (
          <Badge variant="outline" className="capitalize">{user.subscription_type}</Badge>
        ) : (
          <span className="text-gray-400">None</span>
        )}
      </TableCell>
      <TableCell>
        {user.is_admin ? (
          <Badge className="bg-purple-600">Admin</Badge>
        ) : (
          <span className="text-gray-400">User</span>
        )}
      </TableCell>
      <TableCell>
        <Button 
          size="sm" 
          variant={user.is_admin ? "destructive" : "outline"} 
          onClick={handleAdminStatusChange}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (user.is_admin ? "Remove Admin" : "Make Admin")}
        </Button>
      </TableCell>
    </TableRow>
  );
}
