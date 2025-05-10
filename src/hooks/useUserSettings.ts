
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type UserSettings = {
  theme: string;
  notifications_enabled: boolean;
};

export function useUserSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    theme: "light",
    notifications_enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserSettings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserSettings = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("user_settings")
        .select("theme, notifications_enabled")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          theme: data.theme,
          notifications_enabled: data.notifications_enabled,
        });
      } else {
        // If no settings exist yet, create default settings
        await createDefaultSettings();
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
      toast({
        title: "Error",
        description: "Failed to load your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSettings = async () => {
    if (!user) return;

    try {
      const defaultSettings = {
        user_id: user.id,
        theme: "light",
        notifications_enabled: true,
      };

      const { error } = await supabase
        .from("user_settings")
        .insert(defaultSettings);

      if (error) throw error;

      setSettings({
        theme: defaultSettings.theme,
        notifications_enabled: defaultSettings.notifications_enabled,
      });
    } catch (error) {
      console.error("Error creating default settings:", error);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_settings")
        .update({
          ...newSettings,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setSettings((prev) => ({
        ...prev,
        ...newSettings,
      }));

      toast({
        title: "Settings Updated",
        description: "Your settings have been saved successfully.",
      });

      return true;
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update your settings. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
  };
}
