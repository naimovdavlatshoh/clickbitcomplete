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
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface DataState {
    ton_balance: string;
    non_bounceable_address: string;
    qr_code?: string; // Backenddan rasm URL yoki base64 sifatida keladi
}

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
        <View style={styles.modalContainer}>
            <StatusBar barStyle="light-content" />
            <Link href="../" style={styles.settingsIcon}>
                <Ionicons name="chevron-back-outline" size={24} color="white" />
            </Link>
            <View style={styles.container}>
                <Text style={styles.headerTitle}>Receive Toncoin</Text>
                <Text style={styles.headerDesc}>
                    Send only Toncoin TON and tokens in TON network to this
                    address, or you might lose your funds
                </Text>
            
                <View style={styles.qrcontainer}>
                    {data?.qr_code ? (
                        <Image
                            source={{ uri: data?.qr_code }} // Backenddan kelgan rasm URL yoki base64
                            style={{
                                width: 300,
                                height: 300,
                                resizeMode: "contain",
                                marginBottom: 20,
                            }}
                        />
                    ) : (
                        <Text style={styles.cardText}>Loading QR Code...</Text>
                    )}
                    <Text style={styles.cardText}>
                        {data?.non_bounceable_address}
                    </Text>
                </View>
                <View style={styles.actionbtns}>
                    <Pressable style={styles.actionbtn} onPress={handleCopy}>
                        <Ionicons
                            name="copy-outline"
                            size={18}
                            color="#AFAFAF"
                        />
                        <Text style={styles.actionbtnText}>
                            {copied ? "Copied" : "Copy"}
                        </Text>
                    </Pressable>
                    <Pressable style={styles.actionbtn} onPress={handleShare}>
                        <Ionicons
                            name="share-outline"
                            size={18}
                            color="#AFAFAF"
                        />
                        <Text style={styles.actionbtnText}>Share</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: Colors.dark.background,
        padding: 20,
        height: Dimensions.get("window").height * 0.93,
    },
    settingsIcon: {
        marginBottom: 20,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    headerDesc: {
        color: "#ccc",
        fontSize: 14,
        marginBottom: 20,
        textAlign: "center",
    },
    qrcontainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    cardText: {
        fontSize: 14,
        textAlign: "center",
    },
    actionbtns: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        marginTop: 20,
    },
    actionbtn: {
        backgroundColor: "#1A2533",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    actionbtnText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 4,
    },
});