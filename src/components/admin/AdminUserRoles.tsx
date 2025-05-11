
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { setUserAsAdmin, removeUserAsAdmin } from "@/utils/adminUtils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AdminUserRoles() {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSetAdmin = async () => {
    if (!userId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid user ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await setUserAsAdmin(userId.trim());
      
      if (result.success) {
        toast({
          title: "Success",
          description: "User has been granted admin access",
        });
        setUserId("");
      } else {
        throw new Error(result.error?.message || "Unknown error");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to set admin role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!userId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid user ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await removeUserAsAdmin(userId.trim());
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Admin access has been revoked for the user",
        });
        setUserId("");
      } else {
        throw new Error(result.error?.message || "Unknown error");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove admin role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin User Management</CardTitle>
          <CardDescription>
            Grant or revoke admin privileges for users. You will need the user's ID.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="userId" className="text-sm font-medium">
                User ID
              </label>
              <div className="mt-1">
                <Input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter the user ID"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                The user ID can be found in the User Management table.
              </p>
            </div>

            <div className="flex space-x-4 pt-2">
              <Button 
                onClick={handleSetAdmin} 
                disabled={isLoading || !userId.trim()}
                className="bg-green-600 hover:bg-green-700">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Grant Admin Access
              </Button>
              <Button 
                onClick={handleRemoveAdmin} 
                disabled={isLoading || !userId.trim()}
                variant="destructive">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Revoke Admin Access
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
