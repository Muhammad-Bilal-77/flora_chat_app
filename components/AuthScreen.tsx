import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    FadeOut,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

type AuthMode = "login" | "signup" | "forgot";

interface Props {
  onAuthSuccess: () => void;
}

export default function AuthScreen({ onAuthSuccess }: Props) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const onPressIn = () => {
    buttonScale.value = withTiming(0.97, { duration: 100 });
  };

  const onPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  const handleSubmit = () => {
    // In a real app, you would validate and call your auth API here
    if (mode === "login") {
      // Login logic
      onAuthSuccess();
    } else if (mode === "signup") {
      // Signup logic
      onAuthSuccess();
    } else if (mode === "forgot") {
      // Send reset email logic
      setMode("login");
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "login":
        return "Welcome Back!";
      case "signup":
        return "Create Account";
      case "forgot":
        return "Reset Password";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "login":
        return "Let's get you signed in to catch up with friends.";
      case "signup":
        return "Join Flora Chat and start connecting today.";
      case "forgot":
        return "Enter your email and we'll send you a reset link.";
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case "login":
        return "Sign In";
      case "signup":
        return "Create Account";
      case "forgot":
        return "Send Reset Link";
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Background blobs */}
      <View style={styles.blobTop} />
      <View style={styles.blobBottom} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.header}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                fill="#47eb99"
              />
            </Svg>
          </View>

          <Animated.Text
            key={mode + "-title"}
            entering={FadeIn.duration(300)}
            style={styles.title}
          >
            {getTitle()}
          </Animated.Text>
          <Animated.Text
            key={mode + "-subtitle"}
            entering={FadeIn.duration(300)}
            style={styles.subtitle}
          >
            {getSubtitle()}
          </Animated.Text>
        </Animated.View>

        {/* Card */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(500)}
          style={styles.card}
        >
          {/* Name Input (only for signup) */}
          {mode === "signup" && (
            <Animated.View
              entering={FadeInDown.duration(300)}
              exiting={FadeOut.duration(200)}
              layout={Layout.springify()}
              style={styles.inputGroup}
            >
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#94a3b8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </Animated.View>
          )}

          {/* Email Input */}
          <Animated.View layout={Layout.springify()} style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#94a3b8"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="hello@example.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </Animated.View>

          {/* Password Input (not for forgot) */}
          {mode !== "forgot" && (
            <Animated.View
              entering={FadeInDown.duration(300)}
              exiting={FadeOut.duration(200)}
              layout={Layout.springify()}
              style={styles.inputGroup}
            >
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                {mode === "login" && (
                  <Pressable onPress={() => setMode("forgot")}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </Pressable>
                )}
              </View>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#94a3b8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#94a3b8"
                  />
                </Pressable>
              </View>
            </Animated.View>
          )}

          {/* Confirm Password (only for signup) */}
          {mode === "signup" && (
            <Animated.View
              entering={FadeInDown.duration(300)}
              exiting={FadeOut.duration(200)}
              layout={Layout.springify()}
              style={styles.inputGroup}
            >
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#94a3b8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color="#94a3b8"
                  />
                </Pressable>
              </View>
            </Animated.View>
          )}

          {/* Submit Button */}
          <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
            <Pressable
              onPress={handleSubmit}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>{getButtonText()}</Text>
              <Ionicons name="arrow-forward" size={18} color="#1e293b" />
            </Pressable>
          </Animated.View>

          {/* Divider (only for login/signup) */}
          {mode !== "forgot" && (
            <Animated.View
              entering={FadeIn.duration(300)}
              layout={Layout.springify()}
              style={styles.divider}
            >
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </Animated.View>
          )}

          {/* Social Buttons (only for login/signup) */}
          {mode !== "forgot" && (
            <Animated.View
              entering={FadeInUp.duration(300)}
              layout={Layout.springify()}
              style={styles.socialButtons}
            >
              <Pressable style={styles.socialButton}>
                <Svg width={20} height={20} viewBox="0 0 24 24">
                  <Path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <Path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <Path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <Path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </Svg>
                <Text style={styles.socialButtonText}>Google</Text>
              </Pressable>

              <Pressable style={styles.socialButton}>
                <Ionicons name="logo-apple" size={22} color="#000" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </Pressable>
            </Animated.View>
          )}
        </Animated.View>

        {/* Footer */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(500)}
          style={styles.footer}
        >
          {mode === "login" && (
            <Text style={styles.footerText}>
              {"Don't have an account? "}
              <Text style={styles.footerLink} onPress={() => setMode("signup")}>
                Create Account
              </Text>
            </Text>
          )}
          {mode === "signup" && (
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text style={styles.footerLink} onPress={() => setMode("login")}>
                Sign In
              </Text>
            </Text>
          )}
          {mode === "forgot" && (
            <Text style={styles.footerText}>
              Remember your password?{" "}
              <Text style={styles.footerLink} onPress={() => setMode("login")}>
                Sign In
              </Text>
            </Text>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8f7",
  },
  blobTop: {
    position: "absolute",
    top: "-10%",
    left: "-10%",
    width: "50%",
    height: "30%",
    borderRadius: 1000,
    backgroundColor: "rgba(71, 235, 153, 0.1)",
    ...Platform.select({
      web: { filter: "blur(80px)" },
      default: {},
    }),
  },
  blobBottom: {
    position: "absolute",
    bottom: "-10%",
    right: "-10%",
    width: "60%",
    height: "40%",
    borderRadius: 1000,
    backgroundColor: "rgba(71, 235, 153, 0.05)",
    ...Platform.select({
      web: { filter: "blur(100px)" },
      default: {},
    }),
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(71, 235, 153, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    transform: [{ rotate: "3deg" }],
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    maxWidth: 280,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 0 40px -10px rgba(0, 0, 0, 0.05)",
      },
    }),
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
    marginLeft: 4,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#47eb99",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f8f7",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#1e293b",
  },
  eyeButton: {
    padding: 14,
  },
  buttonContainer: {
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: "#47eb99",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#47eb99",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0 8px 20px -6px rgba(71, 235, 153, 0.4)",
      },
    }),
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: "500",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 16,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "#f6f8f7",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#64748b",
  },
  footerLink: {
    fontWeight: "700",
    color: "#47eb99",
  },
});
