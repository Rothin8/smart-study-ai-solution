
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id?: string;
  message: string;
  is_user: boolean;
  created_at?: string;
}

export function useChatHistory() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchChatHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchChatHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("chat_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      toast({
        title: "Error",
        description: "Failed to load your chat history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveMessage = async (message: string, isUser: boolean = true) => {
    if (!user) return null;

    try {
      const newMessage = {
        user_id: user.id,
        message,
        is_user: isUser,
      };

      const { data, error } = await supabase
        .from("chat_history")
        .insert(newMessage)
        .select()
        .single();

      if (error) throw error;

      setMessages((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Error saving message:", error);
      toast({
        title: "Error",
        description: "Failed to save your message. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const clearChatHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("chat_history")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setMessages([]);
      toast({
        title: "Chat History Cleared",
        description: "Your chat history has been cleared successfully.",
      });
    } catch (error) {
      console.error("Error clearing chat history:", error);
      toast({
        title: "Error",
        description: "Failed to clear your chat history. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    messages,
    loading,
    saveMessage,
    clearChatHistory,
    refreshHistory: fetchChatHistory,
  };
}
