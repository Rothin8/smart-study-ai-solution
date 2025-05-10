
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Sets a user as an admin by adding them to the admin_users table
 */
export async function setUserAsAdmin(userId: string) {
  try {
    const { error } = await supabase
      .from("admin_users")
      .insert({
        id: userId
      });
      
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error setting user as admin:", error);
    return { success: false, error };
  }
}

/**
 * Removes a user from admin status by deleting them from the admin_users table
 */
export async function removeUserAsAdmin(userId: string) {
  try {
    const { error } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", userId);
      
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error removing admin status:", error);
    return { success: false, error };
  }
}

/**
 * Checks if the current logged-in user is an admin
 */
export async function checkIfUserIsAdmin(userId: string | undefined) {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .rpc('is_admin', { user_id: userId });
      
    if (error) throw error;
    
    return data || false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
