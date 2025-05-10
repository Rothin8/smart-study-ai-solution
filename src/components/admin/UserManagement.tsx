
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserTable from "./UserTable";
import UserSearchBar from "./UserSearchBar";

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

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
        <UserSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRefresh={fetchUsers}
        />
      </div>
      
      <UserTable 
        users={filteredUsers} 
        loading={loading} 
        onUserUpdated={fetchUsers} 
      />
    </div>
  );
};

export default UserManagement;
