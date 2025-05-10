
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import UserTableRow from "./UserTableRow";

type UserWithSubscription = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  subscription_type: string | null;
  is_active: boolean | null;
  is_admin?: boolean;
};

interface UserTableProps {
  users: UserWithSubscription[];
  loading: boolean;
  onUserUpdated: () => void;
}

const UserTable = ({ users, loading, onUserUpdated }: UserTableProps) => {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
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
          {users.length > 0 ? (
            users.map(user => (
              <UserTableRow 
                key={user.id} 
                user={user} 
                onUserUpdated={onUserUpdated} 
              />
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
  );
};

export default UserTable;
