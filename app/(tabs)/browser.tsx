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
} from "react-native";
import { Colors } from "@/constants/Colors";
// @ts-ignore
import Banner from "@/assets/images/banner.png";
// @ts-ignore
import Tonvpn from "@/assets/images/tonvpn.png";
// @ts-ignore
import Mobile from "@/assets/images/mobile.png";
// @ts-ignore
import Clickbit from "@/assets/images/clickbit.png";
// @ts-ignore
import Ticket from "@/assets/images/ticket.png";
// @ts-ignore
import EMCD from "@/assets/images/emcd.png";
// @ts-ignore
import Mercury from "@/assets/images/mercury.png";
// @ts-ignore
import Avanch from "@/assets/images/avanch.png";
// @ts-ignore
import Lets from "@/assets/images/lets.png";
// @ts-ignore
import First from "@/assets/images/first.png";
// @ts-ignore
import Second from "@/assets/images/second.png";
// @ts-ignore
import Third from "@/assets/images/third.png";
// @ts-ignore
import Fourth from "@/assets/images/fourth.png";

export default function ExploreScreen() {
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
                        source={Banner} // Replace with your actual banner path
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
                        { name: "Ton VPN", icon: Tonvpn },
                        { name: "Mobile", icon: Mobile },
                        { name: "Ticketz", icon: Ticket },
                    ].map((app, index) => (
                        <View key={index} style={styles.appItem}>
                            <Image source={app.icon} style={styles.appIcon} />
                            <Text style={styles.appLabel}>{app.name}</Text>
                        </View>
                    ))}
                </View>

                {/* Exchanges */}
                <Text style={styles.sectionTitle}>Exchanges</Text>
                <View style={styles.iconRow}>
                    {[
                        {
                            name: "Mercuryo",
                            icon: Mercury,
                        },
                        { name: "EMCD NOW", icon: EMCD },
                        {
                            name: "LetsExchange",
                            icon: Lets,
                        },
                        {
                            name: "Avanchange",
                            icon: Avanch,
                        },
                    ].map((app, index) => (
                        <View key={index} style={styles.appItem}>
                            <Image source={app.icon} style={styles.appIcon} />
                            <Text style={styles.appLabel}>{app.name}</Text>
                        </View>
                    ))}
                </View>

                {/* DeFi */}
                <Text style={styles.sectionTitle}>DeFi</Text>
                <View style={styles.iconRow}>
                    {[
                        { name: "App1", icon: First },
                        { name: "App2", icon: Second },
                        { name: "App3", icon: Third },
                        { name: "App4", icon: Fourth },
                    ].map((app, index) => (
                        <View key={index} style={styles.appItem}>
                            <Image source={app.icon} style={styles.appIcon} />
                            <Text style={styles.appLabel}>{app.name}</Text>
                        </View>
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
        paddingTop: 80,
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
