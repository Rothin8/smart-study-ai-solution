
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useChat } from "@/contexts/ChatContext";
import { 
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Download, ArrowLeft } from "lucide-react";
import ChatSidebar from "@/components/ChatSidebar";
import Logo from "@/components/Logo";

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
  
  const goBack = () => {
    navigate('/');
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex flex-col min-h-screen">
        <header className="bg-white py-3 px-6 shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-9 w-9" />
              <Logo size="large" showTagline={false} />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goBack} 
                className="flex items-center rounded-full"
              >
                <ArrowLeft className="mr-1" size={16} />
                <span className="hidden sm:inline">Home</span>
              </Button>
              
              {messages.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={downloadChatHistory} 
                  className="rounded-full"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline ml-1">Export</span>
                </Button>
              )}
            </div>
          </div>
        </header>
        
        <main className="flex-grow py-0 px-0 bg-gray-50">
          <div className="flex h-[calc(100vh-8rem)]">
            <ChatSidebar />
            
            <div className="flex-1 container mx-auto max-w-5xl px-4">              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 h-full flex flex-col">
                {!isReady ? (
                  <div className="text-center py-12 flex-grow flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-chatbot/10 rounded-full flex items-center justify-center mb-4">
                      <div className="w-16 h-16 text-chatbot">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                      Please Select Your Class and Board
                    </h3>
                    <p className="text-gray-600">
                      Use the sidebar menu to select your class and board to get personalized assistance
                    </p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 flex-grow flex flex-col items-center justify-center">
                    <div className="w-24 h-24 bg-chatbot/10 rounded-full flex items-center justify-center mb-4">
                      <div className="w-16 h-16 text-chatbot">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                      Welcome to Solution.AI
                    </h3>
                    <p className="text-gray-600 max-w-md">
                      Start a conversation by typing a message below. You can ask questions, request information, or just chat about Class {selectedClass} {selectedBoard} topics.
                    </p>
                  </div>
                ) : (
                  <div
                    ref={chatContainerRef}
                    className="flex-grow overflow-y-auto mb-4 pr-2"
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
