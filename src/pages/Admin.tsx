
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import AdminNavbar from "@/components/AdminNavbar";
import UserManagement from "@/components/admin/UserManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminSettings from "@/components/admin/AdminSettings";
import { Loader2, ShieldAlert } from "lucide-react";

const Admin = () => {
  const { user, isAuthenticated, isLoading, isAdmin, isAdminLoading } = useAuth();
  const navigate = useNavigate();

  // Show loading indicator while checking authentication and admin status
  if (isLoading || isAdminLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Verifying admin access...</span>
      </div>
    );
  }

  // Redirect non-authenticated users or non-admin users
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 text-center p-4">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          {!isAuthenticated 
            ? "Please sign in to access this area." 
            : "You don't have permission to access the admin dashboard."}
        </p>
        {setTimeout(() => navigate("/"), 2000) && null}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="orders">Orders & Subscriptions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <Card className="p-6">
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="orders">
              <OrderManagement />
            </TabsContent>
            
            <TabsContent value="analytics">
              <AdminAnalytics />
            </TabsContent>
            
            <TabsContent value="settings">
              <AdminSettings />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
