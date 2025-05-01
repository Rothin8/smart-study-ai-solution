
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/contexts/ChatContext";
import { Send } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="flex items-end gap-2 mt-auto">
      <div className="flex-grow relative">
        <Textarea
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[60px] resize-none pr-12 rounded-2xl border-gray-200 focus:border-chatbot"
          rows={1}
        />
      </div>
      <Button 
        type="submit" 
        className="bg-chatbot hover:bg-chatbot/90 rounded-full h-10 w-10 p-0 flex items-center justify-center"
        disabled={!message.trim() || isLoading}
      >
        <Send size={18} />
      </Button>
    </form>
  );
};

export default ChatInput;
