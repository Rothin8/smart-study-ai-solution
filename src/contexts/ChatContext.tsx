
import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

type ClassOption = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type BoardOption = "SEBA" | "CBSE" | "AHSEC";

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

type ChatContextType = {
  messages: Message[];
  selectedClass: ClassOption | null;
  selectedBoard: BoardOption | null;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  selectClass: (classNum: ClassOption) => void;
  selectBoard: (board: BoardOption) => void;
  downloadChatHistory: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassOption | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<BoardOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const getBoardOptions = (classNum: ClassOption): BoardOption[] => {
    if (classNum <= 10) {
      return ["SEBA", "CBSE"];
    } else {
      return ["AHSEC", "CBSE"];
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      setIsLoading(true);

      // Add user message
      const userMessage: Message = {
        id: `message_${Date.now()}_user`,
        content,
        role: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // In a real app, we would call an AI service here
      // For now, simulate an AI response
      setTimeout(() => {
        const aiResponse = generateMockResponse(content, selectedClass, selectedBoard);
        
        const assistantMessage: Message = {
          id: `message_${Date.now()}_assistant`,
          content: aiResponse,
          role: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const generateMockResponse = (
    message: string,
    classNum: ClassOption | null,
    board: BoardOption | null
  ): string => {
    // Simple mock response generator
    if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
      return `Hello there! I'm your AI study buddy. How can I help with your Class ${classNum} ${board} studies today?`;
    }

    if (message.toLowerCase().includes("math") || message.toLowerCase().includes("mathematics")) {
      return `For mathematics in Class ${classNum} with ${board} curriculum, I recommend focusing on solving practice problems regularly. Would you like me to explain a specific math concept or help with a problem?`;
    }

    if (message.toLowerCase().includes("science")) {
      return `Science in Class ${classNum} ${board} covers many interesting topics. What particular area are you studying right now? Physics, Chemistry, or Biology?`;
    }

    return `I understand you're asking about "${message}" for Class ${classNum} following the ${board} curriculum. Could you provide more details about the specific concept or problem you're working on so I can help you better?`;
  };

  const clearChat = () => {
    setMessages([]);
  };

  const selectClass = (classNum: ClassOption) => {
    setSelectedClass(classNum);
    
    // Reset board if current board is not valid for this class
    const validBoards = getBoardOptions(classNum);
    if (selectedBoard && !validBoards.includes(selectedBoard)) {
      setSelectedBoard(validBoards[0]);
    }
  };

  const selectBoard = (board: BoardOption) => {
    setSelectedBoard(board);
  };

  const downloadChatHistory = () => {
    if (messages.length === 0) {
      toast({
        title: "No messages",
        description: "There are no messages to download.",
      });
      return;
    }

    try {
      // Format messages for PDF
      let content = "# Solution.AI Chat History\n\n";
      content += `Class: ${selectedClass} | Board: ${selectedBoard}\n\n`;
      
      messages.forEach((msg) => {
        const roleText = msg.role === "user" ? "You" : "Solution.AI";
        const timestamp = msg.timestamp.toLocaleString();
        content += `## ${roleText} (${timestamp})\n\n${msg.content}\n\n`;
      });
      
      // Create a blob and download it
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `solution-ai-chat-${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Chat history downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download chat history.",
        variant: "destructive",
      });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        selectedClass,
        selectedBoard,
        isLoading,
        sendMessage,
        clearChat,
        selectClass,
        selectBoard,
        downloadChatHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  
  return context;
};
