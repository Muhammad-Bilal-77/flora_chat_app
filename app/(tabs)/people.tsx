import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Image,
    Platform,
    Pressable,
    SectionList,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

// Sample contacts data
const contacts = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=15",
    status: "Hey there! I am using Flora Chat",
  },
  {
    id: "2",
    name: "Anna Smith",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "Available",
  },
  {
    id: "3",
    name: "Clara Oswald",
    avatar: "https://i.pravatar.cc/150?img=10",
    status: "At work",
  },
  {
    id: "4",
    name: "David Miller",
    avatar: "https://i.pravatar.cc/150?img=11",
    status: "Busy",
  },
  {
    id: "5",
    name: "Emily Chen",
    avatar: "https://i.pravatar.cc/150?img=12",
    status: "In a meeting",
  },
  {
    id: "6",
    name: "James Wilson",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: "Available",
  },
  {
    id: "7",
    name: "Michael Brown",
    avatar: "https://i.pravatar.cc/150?img=8",
    status: "Away",
  },
  {
    id: "8",
    name: "Mom ❤️",
    avatar: "https://i.pravatar.cc/150?img=20",
    status: "Online",
  },
  {
    id: "9",
    name: "Sarah Williams",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "Available",
  },
];

// Group contacts by first letter
const groupContactsByLetter = (contactsList: typeof contacts) => {
  const grouped: { [key: string]: typeof contacts } = {};
  contactsList.forEach((contact) => {
    const firstLetter = contact.name[0].toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(contact);
  });
  return Object.keys(grouped)
    .sort()
    .map((letter) => ({
      title: letter,
      data: grouped[letter],
    }));
};

export default function PeopleTab() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sections = groupContactsByLetter(filteredContacts);

  const renderContactItem = ({
    item,
    index,
  }: {
    item: (typeof contacts)[0];
    index: number;
  }) => (
    <Animated.View entering={FadeInDown.delay(index * 30).duration(300)}>
      <Pressable style={styles.contactItem}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.contactContent}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactStatus} numberOfLines={1}>
            {item.status}
          </Text>
        </View>
        <Pressable style={styles.messageButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#47eb99" />
        </Pressable>
      </Pressable>
    </Animated.View>
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>People</Text>
        <Pressable style={styles.headerButton}>
          <Ionicons name="person-add-outline" size={22} color="#47eb99" />
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
            placeholder="Search contacts..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Pressable style={styles.quickAction}>
          <View style={styles.quickActionIcon}>
            <Ionicons name="people" size={24} color="#47eb99" />
          </View>
          <Text style={styles.quickActionText}>New Group</Text>
        </Pressable>
        <Pressable style={styles.quickAction}>
          <View style={styles.quickActionIcon}>
            <Ionicons name="person-add" size={24} color="#47eb99" />
          </View>
          <Text style={styles.quickActionText}>Add Contact</Text>
        </Pressable>
      </View>

      {/* Contacts List */}
      <SectionList
        sections={sections}
        renderItem={renderContactItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contactList}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
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
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
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
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  quickAction: {
    flex: 1,
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
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(71, 235, 153, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  contactList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#47eb99",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 8,
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
  contactContent: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  contactStatus: {
    fontSize: 13,
    color: "#64748b",
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(71, 235, 153, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});
