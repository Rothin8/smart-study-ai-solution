
import { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { MessageSquare, PlusCircle, ChevronRight } from "lucide-react";
import ClassBoardSelector from "@/components/ClassBoardSelector";

const ChatSidebar = () => {
  const { messages, selectedClass, selectedBoard, clearChat } = useChat();
  const [showSelector, setShowSelector] = useState(true);

  // Group messages by date for chat history
  const chatsByDate = messages.reduce((groups: Record<string, string[]>, message) => {
    if (message.role === "user") {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message.content);
    }
    return groups;
  }, {});

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="p-2">
          <button 
            className="flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-100"
            onClick={() => setShowSelector(!showSelector)}
          >
            <div className="flex items-center">
              <MessageSquare size={18} className="mr-2 text-chatbot" />
              <span className="font-medium">
                {selectedClass && selectedBoard ? `Class ${selectedClass} - ${selectedBoard}` : "Select Class & Board"}
              </span>
            </div>
            <ChevronRight 
              size={18} 
              className={`transition-transform ${showSelector ? "rotate-90" : ""}`}
            />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {showSelector && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="p-2">
                <ClassBoardSelector />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>New Conversation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={clearChat} tooltip="Start new chat" className="rounded-md">
                  <PlusCircle size={18} />
                  <span>New Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {Object.keys(chatsByDate).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {Object.entries(chatsByDate).map(([date, contents]) => (
                  <div key={date} className="mb-2">
                    <div className="text-xs text-gray-500 ml-2 mb-1">{date}</div>
                    {contents.map((content, index) => (
                      <SidebarMenuItem key={`${date}-${index}`}>
                        <SidebarMenuButton className="rounded-md">
                          <MessageSquare size={16} />
                          <span className="truncate">{content.substring(0, 25)}{content.length > 25 ? '...' : ''}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatSidebar;
