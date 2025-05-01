
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/contexts/ChatContext";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage, isLoading } = useChat();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    await sendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        placeholder="Ask me anything about your studies..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="min-h-[80px] resize-none"
      />
      <Button 
        type="submit" 
        className="bg-chatbot hover:bg-chatbot/90 self-end"
        disabled={!message.trim() || isLoading}
      >
        {isLoading ? "Thinking..." : "Send"}
      </Button>
    </form>
  );
};

export default ChatInput;
