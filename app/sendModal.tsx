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
    Platform,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

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
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

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
                    setSuccessMessage(result.message);
                    setTimeout(() => {
                        setSuccessMessage("");
                    }, 3000);
                } else {
                    setErrorMessage("Something went wrong please try again");
                    setTimeout(() => {
                        setErrorMessage("");
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
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={Colors.dark.background}
                translucent={false}
            />
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.modalContainer}>
                        {/* Top Bar */}
                        <View style={styles.topBar}>
                            <View style={styles.leftSpace} />
                            <View style={styles.walletHeader}>
                                <Text style={styles.walletText}>Send</Text>
                            </View>
                            <Link href="../" style={styles.settingsIcon}>
                                <Ionicons
                                    name="close-outline"
                                    size={24}
                                    color="white"
                                />
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
                                <Ionicons
                                    name="scan-outline"
                                    size={20}
                                    color="#888"
                                />
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
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={require("../assets/images/ton.png")}
                                    style={styles.tokenImage}
                                />
                                <Text style={styles.tokenText}>
                                    {selectedWalletName}
                                </Text>
                                <Ionicons
                                    name="chevron-down"
                                    size={16}
                                    color="white"
                                    style={styles.chevronIcon}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Wallet Selection Modal */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={tokenModalVisible}
                            onRequestClose={() => setTokenModalVisible(false)}
                            statusBarTranslucent={true}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.tokenModal}>
                                    <View style={styles.modalHeader}>
                                        <Text style={styles.modalTitle}>
                                            Select Wallet
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() =>
                                                setTokenModalVisible(false)
                                            }
                                            style={styles.closeButton}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name="close-outline"
                                                size={24}
                                                color="white"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.walletList}>
                                        {wallets?.map((wallet) => (
                                            <TouchableOpacity
                                                // @ts-ignore
                                                key={wallet.id}
                                                onPress={() => {
                                                    {
                                                        /* @ts-ignore */
                                                    }
                                                    setSelectedWallet(
                                                        // @ts-ignore
                                                        wallet.id
                                                    );
                                                    {
                                                        /* @ts-ignore */
                                                    }
                                                    setSelectedWalletName(
                                                        // @ts-ignore
                                                        wallet.currency ||
                                                            // @ts-ignore
                                                            wallet.name ||
                                                            "TON"
                                                    );
                                                    setTokenModalVisible(false);
                                                }}
                                                style={styles.modalToken}
                                                activeOpacity={0.7}
                                            >
                                                <Image
                                                    source={require("../assets/images/ton.png")}
                                                    style={styles.tokenImage}
                                                />
                                                <Text
                                                    style={
                                                        styles.modalTokenText
                                                    }
                                                >
                                                    {/* @ts-ignore */}
                                                    {wallet.currency ||
                                                        // @ts-ignore
                                                        wallet.name ||
                                                        "TON"}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        {/* Remaining and MAX */}
                        <View style={styles.remainingRow}>
                            <Text style={styles.remainingText}>
                                Remaining 0 {selectedWalletName}
                            </Text>
                            <TouchableOpacity activeOpacity={0.7}>
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
                                !(address && amount) &&
                                    styles.continueButtonDisabled,
                            ]}
                            onPress={handleContinue}
                            disabled={!(address && amount)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.continueText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Success/Error Messages */}
            {(successMessage || errorMessage) && (
                <View style={styles.messageContainer}>
                    <View
                        style={[
                            styles.messageBox,
                            successMessage
                                ? styles.successMessage
                                : styles.errorMessage,
                        ]}
                    >
                        <Text style={styles.messageText}>
                            {successMessage || errorMessage}
                        </Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        paddingHorizontal: 20,
        paddingTop:
            // @ts-ignore
            Platform.OS === "android" ? StatusBar.currentHeight + 10 : 10,
        paddingBottom: 20,
        minHeight:
            height -
            (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0),
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
        paddingVertical: 10,
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
        textAlign: "center",
    },
    settingsIcon: {
        padding: 8,
        borderRadius: 20,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1D2633",
        borderRadius: 12,
        marginBottom: 15,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === "android" ? 4 : 6,
        minHeight: Platform.OS === "android" ? 56 : 50,
    },
    inputWithIcons: {
        flex: 1,
        paddingVertical: Platform.OS === "android" ? 16 : 14,
        paddingHorizontal: 10,
        color: "white",
        fontSize: 16,
        textAlignVertical: Platform.OS === "android" ? "center" : "auto",
    },
    inputAmountWithToken: {
        flex: 1,
        paddingVertical: Platform.OS === "android" ? 16 : 14,
        paddingHorizontal: 12,
        color: "white",
        fontSize: 16,
        textAlignVertical: Platform.OS === "android" ? "center" : "auto",
    },
    inputFocused: {
        borderWidth: 2,
        borderColor: "#45AEF5",
    },
    pasteButton: {
        backgroundColor: "#2E3847",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
        minHeight: 36,
    },
    pasteText: {
        color: "white",
        fontWeight: "500",
        fontSize: 12,
    },
    rightIcon: {
        marginLeft: 8,
        padding: 4,
        borderRadius: 20,
    },
    tokenBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2E3847",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
        minHeight: 40,
    },
    tokenImage: {
        width: 20,
        height: 20,
        marginRight: 8,
        resizeMode: "contain",
    },
    tokenText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
    },
    chevronIcon: {
        marginLeft: 4,
    },
    remainingRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 15,
        marginBottom: 15,
        paddingHorizontal: 5,
    },
    remainingText: {
        color: "#8994A3",
        fontSize: 14,
    },
    maxText: {
        color: "#45AEF5",
        fontWeight: "600",
        fontSize: 14,
    },
    continueButton: {
        backgroundColor: "#378AC2",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
        minHeight: 50,
        justifyContent: "center",
    },
    continueButtonDisabled: {
        backgroundColor: "#2E3847",
        opacity: 0.6,
    },
    continueText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    tokenModal: {
        backgroundColor: "#1D2633",
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === "android" ? 30 : 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: height * 0.6,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "white",
    },
    closeButton: {
        padding: 4,
        borderRadius: 20,
    },
    walletList: {
        maxHeight: height * 0.4,
    },
    modalToken: {
        backgroundColor: "#2E3847",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        minHeight: 52,
    },
    modalTokenText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
    messageContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === "android" ? 30 : 40,
        zIndex: 1000,
    },
    messageBox: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: "center",
        elevation: Platform.OS === "android" ? 5 : 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    successMessage: {
        backgroundColor: "#378AC2",
    },
    errorMessage: {
        backgroundColor: "#E74C3C",
    },
    messageText: {
        color: "white",
        fontWeight: "600",
        fontSize: 14,
        textAlign: "center",
    },
});
