
import { Message } from "@/contexts/ChatContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[80%] md:max-w-[70%]",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <Avatar className={cn("h-8 w-8", isUser ? "ml-2" : "mr-2")}>
          {isUser ? (
            <AvatarFallback className="bg-chatbot text-white">U</AvatarFallback>
          ) : (
            <>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-purple-600 text-white">AI</AvatarFallback>
            </>
          )}
        </Avatar>
        
        <div
          className={cn(
            "p-4",
            isUser ? "chat-bubble-user" : "chat-bubble-ai"
          )}
        >
          <p className={isUser ? "text-gray-800" : "text-white"}>{message.content}</p>
          <div
            className={cn(
              "text-xs mt-1",
              isUser ? "text-gray-500" : "text-white/70"
            )}
          >
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
