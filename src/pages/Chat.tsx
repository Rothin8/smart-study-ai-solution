
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useChat } from "@/contexts/ChatContext";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { MessageSquare } from "lucide-react";
import ChatSidebar from "@/components/ChatSidebar";

const Chat = () => {
  const { isAuthenticated } = useAuth();
  const { isSubscribed } = useSubscription();
  const { messages, clearChat, downloadChatHistory, selectedClass, selectedBoard } = useChat();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If not authenticated, redirect to auth page
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    // If not subscribed, redirect to subscription page
    if (!isSubscribed) {
      navigate("/subscription");
      return;
    }
  }, [isAuthenticated, isSubscribed, navigate]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const isReady = selectedClass && selectedBoard;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow py-6 px-0 md:px-0 bg-gray-50">
          <div className="flex h-[calc(100vh-8rem)]">
            <ChatSidebar />
            
            <div className="flex-1 container mx-auto max-w-5xl px-4">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                  <h1 className="text-2xl font-bold text-gray-900">Solution.AI Chat</h1>
                </div>
                <div className="flex space-x-2">
                  {messages.length > 0 && (
                    <>
                      <Button variant="outline" size="sm" onClick={clearChat}>
                        New Chat
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadChatHistory}>
                        Download
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 h-[calc(100%-4rem)]">
                {!isReady ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                      Please Select Your Class and Board
                    </h3>
                    <p className="text-gray-600">
                      Select your class and board to get personalized assistance
                    </p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                      Start a New Conversation
                    </h3>
                    <p className="text-gray-600">
                      Ask any question related to your studies for Class {selectedClass} {selectedBoard}
                    </p>
                  </div>
                ) : (
                  <div
                    ref={chatContainerRef}
                    className="max-h-[500px] overflow-y-auto mb-4 pr-2"
                  >
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                  </div>
                )}
                
                {isReady && <ChatInput />}
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default Chat;
