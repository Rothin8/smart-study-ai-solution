
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // For demonstration, create analytics data
    // In a production environment, this would query the database for real statistics
    const analyticsData = {
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

    return new Response(
      JSON.stringify(analyticsData),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error generating analytics data:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 500 
      }
    );
  }
});
