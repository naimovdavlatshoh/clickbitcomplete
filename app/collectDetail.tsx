import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    Pressable,
    StatusBar,
    SafeAreaView,
} from "react-native";
import {
    CameraView,
    useCameraPermissions,
    BarcodeScanningResult,
} from "expo-camera";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
// @ts-ignore
import Collectible1 from "@/assets/images/collectible1.png";

export default function CollectDetail() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.modalContainer}>
                <StatusBar barStyle="light-content" />
                <View style={styles.topBar}>
                    <Link href="../">
                        <Ionicons
                            name="chevron-down-outline"
                            size={24}
                            color="white"
                        />
                    </Link>
                    <Text style={styles.headerTitle}>Gift box #350841</Text>
                    <View style={styles.placeholder}></View>
                </View>
                <View style={styles.collectiblecontainer}>
                    <Image
                        source={Collectible1}
                        style={styles.collectibleImage}
                    />
                    <View style={styles.collectibleabout}>
                        <Text style={styles.collectibleTitle}>
                            Gift box #350841
                        </Text>
                        <Text style={styles.desc1}>Gems Winter Store</Text>
                        <Text style={styles.desc2}>
                            Happy New Year! May 2025 bring you inspiration, good
                            fortune, and countless joyful moments.
                        </Text>
                        <Text style={styles.collectibleTitle}>
                            About collection
                        </Text>

                        <Text style={styles.desc2}>
                            One cozy winter evening, nearly 20 of the brightest
                            Getgems authors gathered around a crackling More
                        </Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.transferbutton}>
                        <Link href="/sendModal">
                            <Text style={styles.buttonText}>Transfer</Text>
                        </Link>
                    </Pressable>
                    <Pressable style={styles.joinbutton}>
                        <Text style={styles.buttonText}>Join Pearls Drops</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        paddingHorizontal: 20,
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingTop: 8,
    },
    placeholder: {
        width: 44,
    },
    headerTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        letterSpacing: -0.4,
    },
    collectiblecontainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1D2633",
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    collectibleImage: {
        width: "100%",
        height: 200,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        marginBottom: 5,
    },
    collectibleabout: {
        width: "100%",
        paddingHorizontal: 20,
        paddingBottom: 20,
        marginTop: 10,
    },
    collectibleTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "600",
        textAlign: "left",
        alignSelf: "flex-start",
        marginBottom: 12,
        letterSpacing: -0.4,
    },
    desc1: {
        color: "#8994A3",
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
    },
    desc2: {
        color: "#8994A3",
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 20,
    },
    buttonContainer: {
        paddingBottom: 34, // iOS bottom safe area padding
    },
    transferbutton: {
        height: 50,
        backgroundColor: "#45AEF5",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#45AEF5",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: -0.2,
    },
    joinbutton: {
        height: 50,
        backgroundColor: "#39CC83",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#39CC83",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
