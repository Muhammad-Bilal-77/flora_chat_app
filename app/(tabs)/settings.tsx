import { Ionicons } from "@expo/vector-icons";
import {
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const settingsSections = [
  {
    title: "Account",
    items: [
      {
        id: "profile",
        icon: "person-outline",
        label: "Edit Profile",
        type: "link",
      },
      {
        id: "privacy",
        icon: "lock-closed-outline",
        label: "Privacy",
        type: "link",
      },
      {
        id: "security",
        icon: "shield-checkmark-outline",
        label: "Security",
        type: "link",
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        id: "notifications",
        icon: "notifications-outline",
        label: "Notifications",
        type: "toggle",
        value: true,
      },
      {
        id: "darkMode",
        icon: "moon-outline",
        label: "Dark Mode",
        type: "toggle",
        value: false,
      },
      {
        id: "language",
        icon: "language-outline",
        label: "Language",
        type: "link",
        value: "English",
      },
    ],
  },
  {
    title: "Storage",
    items: [
      {
        id: "data",
        icon: "analytics-outline",
        label: "Data Usage",
        type: "link",
      },
      {
        id: "storage",
        icon: "folder-outline",
        label: "Storage",
        type: "link",
        value: "2.4 GB",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        id: "help",
        icon: "help-circle-outline",
        label: "Help Center",
        type: "link",
      },
      {
        id: "feedback",
        icon: "chatbox-outline",
        label: "Send Feedback",
        type: "link",
      },
      {
        id: "about",
        icon: "information-circle-outline",
        label: "About",
        type: "link",
      },
    ],
  },
];

export default function SettingsTab() {
  const renderSettingItem = (
    item: (typeof settingsSections)[0]["items"][0],
    index: number,
  ) => (
    <Animated.View
      key={item.id}
      entering={FadeInDown.delay(index * 50).duration(300)}
    >
      <Pressable style={styles.settingItem}>
        <View style={styles.settingIconContainer}>
          <Ionicons name={item.icon as any} size={22} color="#47eb99" />
        </View>
        <Text style={styles.settingLabel}>{item.label}</Text>
        {item.type === "toggle" ? (
          <Switch
            value={item.value as boolean}
            trackColor={{ false: "#e2e8f0", true: "rgba(71, 235, 153, 0.5)" }}
            thumbColor={item.value ? "#47eb99" : "#fff"}
          />
        ) : (
          <View style={styles.settingRight}>
            {item.value && (
              <Text style={styles.settingValue}>{item.value}</Text>
            )}
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <Pressable style={styles.profileCard}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=32" }}
              style={styles.profileAvatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileStatus}>Online</Text>
            </View>
            <View style={styles.qrButton}>
              <Ionicons name="qr-code-outline" size={22} color="#47eb99" />
            </View>
          </Pressable>
        </Animated.View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) =>
                renderSettingItem(item, sectionIndex * 3 + itemIndex),
              )}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Pressable style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={22} color="#ef4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </Animated.View>

        {/* Version */}
        <Text style={styles.version}>Flora Chat v2.5.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8f7",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 24,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  profileStatus: {
    fontSize: 14,
    color: "#47eb99",
    fontWeight: "500",
  },
  qrButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(71, 235, 153, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
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
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(71, 235, 153, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#1e293b",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: "#64748b",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    gap: 8,
    marginBottom: 24,
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
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 20,
  },
});
