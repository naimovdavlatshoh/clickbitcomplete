import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";

interface SwapModalProps {
    onClose: () => void;
}

const SwapModal: React.FC<SwapModalProps> = ({ onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState<string>("0");
    const [walletAddress, setWalletAddress] = useState<string>("");

    // Backend API URL - replace with your actual backend URL
    const API_URL = "http://localhost:3000"; // Change this to your backend URL

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await fetch(`${API_URL}/balance`);
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

    const swapUsdtToTon = async (amount: string = "0.001") => {
        setIsLoading(true);
        try {
            console.log("Swapping amount:", amount); // Add this log
            const response = await fetch(`${API_URL}/swap`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: "0.001" }), // Explicitly set to 0.001
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Swap completed successfully!");
                setBalance(data.newBalance);
            } else {
                Alert.alert("Error", data.error || "Swap failed");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to connect to server");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Swap USDT to TON</Text>

                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceLabel}>Your Balance:</Text>
                    <Text style={styles.balanceValue}>{balance} TON</Text>
                </View>

                <View style={styles.addressContainer}>
                    <Text style={styles.addressLabel}>Wallet Address:</Text>
                    <Text
                        style={styles.addressValue}
                        numberOfLines={1}
                        ellipsizeMode="middle"
                    >
                        {walletAddress}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.swapButton}
                    onPress={() => swapUsdtToTon("0.001")}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.swapButtonText}>
                            Swap 0.001 USDT to TON
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        width: "90%",
        maxWidth: 400,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    balanceContainer: {
        marginBottom: 15,
    },
    balanceLabel: {
        fontSize: 16,
        color: "#666",
    },
    balanceValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    addressContainer: {
        marginBottom: 20,
    },
    addressLabel: {
        fontSize: 16,
        color: "#666",
    },
    addressValue: {
        fontSize: 14,
        color: "#000",
    },
    swapButton: {
        backgroundColor: "#0088CC",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    swapButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    closeButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#0088CC",
    },
    closeButtonText: {
        color: "#0088CC",
        fontSize: 16,
    },
});

export default SwapModal;
