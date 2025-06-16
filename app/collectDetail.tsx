import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    Pressable,
    StatusBar,
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
                <Text style={{ color: "white", fontSize: 20, fontWeight: 700 }}>
                    Gift box #350841
                </Text>
                <View style={{ width: 30 }}></View>
            </View>
            <View style={styles.collectiblecontainer}>
                <Image
                    source={Collectible1}
                    style={{
                        marginBottom: 5,
                        borderTopLeftRadius: 10,
                        width: "100%",
                        borderTopRightRadius: 10,
                        height: 300,
                    }}
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
            <Pressable style={styles.transferbutton}>
              <Link href="/sendModal">
                  <Text style={styles.buttonText}>Transfer</Text>
              </Link>

            </Pressable>
            <Pressable style={styles.joinbutton}>
                <Text style={styles.buttonText}>Join Pearls Drops</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: Colors.dark.background,
        height: Dimensions.get("window").height * 0.93,
        paddingHorizontal: 20,
    },
    container: {
        padding: 20,
        flex: 1,
        position: "relative",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingVertical: 20,
    },
    collectiblecontainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1D2633",
        borderRadius: 10,
        marginBottom: 20,
    },
    collectibleabout: {
        width: "100%", // to ensure full width
        paddingHorizontal: 20,
        marginTop: 10,
    },

    collectibleTitle: {
        color: "white",
        fontSize: 20,
        textAlign: "left",
        alignSelf: "flex-start",
        marginBottom: 10, // ensures left alignment inside the parent
    },
    desc1: {
        color: "#8994A3",
        marginBottom: 5,
    },
    desc2: {
        color: "#8994A3",
        marginBottom: 20,
    },
    transferbutton: {
        height: 50,
        backgroundColor: "#45AEF5",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "white",
        fontSize: 14,
    },
    joinbutton: {
        height: 50,
        backgroundColor: "#39CC83",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
});
