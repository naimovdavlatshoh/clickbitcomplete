import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    Image,
    Share,
    Clipboard,
    Alert,
    StatusBar,
    Platform,
    SafeAreaView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface DataState {
    ton_balance: string;
    non_bounceable_address: string;
    qr_code?: string;
}

const { width, height } = Dimensions.get("window");

export default function Show() {
    const [copied, setCopied] = useState(false);
    const [data, setData] = useState<DataState>();
    const [sharedata, setSharedata] = useState("");

    const handleCopy = () => {
        Clipboard.setString(data?.non_bounceable_address || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: sharedata,
            });
        } catch (error) {
            Alert.alert("Error", "Failed to share address");
        }
    };

    useEffect(() => {
        const getData = async () => {
            const id = await AsyncStorage.getItem("walletid");
            const token = await AsyncStorage.getItem("token");

            try {
                const response = await axios.get(
                    `https://test.bukhara-best.uz/api/wallet/${id}/detaile/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setData(response.data[0]);
                console.log(response.data[0]);
                setSharedata(response.data[0].non_bounceable_address);
            } catch (error) {
                console.error("Error fetching wallet details:", error);
            }
        };

        getData();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.modalContainer}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={Colors.dark.background}
                    translucent={false}
                />

                <View style={styles.header}>
                    <Link href="../" style={styles.backButton}>
                        <Ionicons
                            name="chevron-back-outline"
                            size={24}
                            color="white"
                        />
                    </Link>
                </View>

                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.headerTitle}>Receive Toncoin</Text>
                        <Text style={styles.headerDesc}>
                            Send only Toncoin TON and tokens in TON network to
                            this address, or you might lose your funds
                        </Text>
                    </View>

                    <View style={styles.qrSection}>
                        <View style={styles.qrContainer}>
                            {data?.qr_code ? (
                                <Image
                                    source={{ uri: data?.qr_code }}
                                    style={styles.qrImage}
                                />
                            ) : (
                                <View style={styles.qrPlaceholder}>
                                    <Text style={styles.loadingText}>
                                        Loading QR Code...
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.addressContainer}>
                            <Text style={styles.addressText} numberOfLines={3}>
                                {data?.non_bounceable_address ||
                                    "Loading address..."}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.actionContainer}>
                        <Pressable
                            // @ts-ignore
                            style={[styles.actionBtn, styles.copyBtn]}
                            onPress={handleCopy}
                            android_ripple={{ color: "rgba(255,255,255,0.1)" }}
                        >
                            <Ionicons
                                name="copy-outline"
                                size={18}
                                color="#AFAFAF"
                            />
                            <Text style={styles.actionBtnText}>
                                {copied ? "Copied" : "Copy"}
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[styles.actionBtn, styles.shareBtn]}
                            onPress={handleShare}
                            android_ripple={{ color: "rgba(255,255,255,0.1)" }}
                        >
                            <Ionicons
                                name="share-outline"
                                size={18}
                                color="#AFAFAF"
                            />
                            <Text style={styles.actionBtnText}>Share</Text>
                        </Pressable>
                    </View>
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
        paddingBottom:30
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === "android" ? 40 : 20,
        paddingBottom: 10,
    },
    backButton: {
        alignSelf: "flex-start",
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "space-between",
    },
    titleContainer: {
        marginTop: 20,
        marginBottom: 30,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
        letterSpacing: 0.5,
    },
    headerDesc: {
        color: "#AFAFAF",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    qrSection: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
    },
    qrContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        marginBottom: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    qrImage: {
        width: width * 0.65,
        height: width * 0.65,
        maxWidth: 280,
        maxHeight: 280,
        resizeMode: "contain",
    },
    qrPlaceholder: {
        width: width * 0.65,
        height: width * 0.65,
        maxWidth: 280,
        maxHeight: 280,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
    },
    loadingText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    addressContainer: {
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },
    addressText: {
        fontSize: 13,
        color: "#fff",
        textAlign: "center",
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
        lineHeight: 18,
    },
    actionContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 15,
        paddingBottom: Platform.OS === "android" ? 30 : 20,
        paddingHorizontal: 20,
    },
    actionBtn: {
        backgroundColor: "#1A2533",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 25,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },

    shareBtn: {
        backgroundColor: "#1A2533",
    },
    actionBtnText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 6,
    },
});
