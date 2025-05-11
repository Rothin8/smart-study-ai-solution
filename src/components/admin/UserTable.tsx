
import { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import UserTableRow from "./UserTableRow";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { TableCell } from "@/components/ui/table";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  subscription_type: string | null;
  is_active: boolean | null;
  is_admin?: boolean;
}

interface UserTableProps {
  searchQuery: string;
}

export default function UserTable({ searchQuery }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch users from the edge function
      const { data: responseData, error } = await supabase.functions.invoke('get-admin-users');

      if (error) throw error;

      const userData = responseData?.users || [];
      
      // Fetch admin users to check which users are admins
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('id');

      if (adminError) throw adminError;

      // Mark admin users
      const adminIds = adminUsers?.map(admin => admin.id) || [];
      const usersWithAdminStatus = userData.map((user: User) => ({
        ...user,
        is_admin: adminIds.includes(user.id)
      }));

      setUsers(usersWithAdminStatus);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-2">Error: {error}</p>
        <button 
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last Sign In</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserTableRow key={user.id} user={user} refreshUsers={fetchUsers} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No users found with the current search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
