
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Search, MoreHorizontal, Loader2 } from "lucide-react";
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

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Call the edge function to get user data with subscriptions
      const { data, error } = await supabase.functions.invoke('get-admin-users');
      
      if (error) throw error;
      
      // Check if users are admins
      if (data && Array.isArray(data.users)) {
        // Fetch admin users
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("id");
          
        if (adminError) throw adminError;
        
        const adminIds = new Set((adminData || []).map((admin: any) => admin.id));
        
        // Mark admin users
        const usersWithAdminStatus = data.users.map((user: UserWithSubscription) => ({
          ...user,
          is_admin: adminIds.has(user.id)
        }));
        
        setUsers(usersWithAdminStatus);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async (userId: string) => {
    try {
      const { success, error } = await setUserAsAdmin(userId);
      
      if (!success) throw error;

      // Update the users list
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { ...user, is_admin: true };
        }
        return user;
      }));

      toast({
        title: "Success",
        description: "User has been granted admin privileges.",
      });
      
      // Refresh the list to get updated data
      fetchUsers();
    } catch (error) {
      console.error("Error making user admin:", error);
      toast({
        title: "Error",
        description: "Failed to update user privileges.",
        variant: "destructive",
      });
    }
  };

  const removeAdmin = async (userId: string) => {
    try {
      const { success, error } = await removeUserAsAdmin(userId);
      
      if (!success) throw error;

      // Update the users list
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { ...user, is_admin: false };
        }
        return user;
      }));

      toast({
        title: "Success",
        description: "Admin privileges have been removed from user.",
      });
      
      // Refresh the list to get updated data
      fetchUsers();
    } catch (error) {
      console.error("Error removing admin status:", error);
      toast({
        title: "Error",
        description: "Failed to update user privileges.",
        variant: "destructive",
      });
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-9"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={fetchUsers} variant="outline">Refresh</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
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
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!user.is_admin ? (
                            <DropdownMenuItem
                              onClick={() => makeAdmin(user.id)}
                            >
                              Make Admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => removeAdmin(user.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              Remove Admin
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
