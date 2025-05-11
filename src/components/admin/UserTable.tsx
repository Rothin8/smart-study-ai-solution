
import { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import UserTableRow from "./UserTableRow";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
  users: User[];
  loading: boolean;
  onUserUpdated: () => void;
}

export default function UserTable({ users, loading, onUserUpdated }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>Loading users...</span>
      </div>
    );
  }

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <UserTableRow key={user.id} user={user} refreshUsers={onUserUpdated} />
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
