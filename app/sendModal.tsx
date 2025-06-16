import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Dimensions,
    Image,
    Modal,
    StatusBar,
    Clipboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Link, useRouter } from "expo-router"; // Import useRouter
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SendModal() {
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [comment, setComment] = useState("");
    const [tokenModalVisible, setTokenModalVisible] = useState(false);
    const [addressFocus, setAddressFocus] = useState(false);
    const [amountFocus, setAmountFocus] = useState(false);
    const [commentFocus, setCommentFocus] = useState(false);
    const [wallets, setWallets] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [selectedWalletName, setSelectedWalletName] = useState("TON");
    const [successMessage, setSuccessMessage] = useState(""); // New state for success message
    const [errorMessage, setErrorMessage] = useState(""); // New state for success message
    const router = useRouter(); // Initialize router for navigation

    // Fetch wallets from API when component mounts
    useEffect(() => {
        const fetchWallets = async () => {
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await fetch(
                    "https://test.bukhara-best.uz/api/wallet/all/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setWallets(data);
                if (data.length > 0) {
                    setSelectedWallet(data[0].id);
                    setSelectedWalletName(
                        data[0].currency || data[0].name || "TON"
                    );
                }
            } catch (error) {
                console.error("Error fetching wallets:", error);
            }
        };
        fetchWallets();
    }, []);

    // Handle Paste button functionality
    const handlePasteAddress = async () => {
        const clipboardContent = await Clipboard.getString();
        setAddress(clipboardContent);
    };

    // Handle Continue button functionality
    const handleContinue = async () => {
        if (address && amount) {
            const payload = {
                wallet_id: selectedWallet,
                recipient: address,
                amount: amount,
                comment: comment || "",
            };
            console.log("Payload:", payload);

            const token = await AsyncStorage.getItem("token");
            try {
                const response = await fetch(
                    "https://test.bukhara-best.uz/api/wallet/transaction/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(payload),
                    }
                );
                const result = await response.json();
                console.log("Response:", result);



                
                if (result.message) {
                    setSuccessMessage(result.message); // Set the success message
                    // Hide the message after 3 seconds and navigate to home
                    setTimeout(() => {
                        setSuccessMessage("");
                    }, 3000);
                } else {
                    setErrorMessage("Something went wrong please try again");

                    setTimeout(() => {
                        setErrorMessage(""); // Clear the message
                    }, 3000);
                }
            } catch (error) {
                console.error("Error sending data:", error);
            }
        } else {
            console.log("Please fill in both address and amount.");
        }
    };

    return (
        <View style={styles.modalContainer}>
            <StatusBar barStyle="light-content" />
            <View style={styles.topBar}>
                <View style={styles.leftSpace} />
                <Pressable style={styles.walletHeader}>
                    <Text style={styles.walletText}>Send</Text>
                </Pressable>
                <Link href="../" style={styles.settingsIcon}>
                    <Ionicons name="close-outline" size={24} color="white" />
                </Link>
            </View>

            {/* Address input */}
            <View
                style={[
                    styles.inputWrapper,
                    addressFocus && styles.inputFocused,
                ]}
            >
                <TextInput
                    style={styles.inputWithIcons}
                    placeholder="Address or name"
                    placeholderTextColor="#888"
                    value={address}
                    onChangeText={setAddress}
                    onFocus={() => setAddressFocus(true)}
                    onBlur={() => setAddressFocus(false)}
                />
                <Pressable
                    style={styles.pasteButton}
                    onPress={handlePasteAddress}
                >
                    <Text style={styles.pasteText}>Paste</Text>
                </Pressable>
                <Link href={"/scanSend"} style={styles.rightIcon}>
                    <Ionicons name="scan-outline" size={20} color="#888" />
                </Link>
            </View>

            {/* Amount + Wallet Selector */}
            <View
                style={[
                    styles.inputWrapper,
                    amountFocus && styles.inputFocused,
                    { paddingHorizontal: 0 },
                ]}
            >
                <TextInput
                    style={styles.inputAmountWithToken}
                    placeholder="Amount"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    onFocus={() => setAmountFocus(true)}
                    onBlur={() => setAmountFocus(false)}
                />
                <TouchableOpacity
                    style={styles.tokenBox}
                    onPress={() => setTokenModalVisible(true)}
                >
                    <Image
                        source={require("../assets/images/ton.png")}
                        style={{ width: 20, height: 20, marginRight: 10 }}
                    />
                    <Text style={styles.tokenText}>{selectedWalletName}</Text>
                    <Ionicons
                        name="chevron-down"
                        size={16}
                        color="white"
                        style={{ marginLeft: 4 }}
                    />
                </TouchableOpacity>
            </View>

            {/* Wallet Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={tokenModalVisible}
                onRequestClose={() => setTokenModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.tokenModal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Wallet</Text>
                            <TouchableOpacity
                                onPress={() => setTokenModalVisible(false)}
                            >
                                <Ionicons
                                    name="close-outline"
                                    size={20}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>

                        {wallets?.map((wallet) => (
                            <TouchableOpacity
                                key={wallet.id}
                                onPress={() => {
                                    setSelectedWallet(wallet.id);
                                    setSelectedWalletName(
                                        wallet.currency || wallet.name || "TON"
                                    );
                                    setTokenModalVisible(false);
                                }}
                                style={styles.modalToken}
                            >
                                <Image
                                    source={require("../assets/images/ton.png")}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        marginRight: 10,
                                    }}
                                />
                                <Text style={{ color: "white" }}>
                                    {wallet.currency || wallet.name || "TON"}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

            {/* Remaining and MAX */}
            <View style={styles.remainingRow}>
                <Text style={styles.remainingText}>
                    Remaining 0 {selectedWalletName}
                </Text>
                <TouchableOpacity>
                    <Text style={styles.maxText}>MAX</Text>
                </TouchableOpacity>
            </View>

            {/* Comment Input */}
            <View
                style={[
                    styles.inputWrapper,
                    commentFocus && styles.inputFocused,
                ]}
            >
                <TextInput
                    style={styles.inputWithIcons}
                    placeholder="Comment (optional)"
                    placeholderTextColor="#888"
                    value={comment}
                    onChangeText={setComment}
                    onFocus={() => setCommentFocus(true)}
                    onBlur={() => setCommentFocus(false)}
                />
                <Pressable style={styles.pasteButton}>
                    <Text style={styles.pasteText}>Paste</Text>
                </Pressable>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
                style={[
                    styles.continueButton,
                    !(address && amount) && styles.continueButtonDisabled,
                ]}
                onPress={handleContinue}
                disabled={!(address && amount)}
            >
                <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>

            {/* Success Message */}
            {successMessage ? (
                <View style={styles.successMessage}>
                    <Text style={styles.successText}>{successMessage}</Text>
                </View>
            ) : null}
            {errorMessage ? (
                <View style={styles.errorMessage}>
                    <Text style={styles.successText}>{errorMessage}</Text>
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: Colors.dark.background,
        padding: 20,
        height: Dimensions.get("window").height * 0.93,
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    leftSpace: {
        width: 24,
    },
    walletHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 10,
    },
    walletText: {
        color: "white",
        fontSize: 22,
        marginHorizontal: 5,
        fontWeight: "600",
    },
    settingsIcon: {
        padding: 8,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1D2633",
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    inputWithIcons: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 10,
        color: "white",
    },
    inputAmountWithToken: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 12,
        color: "white",
    },
    inputFocused: {
        borderWidth: 1,
        borderColor: "#45AEF5",
    },
    pasteButton: {
        backgroundColor: "#2E3847",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        color: "white",
    },
    pasteText: {
        color: "white",
        fontWeight: "500",
        fontSize: 12,
    },
    rightIcon: {
        marginLeft: 10,
        color: "#45AEF5",
    },
    tokenBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2E3847",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    tokenText: {
        color: "white",
        fontWeight: "600",
    },
    remainingRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginBottom: 15,
    },
    remainingText: {
        color: "#8994A3",
    },
    maxText: {
        color: "#45AEF5",
        fontWeight: "500",
    },
    continueButton: {
        backgroundColor: "#378AC2",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    continueButtonDisabled: {
        backgroundColor: "#2E3847",
        opacity: 0.6,
    },
    continueText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    tokenModal: {
        backgroundColor: "#1D2633",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "white",
        marginBottom: 15,
    },
    modalToken: {
        backgroundColor: "#2E3847",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    successMessage: {
        backgroundColor: "#378AC2", // Blue background for success message
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
        position: "absolute",
        bottom: 50,
        left: 20,
        right: 20,
    },
    errorMessage: {
        backgroundColor: "red", // Blue background for success message
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
        position: "absolute",
        bottom: 50,
        left: 20,
        right: 20,
    },
    successText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },
});
