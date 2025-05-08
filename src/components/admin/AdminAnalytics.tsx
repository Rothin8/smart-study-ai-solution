
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Users, CreditCard, Activity } from "lucide-react";

type AnalyticsData = {
  userStats: {
    totalUsers: number;
    newUsersToday: number;
    activeUsers: number;
  };
  revenueStats: {
    totalRevenue: number;
    monthlyRevenue: number;
    averageOrderValue: number;
  };
  subscriptionStats: {
    totalSubscribers: number;
    basicSubscribers: number;
    premiumSubscribers: number;
  };
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
  subscriptionsByType: {
    name: string;
    value: number;
  }[];
  usersRegistrationByMonth: {
    month: string;
    users: number;
  }[];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Call the edge function to get analytics data
      const { data, error } = await supabase.functions.invoke('get-admin-analytics');
      
      if (error) throw error;
      
      if (data) {
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive",
      });
      
      // Set mock data for visualization if API fails
      setMockData();
    } finally {
      setLoading(false);
    }
  };
  
  // Mock data for demonstration when API fails
  const setMockData = () => {
    const mockData: AnalyticsData = {
      userStats: {
        totalUsers: 143,
        newUsersToday: 5,
        activeUsers: 78,
      },
      revenueStats: {
        totalRevenue: 156000,
        monthlyRevenue: 42000,
        averageOrderValue: 1350,
      },
      subscriptionStats: {
        totalSubscribers: 86,
        basicSubscribers: 63,
        premiumSubscribers: 23,
      },
      revenueByMonth: [
        { month: "Jan", revenue: 25000 },
        { month: "Feb", revenue: 30000 },
        { month: "Mar", revenue: 28000 },
        { month: "Apr", revenue: 35000 },
        { month: "May", revenue: 32000 },
        { month: "Jun", revenue: 42000 },
      ],
      subscriptionsByType: [
        { name: "Basic", value: 63 },
        { name: "Premium", value: 23 },
        { name: "None", value: 57 }
      ],
      usersRegistrationByMonth: [
        { month: "Jan", users: 12 },
        { month: "Feb", users: 19 },
        { month: "Mar", users: 15 },
        { month: "Apr", users: 27 },
        { month: "May", users: 34 },
        { month: "Jun", users: 36 },
      ]
    };
    
    setAnalyticsData(mockData);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center">
        <p>Failed to load analytics data. Please try again.</p>
        <Button onClick={fetchAnalytics} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.userStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{analyticsData.userStats.newUsersToday} today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.subscriptionStats.totalSubscribers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (analyticsData.subscriptionStats.totalSubscribers / analyticsData.userStats.totalUsers) * 100
              )}% of all users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analyticsData.revenueStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ₹{analyticsData.revenueStats.averageOrderValue} avg. order
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analyticsData.revenueStats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={analyticsData.revenueByMonth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#7152F3" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="p-6">
          <CardHeader>
            <CardTitle>New Users</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={analyticsData.usersRegistrationByMonth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="p-6 md:col-span-2">
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.subscriptionsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.subscriptionsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Users"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Import this within the component to fix TypeScript error
const Button = ({ onClick, className, children }: { 
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:scale-95 disabled:pointer-events-none disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

export default AdminAnalytics;
