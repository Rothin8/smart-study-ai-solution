
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ClassBoardSelector from "@/components/ClassBoardSelector";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useChat } from "@/contexts/ChatContext";

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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-6 px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Solution.AI Chat</h1>
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
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="sticky top-6">
                <ClassBoardSelector />
                
                {selectedClass && selectedBoard && (
                  <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium mb-2">Current Selection</h3>
                    <p className="text-sm text-gray-600">Class: {selectedClass}</p>
                    <p className="text-sm text-gray-600">Board: {selectedBoard}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6">
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;
