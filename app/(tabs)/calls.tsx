import { Ionicons } from "@expo/vector-icons";
import {
    FlatList,
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

// Sample call history data
const callHistory = [
  {
    id: "1",
    name: "Clara Oswald",
    avatar: "https://i.pravatar.cc/150?img=10",
    type: "incoming",
    isVideo: false,
    time: "Today, 12:30 PM",
    missed: false,
  },
  {
    id: "2",
    name: "David Miller",
    avatar: "https://i.pravatar.cc/150?img=11",
    type: "outgoing",
    isVideo: true,
    time: "Today, 10:15 AM",
    missed: false,
  },
  {
    id: "3",
    name: "Emily Chen",
    avatar: "https://i.pravatar.cc/150?img=12",
    type: "incoming",
    isVideo: false,
    time: "Yesterday, 8:45 PM",
    missed: true,
  },
  {
    id: "4",
    name: "Mom ❤️",
    avatar: "https://i.pravatar.cc/150?img=20",
    type: "outgoing",
    isVideo: false,
    time: "Yesterday, 6:30 PM",
    missed: false,
  },
  {
    id: "5",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=15",
    type: "incoming",
    isVideo: true,
    time: "Monday, 3:20 PM",
    missed: true,
  },
  {
    id: "6",
    name: "Sarah Williams",
    avatar: "https://i.pravatar.cc/150?img=5",
    type: "outgoing",
    isVideo: false,
    time: "Monday, 11:00 AM",
    missed: false,
  },
];

export default function CallsTab() {
  const renderCallItem = ({
    item,
    index,
  }: {
    item: (typeof callHistory)[0];
    index: number;
  }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(400)}>
      <Pressable style={styles.callItem}>
        {/* Avatar */}
        <Image source={{ uri: item.avatar }} style={styles.avatar} />

        {/* Content */}
        <View style={styles.callContent}>
          <Text style={[styles.callName, item.missed && styles.missedText]}>
            {item.name}
          </Text>
          <View style={styles.callInfo}>
            <Ionicons
              name={
                item.type === "incoming"
                  ? "arrow-down-outline"
                  : "arrow-up-outline"
              }
              size={14}
              color={item.missed ? "#ef4444" : "#47eb99"}
              style={styles.callIcon}
            />
            <Text style={styles.callTime}>{item.time}</Text>
          </View>
        </View>

        {/* Call Button */}
        <Pressable style={styles.callButton}>
          <Ionicons
            name={item.isVideo ? "videocam" : "call"}
            size={20}
            color="#47eb99"
          />
        </Pressable>
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calls</Text>
        <Pressable style={styles.headerButton}>
          <Ionicons name="add" size={24} color="#47eb99" />
        </Pressable>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <Pressable style={[styles.filterTab, styles.filterTabActive]}>
          <Text style={styles.filterTextActive}>All</Text>
        </Pressable>
        <Pressable style={styles.filterTab}>
          <Text style={styles.filterText}>Missed</Text>
        </Pressable>
      </View>

      {/* Call List */}
      <FlatList
        data={callHistory}
        renderItem={renderCallItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.callList}
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
  },
  headerButton: {
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
  filterTabs: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  filterTabActive: {
    backgroundColor: "#47eb99",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  filterTextActive: {
    fontSize: 14,
    fontWeight: "600",
    color: "#112119",
  },
  callList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  callItem: {
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  callContent: {
    flex: 1,
    gap: 4,
  },
  callName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  missedText: {
    color: "#ef4444",
  },
  callInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  callIcon: {
    marginRight: 6,
  },
  callTime: {
    fontSize: 13,
    color: "#64748b",
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(71, 235, 153, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});
