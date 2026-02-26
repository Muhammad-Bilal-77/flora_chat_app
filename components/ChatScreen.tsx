import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

interface Message {
  id: string;
  text?: string;
  image?: string;
  sender: "me" | "them";
  time: string;
  read?: boolean;
}

interface ChatScreenProps {
  contact: {
    id: string;
    name: string;
    avatar: string;
    online?: boolean;
  };
  onBack: () => void;
}

// Sample messages data
const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hey! Did you see the new design mockups I sent over earlier today? 🎨",
    sender: "them",
    time: "9:41 AM",
  },
  {
    id: "2",
    text: "Yes, I just took a look! They are adorable. I really love the color palette you chose. It feels very fresh.",
    sender: "me",
    time: "9:42 AM",
    read: true,
  },
  {
    id: "3",
    text: "I'm glad you like them! I was trying to keep it professional but still friendly. Do you think the font size is readable enough?",
    sender: "them",
    time: "9:43 AM",
  },
  {
    id: "4",
    text: "You nailed it. The rounded corners on the cards are a nice touch too. The font size is perfect for mobile!",
    sender: "me",
    time: "9:45 AM",
    read: true,
  },
  {
    id: "5",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
    sender: "them",
    time: "9:46 AM",
  },
  {
    id: "6",
    text: "Here is the detail view I was talking about.",
    sender: "them",
    time: "9:46 AM",
  },
];

// Typing indicator component
function TypingIndicator() {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 300 }),
        withTiming(0, { duration: 300 }),
      ),
      -1,
    );
    setTimeout(() => {
      dot2.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 300 }),
          withTiming(0, { duration: 300 }),
        ),
        -1,
      );
    }, 100);
    setTimeout(() => {
      dot3.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 300 }),
          withTiming(0, { duration: 300 }),
        ),
        -1,
      );
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedDot1 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot1.value }],
  }));
  const animatedDot2 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot2.value }],
  }));
  const animatedDot3 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot3.value }],
  }));

  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.typingDot, animatedDot1]} />
      <Animated.View style={[styles.typingDot, animatedDot2]} />
      <Animated.View style={[styles.typingDot, animatedDot3]} />
    </View>
  );
}

export default function ChatScreen({ contact, onBack }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Simulate typing response
    setIsTyping(true);
    setTimeout(
      () => {
        setIsTyping(false);
        const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: getRandomReply(),
          sender: "them",
          time: new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, replyMessage]);
      },
      2000 + Math.random() * 2000,
    );
  }, [inputText]);

  const getRandomReply = () => {
    const replies = [
      "That sounds great! Let me know if you need anything else 😊",
      "Sure thing! I'll get back to you on that.",
      "Thanks for letting me know!",
      "Awesome! Can't wait to see how it turns out.",
      "Perfect! I'll check it out right away.",
      "Got it! I'll send you the updates soon.",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMe = item.sender === "me";

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 50).duration(300)}
        style={[
          styles.messageRow,
          isMe ? styles.messageRowMe : styles.messageRowThem,
        ]}
      >
        {!isMe && (
          <Image
            source={{ uri: contact.avatar }}
            style={styles.messageAvatar}
          />
        )}
        <View style={[styles.messageContent, isMe && styles.messageContentMe]}>
          {item.image && (
            <View
              style={[
                styles.imageBubble,
                isMe ? styles.senderBubble : styles.receiverBubble,
              ]}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.messageImage}
                resizeMode="cover"
              />
            </View>
          )}
          {item.text && (
            <View
              style={[
                styles.bubble,
                isMe ? styles.senderBubble : styles.receiverBubble,
                item.image && styles.bubbleWithImage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isMe ? styles.senderText : styles.receiverText,
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
          <View style={[styles.timeRow, isMe && styles.timeRowMe]}>
            <Text style={styles.timeText}>{item.time}</Text>
            {isMe && item.read && (
              <Ionicons name="checkmark-done" size={14} color="#47eb99" />
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderDateSeparator = () => (
    <Animated.View entering={FadeIn.duration(400)} style={styles.dateSeparator}>
      <Text style={styles.dateSeparatorText}>Today, 9:41 AM</Text>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Image source={{ uri: contact.avatar }} style={styles.headerAvatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{contact.name}</Text>
            <Text
              style={[
                styles.headerStatus,
                contact.online && styles.headerStatusOnline,
              ]}
            >
              {contact.online ? "Online" : "Offline"}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerActionButton}>
            <Ionicons name="call-outline" size={22} color="#1e293b" />
          </Pressable>
          <Pressable style={styles.headerActionButton}>
            <Ionicons name="videocam-outline" size={24} color="#1e293b" />
          </Pressable>
        </View>
      </Animated.View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderDateSeparator}
        ListFooterComponent={
          isTyping ? (
            <View style={styles.typingRow}>
              <Image
                source={{ uri: contact.avatar }}
                style={styles.messageAvatar}
              />
              <TypingIndicator />
            </View>
          ) : null
        }
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Input Area */}
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <Pressable style={styles.inputButton}>
            <Ionicons name="add" size={24} color="#64748b" />
          </Pressable>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#94a3b8"
            multiline
            maxLength={1000}
          />
          <Pressable style={styles.inputButton}>
            <Ionicons name="happy-outline" size={24} color="#64748b" />
          </Pressable>
          <Pressable
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons
              name="send"
              size={18}
              color={inputText.trim() ? "#fff" : "#94a3b8"}
            />
          </Pressable>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "ios" ? 56 : 36,
    paddingBottom: 12,
    backgroundColor: "rgba(246, 248, 247, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  headerInfo: {
    marginLeft: 4,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  headerStatus: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
  headerStatusOnline: {
    color: "#47eb99",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  dateSeparator: {
    alignItems: "center",
    marginVertical: 16,
  },
  dateSeparatorText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748b",
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  messageRowMe: {
    justifyContent: "flex-end",
  },
  messageRowThem: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 20,
  },
  messageContent: {
    maxWidth: "75%",
  },
  messageContentMe: {
    alignItems: "flex-end",
  },
  bubble: {
    padding: 14,
    borderRadius: 20,
  },
  bubbleWithImage: {
    marginTop: 4,
    borderTopLeftRadius: 8,
  },
  senderBubble: {
    backgroundColor: "#E6E6FA",
    borderBottomRightRadius: 6,
  },
  receiverBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 6,
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
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  senderText: {
    color: "#4A4A6A",
  },
  receiverText: {
    color: "#1e293b",
  },
  imageBubble: {
    borderRadius: 20,
    overflow: "hidden",
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    marginLeft: 4,
  },
  timeRowMe: {
    marginRight: 4,
    marginLeft: 0,
  },
  timeText: {
    fontSize: 11,
    color: "#94a3b8",
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    gap: 4,
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
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#94a3b8",
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 28,
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  inputButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#47eb99",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#47eb99",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sendButtonDisabled: {
    backgroundColor: "#e2e8f0",
    shadowOpacity: 0,
    elevation: 0,
  },
});
