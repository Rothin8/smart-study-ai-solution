
import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

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
      const pdf = new jsPDF();
      
      // Set title
      pdf.setFontSize(18);
      pdf.text("Solution.AI Chat History", 20, 20);
      
      // Add class and board information
      pdf.setFontSize(12);
      pdf.text(`Class: ${selectedClass} | Board: ${selectedBoard}`, 20, 30);
      
      let yPosition = 40;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const textWidth = pageWidth - (2 * margin);
      
      // Add each message to the PDF
      messages.forEach((msg) => {
        const roleText = msg.role === "user" ? "You" : "Solution.AI";
        const timestamp = new Date(msg.timestamp).toLocaleString();
        
        // Add message header
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'bold');
        pdf.text(`${roleText} (${timestamp})`, margin, yPosition);
        yPosition += 6;
        
        // Add message content
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(10);
        
        // Split the message content into lines that fit the PDF width
        const lines = pdf.splitTextToSize(msg.content, textWidth);
        
        // Check if adding these lines will exceed the page height
        if (yPosition + (lines.length * 5) > 280) {
          pdf.addPage();
          yPosition = 20;
        }
        
        // Add the message content lines
        pdf.text(lines, margin, yPosition);
        yPosition += (lines.length * 5) + 10;
        
        // Add some space between messages
        if (yPosition > 280) {
          pdf.addPage();
          yPosition = 20;
        } else {
          yPosition += 5;
        }
      });
      
      // Save the PDF
      pdf.save(`solution-ai-chat-${new Date().toISOString().split("T")[0]}.pdf`);
      
      toast({
        title: "Success",
        description: "Chat history downloaded as PDF successfully!",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
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
