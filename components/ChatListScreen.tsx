import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    FlatList,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

// Sample data for active users / stories
const activeUsers = [
  { id: "add", name: "My Status", isAdd: true },
  {
    id: "1",
    name: "Anna",
    avatar: "https://i.pravatar.cc/150?img=1",
    isOnline: true,
    hasStory: false,
  },
  {
    id: "2",
    name: "James",
    avatar: "https://i.pravatar.cc/150?img=3",
    isOnline: false,
    hasStory: true,
  },
  {
    id: "3",
    name: "Sarah",
    avatar: "https://i.pravatar.cc/150?img=5",
    isOnline: true,
    hasStory: false,
  },
  {
    id: "4",
    name: "Michael",
    avatar: "https://i.pravatar.cc/150?img=8",
    isOnline: false,
    hasStory: false,
  },
  {
    id: "5",
    name: "Emma",
    avatar: "https://i.pravatar.cc/150?img=9",
    isOnline: true,
    hasStory: false,
  },
];

// Sample data for chats
const chats = [
  {
    id: "1",
    name: "Clara Oswald",
    avatar: "https://i.pravatar.cc/150?img=10",
    lastMessage: "Are we still on for lunch today? 🥗",
    time: "12:30 PM",
    unreadCount: 2,
    isOnline: true,
    isTyping: false,
    isRead: false,
  },
  {
    id: "2",
    name: "David Miller",
    avatar: "https://i.pravatar.cc/150?img=11",
    lastMessage: "I sent over the files you requested.",
    time: "Yesterday",
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
    isRead: true,
  },
  {
    id: "3",
    name: "Emily Chen",
    avatar: "https://i.pravatar.cc/150?img=12",
    lastMessage: "",
    time: "Now",
    unreadCount: 1,
    isOnline: true,
    isTyping: true,
    isRead: false,
  },
  {
    id: "4",
    name: "Team Project Alpha",
    avatar: "https://i.pravatar.cc/150?img=13",
    lastMessage: "You: Sounds like a plan! 👍",
    time: "Tuesday",
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
    isRead: true,
    isSent: true,
  },
  {
    id: "5",
    name: "Mom ❤️",
    avatar: "https://i.pravatar.cc/150?img=20",
    lastMessage: "Call me when you get home.",
    time: "Mon",
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
    isRead: false,
    isSent: true,
  },
  {
    id: "6",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=15",
    lastMessage: "🎤 Voice message (0:45)",
    time: "Sun",
    unreadCount: 0,
    isOnline: true,
    isTyping: false,
    isRead: false,
    isVoice: true,
  },
];

interface Props {
  onChatPress?: (chatId: string) => void;
}

export default function ChatListScreen({ onChatPress }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderActiveUser = ({
    item,
    index,
  }: {
    item: (typeof activeUsers)[0];
    index: number;
  }) => (
    <Animated.View entering={FadeIn.delay(index * 50).duration(400)}>
      <Pressable style={styles.storyItem}>
        {item.isAdd ? (
          <View style={styles.addStoryButton}>
            <Ionicons name="add" size={24} color="#47eb99" />
          </View>
        ) : (
          <View style={styles.storyAvatarContainer}>
            <View
              style={[
                styles.storyAvatar,
                item.hasStory && styles.storyAvatarRing,
              ]}
            >
              <Image source={{ uri: item.avatar }} style={styles.storyImage} />
            </View>
            {item.isOnline && <View style={styles.onlineIndicatorStory} />}
          </View>
        )}
        <Text style={styles.storyName} numberOfLines={1}>
          {item.name}
        </Text>
      </Pressable>
    </Animated.View>
  );

  const renderChatItem = ({
    item,
    index,
  }: {
    item: (typeof chats)[0];
    index: number;
  }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
      <Pressable style={styles.chatItem} onPress={() => onChatPress?.(item.id)}>
        {/* Avatar */}
        <View style={styles.chatAvatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
          {item.isOnline && <View style={styles.onlineIndicatorChat} />}
        </View>

        {/* Content */}
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text
              style={[
                styles.chatTime,
                item.unreadCount > 0 && styles.chatTimeUnread,
              ]}
            >
              {item.time}
            </Text>
          </View>
          <View style={styles.chatFooter}>
            {item.isTyping ? (
              <Text style={styles.typingText}>typing...</Text>
            ) : item.isVoice ? (
              <View style={styles.voiceMessage}>
                <Ionicons name="mic" size={14} color="#64748b" />
                <Text style={styles.chatMessage} numberOfLines={1}>
                  Voice message (0:45)
                </Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.chatMessage,
                  item.unreadCount > 0 && styles.chatMessageUnread,
                ]}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
            )}

            {/* Status indicators */}
            {item.unreadCount > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            ) : item.isSent ? (
              <Ionicons
                name={item.isRead ? "checkmark-done" : "checkmark"}
                size={16}
                color={item.isRead ? "#47eb99" : "#94a3b8"}
              />
            ) : item.isRead ? (
              <Ionicons name="checkmark-done" size={16} color="#47eb99" />
            ) : null}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.profileButton}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=32" }}
              style={styles.profileAvatar}
            />
            <View style={styles.profileOnline} />
          </Pressable>
          <Text style={styles.headerTitle}>Chats</Text>
        </View>
        <Pressable style={styles.editButton}>
          <Ionicons name="create-outline" size={20} color="#1e293b" />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#94a3b8"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Stories / Active Users */}
      <View style={styles.storiesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContent}
        >
          {activeUsers.map((user, index) => (
            <View key={user.id}>{renderActiveUser({ item: user, index })}</View>
          ))}
        </ScrollView>
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8f7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: "#f6f8f7",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileButton: {
    position: "relative",
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileOnline: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#47eb99",
    borderWidth: 2,
    borderColor: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: "#1e293b",
  },
  storiesSection: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  storiesContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  storyItem: {
    alignItems: "center",
    width: 64,
  },
  addStoryButton: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(71, 235, 153, 0.4)",
    backgroundColor: "rgba(71, 235, 153, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  storyAvatarContainer: {
    position: "relative",
  },
  storyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    overflow: "hidden",
  },
  storyAvatarRing: {
    borderWidth: 2,
    borderColor: "#47eb99",
  },
  storyImage: {
    width: "100%",
    height: "100%",
  },
  onlineIndicatorStory: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  storyName: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
    color: "#1e293b",
    textAlign: "center",
  },
  chatList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  chatAvatarContainer: {
    position: "relative",
  },
  chatAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicatorChat: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#47eb99",
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatContent: {
    flex: 1,
    gap: 4,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
    marginRight: 8,
  },
  chatTime: {
    fontSize: 12,
    color: "#64748b",
  },
  chatTimeUnread: {
    fontWeight: "600",
    color: "#47eb99",
  },
  chatFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  chatMessage: {
    flex: 1,
    fontSize: 14,
    color: "#64748b",
  },
  chatMessageUnread: {
    fontWeight: "500",
    color: "#1e293b",
  },
  typingText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "italic",
    color: "#47eb99",
  },
  voiceMessage: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#47eb99",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#112119",
  },
});
