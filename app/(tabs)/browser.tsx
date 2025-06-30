import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    StatusBar,
    Linking, // Import Linking for URL navigation
} from "react-native";
import { Colors } from "@/constants/Colors";
// @ts-ignore
import Banner from "@/assets/images/banner.png";
// @ts-ignore
import Clickbit from "@/assets/images/clickbit.png";

export default function ExploreScreen() {
    const handleClickBitPress = () => {
        Linking.openURL(
            "https://t.me/clickbit_app_bot/clickbit?startapp=B2B7F2054E"
        ).catch((err) => console.error("Failed to open URL:", err));
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView>
                {/* Top Tabs */}
                <View style={styles.tabs}>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <TouchableOpacity style={styles.tabButtonActive}>
                            <Text style={styles.tabTextActive}>Explore</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tabButton}>
                            <Text style={styles.tabText}>Connected</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.tabButtonRight}>
                        <Text style={styles.tabText}>Cy</Text>
                    </TouchableOpacity>
                </View>

                {/* Banner */}
                <View style={styles.banner}>
                    <Image
                        source={Banner}
                        style={styles.bannerImage}
                        resizeMode="cover"
                    />
                </View>

                {/* ClickBit apps */}
                <View style={styles.iconRow}>
                    {[
                        {
                            name: "ClickBit",
                            icon: Clickbit,
                        },
                    ].map((app, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.appItem}
                            onPress={handleClickBitPress}
                        >
                            <Image source={app.icon} style={styles.appIcon} />
                            <Text style={styles.appLabel}>{app.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Search Input */}
                <View style={styles.searchBox}>
                    <TextInput
                        placeholder="search or enter address"
                        placeholderTextColor="#888"
                        style={styles.searchInput}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.dark.background,
        paddingTop: 40,
        paddingHorizontal: 16,
        flex: 1,
    },
    tabs: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    tabButton: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    tabButtonActive: {
        backgroundColor: "#293342",
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    tabButtonRight: {
        backgroundColor: "#293342",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    tabText: {
        color: "#FFFFFF",
        fontSize: 14,
    },
    tabTextActive: {
        color: "#FFFFFF",
        fontWeight: "bold",
    },
    banner: {
        height: 180,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 24,
    },
    bannerImage: {
        width: "100%",
        height: "100%",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#FFFFFF",
        marginTop: 24,
        marginBottom: 12,
    },
    iconRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    appItem: {
        alignItems: "center",
        width: 64,
    },
    appIcon: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginBottom: 6,
    },
    appLabel: {
        color: "#FFFFFF",
        fontSize: 12,
        textAlign: "center",
    },
    searchBox: {
        backgroundColor: "#293342",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginTop: 20,
    },
    searchInput: {
        color: "#FFFFFF",
        fontSize: 14,
    },
});
