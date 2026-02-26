import * as ExpoSplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

// Keep native splash visible until we're ready
ExpoSplashScreen.preventAutoHideAsync();

interface Props {
    onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
    const hasHiddenSplash = useRef(false);

    // ── Tree part opacities (simple opacity animation works on all platforms) ──
    const groundOpacity = useSharedValue(0);
    const trunkOpacity = useSharedValue(0);
    const branchRightOpacity = useSharedValue(0);
    const branchLeftOpacity = useSharedValue(0);
    const leafTopOpacity = useSharedValue(0);
    const leafRightOpacity = useSharedValue(0);
    const leafLeftOpacity = useSharedValue(0);

    // ── Scale for "growing" effect ──
    const trunkScale = useSharedValue(0);
    const branchRightScale = useSharedValue(0);
    const branchLeftScale = useSharedValue(0);
    const leafTopScale = useSharedValue(0.3);
    const leafRightScale = useSharedValue(0.3);
    const leafLeftScale = useSharedValue(0.3);

    // ── UI ──
    const glowOpacity = useSharedValue(0.5);
    const dot1Y = useSharedValue(0);
    const dot2Y = useSharedValue(0);
    const titleOpacity = useSharedValue(0);
    const titleY = useSharedValue(20);

    useEffect(() => {
        // Hide native splash screen immediately when our component mounts
        const hideSplash = async () => {
            if (!hasHiddenSplash.current) {
                hasHiddenSplash.current = true;
                await ExpoSplashScreen.hideAsync();
            }
        };
        hideSplash();

        const ease = Easing.out(Easing.cubic);
        const growEase = Easing.out(Easing.back(1.5));

        // ① Ground arc fades in
        groundOpacity.value = withTiming(0.8, { duration: 400, easing: ease });

        // ② Trunk grows up (opacity + scaleY)
        trunkOpacity.value = withDelay(200, withTiming(1, { duration: 600, easing: ease }));
        trunkScale.value = withDelay(200, withTiming(1, { duration: 800, easing: growEase }));

        // ③ Branches grow outward
        branchRightOpacity.value = withDelay(700, withTiming(1, { duration: 400, easing: ease }));
        branchRightScale.value = withDelay(700, withTiming(1, { duration: 500, easing: growEase }));
        
        branchLeftOpacity.value = withDelay(850, withTiming(1, { duration: 400, easing: ease }));
        branchLeftScale.value = withDelay(850, withTiming(1, { duration: 500, easing: growEase }));

        // ④ Leaves bloom from branch tips
        leafTopOpacity.value = withDelay(1200, withTiming(1, { duration: 420, easing: ease }));
        leafTopScale.value = withDelay(1200, withTiming(1, { duration: 500, easing: growEase }));
        
        leafRightOpacity.value = withDelay(1400, withTiming(1, { duration: 420, easing: ease }));
        leafRightScale.value = withDelay(1400, withTiming(1, { duration: 500, easing: growEase }));
        
        leafLeftOpacity.value = withDelay(1600, withTiming(1, { duration: 420, easing: ease }));
        leafLeftScale.value = withDelay(1600, withTiming(1, { duration: 500, easing: growEase }));

        // ⑤ Title fades up
        titleOpacity.value = withDelay(1500, withTiming(1, { duration: 700, easing: ease }));
        titleY.value = withDelay(1500, withTiming(0, { duration: 700, easing: ease }));

        // ⑥ Glow pulse
        glowOpacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1200 }),
                withTiming(0.5, { duration: 1200 }),
            ), -1,
        );

        // ⑦ Floating dots
        dot1Y.value = withDelay(100, withRepeat(
            withSequence(withTiming(-7, { duration: 600 }), withTiming(0, { duration: 600 })), -1,
        ));
        dot2Y.value = withDelay(700, withRepeat(
            withSequence(withTiming(-7, { duration: 600 }), withTiming(0, { duration: 600 })), -1,
        ));

        // ⑧ Auto-dismiss
        if (onFinish) {
            const t = setTimeout(onFinish, 3500);
            return () => clearTimeout(t);
        }
    }, []);

    // ── Animated styles (using transform works reliably on Android) ──
    const groundStyle = useAnimatedStyle(() => ({
        opacity: groundOpacity.value,
    }));

    const trunkStyle = useAnimatedStyle(() => ({
        opacity: trunkOpacity.value,
        transform: [
            { scaleY: trunkScale.value },
            { translateY: (1 - trunkScale.value) * 40 }, // Grow from bottom
        ],
    }));

    const branchRightStyle = useAnimatedStyle(() => ({
        opacity: branchRightOpacity.value,
        transform: [
            { scale: branchRightScale.value },
        ],
    }));

    const branchLeftStyle = useAnimatedStyle(() => ({
        opacity: branchLeftOpacity.value,
        transform: [
            { scale: branchLeftScale.value },
        ],
    }));

    const leafTopStyle = useAnimatedStyle(() => ({
        opacity: leafTopOpacity.value,
        transform: [
            { scale: leafTopScale.value },
        ],
    }));

    const leafRightStyle = useAnimatedStyle(() => ({
        opacity: leafRightOpacity.value,
        transform: [
            { scale: leafRightScale.value },
        ],
    }));

    const leafLeftStyle = useAnimatedStyle(() => ({
        opacity: leafLeftOpacity.value,
        transform: [
            { scale: leafLeftScale.value },
        ],
    }));

    const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));
    const dot1Style = useAnimatedStyle(() => ({ transform: [{ translateY: dot1Y.value }] }));
    const dot2Style = useAnimatedStyle(() => ({ transform: [{ translateY: dot2Y.value }] }));
    const titleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ translateY: titleY.value }],
    }));

    return (
        <View style={styles.container}>
            {/* Gradient layers */}
            <View style={[StyleSheet.absoluteFill, styles.gradPink]} />
            <View style={[StyleSheet.absoluteFill, styles.gradPurple]} />
            <View style={[StyleSheet.absoluteFill, styles.gradIndigo]} />

            {/* ── Centre ── */}
            <View style={styles.centerContent}>
                <View style={styles.treeContainer}>

                    {/* Glow orb */}
                    <Animated.View style={[styles.glowOrb, glowStyle]} />

                    {/* Floating dots */}
                    <Animated.View style={[styles.dotYellow, dot1Style]} />
                    <Animated.View style={[styles.dotGreen, dot2Style]} />

                    {/* Tree SVG with separate animated groups */}
                    <View style={styles.svgContainer}>
                        {/* Ground arc */}
                        <Animated.View style={[styles.groundLayer, groundStyle]}>
                            <Svg width={192} height={192} viewBox="0 0 200 200">
                                <Path
                                    d="M70 160 C70 160 80 170 100 170 C120 170 130 160 130 160"
                                    stroke="#A67C52"
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            </Svg>
                        </Animated.View>

                        {/* Trunk */}
                        <Animated.View style={[styles.trunkLayer, trunkStyle]}>
                            <Svg width={192} height={192} viewBox="0 0 200 200">
                                <Path
                                    d="M100 160V80"
                                    stroke="#8B5E3C"
                                    strokeWidth={4}
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            </Svg>
                        </Animated.View>

                        {/* Right branch */}
                        <Animated.View style={[styles.branchRightLayer, branchRightStyle]}>
                            <Svg width={192} height={192} viewBox="0 0 200 200">
                                <Path
                                    d="M100 130C100 130 115 115 125 105"
                                    stroke="#8B5E3C"
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            </Svg>
                        </Animated.View>

                        {/* Left branch */}
                        <Animated.View style={[styles.branchLeftLayer, branchLeftStyle]}>
                            <Svg width={192} height={192} viewBox="0 0 200 200">
                                <Path
                                    d="M100 110C100 110 80 95 70 85"
                                    stroke="#8B5E3C"
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            </Svg>
                        </Animated.View>

                        {/* Top leaf */}
                        <Animated.View style={[styles.leafTopLayer, leafTopStyle]}>
                            <Svg width={192} height={192} viewBox="0 0 200 200">
                                <G>
                                    <Path d="M100 80 C100 80 80 60 100 40 C120 60 100 80 100 80Z" fill="#4ade80" />
                                    <Path d="M100 80 L100 60" stroke="#15803d" strokeLinecap="round" strokeWidth={1} opacity={0.5} />
                                </G>
                            </Svg>
                        </Animated.View>

                        {/* Right leaf */}
                        <Animated.View style={[styles.leafRightLayer, leafRightStyle]}>
                            <Svg width={192} height={192} viewBox="0 0 200 200">
                                <G>
                                    <Path d="M125 105 C125 105 145 95 150 75 C125 80 125 105 125 105Z" fill="#86efac" />
                                    <Path d="M125 105 C125 105 130 90 140 80" stroke="#16a34a" strokeLinecap="round" strokeWidth={1} opacity={0.3} />
                                </G>
                            </Svg>
                        </Animated.View>

                        {/* Left leaf */}
                        <Animated.View style={[styles.leafLeftLayer, leafLeftStyle]}>
                            <Svg width={192} height={192} viewBox="0 0 200 200">
                                <G>
                                    <Path d="M70 85 C70 85 50 75 45 55 C70 60 70 85 70 85Z" fill="#22c55e" />
                                    <Path d="M70 85 C70 85 65 70 55 60" stroke="#14532d" strokeLinecap="round" strokeWidth={1} opacity={0.3} />
                                </G>
                            </Svg>
                        </Animated.View>
                    </View>
                </View>

                {/* Title */}
                <Animated.View style={[titleStyle, { alignItems: 'center' }]}>
                    <Text style={styles.title}>Flora Chat</Text>
                    <Text style={styles.tagline}>GROWING CONNECTIONS</Text>
                </Animated.View>
            </View>

            {/* ── Bottom ── */}
            <View style={styles.bottomSection}>
                <ActivityIndicator size="small" color="#47eb99" />
                <Text style={styles.version}>V 2.5.0</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fdf2f8',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    gradPink: { backgroundColor: 'rgba(252,231,243,0.55)' },
    gradPurple: { backgroundColor: 'rgba(243,232,255,0.40)' },
    gradIndigo: { backgroundColor: 'rgba(224,231,255,0.30)' },

    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },

    treeContainer: {
        width: 320,
        height: 320,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },

    svgContainer: {
        width: 192,
        height: 192,
        position: 'relative',
    },

    // Each layer is absolutely positioned to stack the SVGs
    groundLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    trunkLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    branchRightLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    branchLeftLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    leafTopLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    leafRightLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    leafLeftLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
    },

    glowOrb: {
        position: 'absolute',
        width: 192,
        height: 192,
        borderRadius: 96,
        backgroundColor: 'rgba(255,255,255,0.65)',
        ...Platform.select({
            ios: {
                shadowColor: '#ffffff',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 40,
            },
            android: {
                elevation: 8,
            },
            default: {
                shadowColor: '#ffffff',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 40,
            },
        }),
    },

    dotYellow: {
        position: 'absolute',
        top: 44,
        right: 44,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(254,240,138,0.85)',
    },
    dotGreen: {
        position: 'absolute',
        bottom: 32,
        left: 44,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(187,247,208,0.85)',
    },

    title: {
        fontSize: 38,
        fontWeight: '800',
        color: '#1e293b',
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    tagline: {
        fontSize: 12,
        fontWeight: '500',
        color: '#94a3b8',
        letterSpacing: 4,
        marginTop: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
        opacity: 0.7,
    },

    bottomSection: {
        alignItems: 'center',
        paddingBottom: 64,
        gap: 10,
    },
    version: {
        fontSize: 10,
        fontWeight: '600',
        color: '#94a3b8',
        letterSpacing: 2,
    },
});
