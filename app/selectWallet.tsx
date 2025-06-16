import { View, Text, Pressable, StyleSheet, StatusBar } from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
// @ts-ignore
import WalletImage from "@/assets/images/logohome.png"; // @ belgisi project root
import { Image } from "react-native";
import React from "react";

import { Ionicons } from "@expo/vector-icons";

export default function SelectWallet() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Sign In button top-right */}
            {/* <View style={styles.topRight}>
                <Pressable style={{ flexDirection: "row", alignItems:"center"}} onPress={() => router.push("/loginform")}>
                    <Text style={styles.signInText}>Sign In </Text>
                    <Ionicons
                        name="chevron-forward-outline"
                        size={20}
                        color="#45AEF5"
                    />
                </Pressable>
            </View> */}

            <View style={styles.main}>
                <Image source={WalletImage} style={styles.image} />
                <Text style={styles.text}>
                    Create a new wallet or add an existing one
                </Text>

                <Pressable
                    onPress={() => router.push("/addWallet")}
                    style={styles.create}
                >
                    <Text style={styles.buttonText}>Create New Wallet</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push("/importWallet")}
                    style={styles.import}
                >
                    <Text style={styles.buttonText}>
                        Import Existing Wallet
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: "center",
        paddingVertical: 100,
        paddingHorizontal: 20,
    },
    main: {
        flex: 1,
        justifyContent: "flex-end",
    },
    text: {
        color: "white",
        textAlign: "center",
        fontSize: 14,
        marginBottom: 50,
    },
    create: {
        height: 50,
        backgroundColor: "#45AEF5",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    import: {
        height: 50,
        backgroundColor: "#222C3A",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 14,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 150,
        alignSelf: "center",
    },
    topRight: {
        position: "absolute",
        top: 80,
        right: 20,
        zIndex: 1,
        borderWidth: 2,
        borderColor: "#45AEF5",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius:10
    },
    signInText: {
        color: "#45AEF5",
        fontSize: 16,
        fontWeight: "bold",
    },
});
