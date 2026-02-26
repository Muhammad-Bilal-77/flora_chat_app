import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewToken,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Onboarding slides data
const slides = [
  {
    id: "1",
    image: require("@/assets/images/onboarding-1.png"),
    title: "Connect with Joy",
    description:
      "Discover a new way to chat with friends and family in a space that's safe, fun, and delightfully simple.",
  },
  {
    id: "2",
    image: require("@/assets/images/onboarding-1.png"),
    title: "Share Moments",
    description:
      "Send photos, voice messages, and reactions to make every conversation memorable and personal.",
  },
  {
    id: "3",
    image: require("@/assets/images/onboarding-1.png"),
    title: "Stay Together",
    description:
      "Create groups, plan events, and keep your favorite people close no matter where they are.",
  },
];

interface Props {
  onFinish: () => void;
}

export default function OnboardingScreen({ onFinish }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const buttonScale = useSharedValue(1);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const onPressIn = () => {
    buttonScale.value = withTiming(0.96, { duration: 100 });
  };

  const onPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  const renderSlide = ({
    item,
    index,
  }: {
    item: (typeof slides)[0];
    index: number;
  }) => (
    <View style={styles.slide}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        {/* Background blob */}
        <View style={styles.backgroundBlob} />
        <View style={styles.imageWrapper}>
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Animated.Text
          entering={FadeInUp.delay(200).duration(500)}
          style={styles.title}
        >
          {item.title}
        </Animated.Text>
        <Animated.Text
          entering={FadeInUp.delay(300).duration(500)}
          style={styles.description}
        >
          {item.description}
        </Animated.Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <Animated.View
        entering={FadeIn.delay(400).duration(500)}
        style={styles.skipContainer}
      >
        <Pressable onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </Animated.View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Page Indicators */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(500)}
          style={styles.pagination}
        >
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </Animated.View>

        {/* Next Button */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(500)}
          style={[styles.buttonContainer, buttonAnimatedStyle]}
        >
          <Pressable
            onPress={handleNext}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#1e293b" />
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8f7",
  },
  skipContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    right: 24,
    zIndex: 20,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 100 : 80,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backgroundBlob: {
    position: "absolute",
    top: "-10%",
    left: "-20%",
    width: "140%",
    height: "70%",
    backgroundColor: "rgba(71, 235, 153, 0.1)",
    borderRadius: 1000,
    ...Platform.select({
      ios: {
        shadowColor: "#47eb99",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 40,
      },
      android: {},
      web: {
        filter: "blur(40px)",
      },
    }),
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 4 / 5,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      },
    }),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 50 : 40,
    backgroundColor: "#f6f8f7",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    width: 32,
    backgroundColor: "#47eb99",
  },
  dotInactive: {
    width: 10,
    backgroundColor: "rgba(71, 235, 153, 0.2)",
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    width: "100%",
    height: 56,
    backgroundColor: "#47eb99",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#47eb99",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
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
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
});
