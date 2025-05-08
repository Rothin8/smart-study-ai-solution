
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

    // Get all users from auth.users table using service role (no RLS)
    const { data: authUsers, error: authError } = await supabase
      .from("auth.users")
      .select("id, email, created_at, last_sign_in_at");

    if (authError) {
      throw authError;
    }

    // Get subscription data for all users
    const { data: subscriptions, error: subError } = await supabase
      .from("subscribers")
      .select("user_id, subscription_type, is_active");

    if (subError) {
      throw subError;
    }

    // Combine the data
    const users = authUsers.map((user: any) => {
      const subscription = subscriptions.find(
        (sub: any) => sub.user_id === user.id && sub.is_active
      );
      
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        subscription_type: subscription ? subscription.subscription_type : null,
        is_active: subscription ? subscription.is_active : null,
      };
    });

    return new Response(
      JSON.stringify({ users }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    
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
