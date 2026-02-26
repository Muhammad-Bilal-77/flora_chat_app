import ChatListScreen from "@/components/ChatListScreen";
import ChatScreen from "@/components/ChatScreen";
import { useTabBar } from "@/contexts/TabBarContext";
import { useEffect, useState } from "react";

// Sample contact data matching chat IDs
const contactsMap: Record<
  string,
  { id: string; name: string; avatar: string; online: boolean }
> = {
  "1": {
    id: "1",
    name: "Clara Oswald",
    avatar: "https://i.pravatar.cc/150?img=10",
    online: true,
  },
  "2": {
    id: "2",
    name: "David Miller",
    avatar: "https://i.pravatar.cc/150?img=11",
    online: false,
  },
  "3": {
    id: "3",
    name: "Emily Chen",
    avatar: "https://i.pravatar.cc/150?img=12",
    online: true,
  },
  "4": {
    id: "4",
    name: "Team Project Alpha",
    avatar: "https://i.pravatar.cc/150?img=13",
    online: false,
  },
  "5": {
    id: "5",
    name: "Mom ❤️",
    avatar: "https://i.pravatar.cc/150?img=20",
    online: false,
  },
  "6": {
    id: "6",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=15",
    online: true,
  },
};

export default function ChatsTab() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { setTabBarVisible } = useTabBar();

  // Hide tab bar when in chat screen
  useEffect(() => {
    setTabBarVisible(!selectedChat);
  }, [selectedChat, setTabBarVisible]);

  if (selectedChat && contactsMap[selectedChat]) {
    return (
      <ChatScreen
        contact={contactsMap[selectedChat]}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  return <ChatListScreen onChatPress={setSelectedChat} />;
}
