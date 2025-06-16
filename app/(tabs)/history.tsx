import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Transaction {
    id: number;
    type: "Sent" | "Received";
    icon: "arrow-up" | "arrow-down";
    address: string;
    amount: string;
    amountColor: string;
    date: string;
}

export default function HistoryScreen() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Date formatting and validation function
    const formatDate = (dateValue: string) => {
        try {
            // Check if dateValue exists
            if (!dateValue) {
                return "Unknown date";
            }

            console.log("Received date value:", dateValue);

            // API format: "2025-05-31 07:54:58 UTC"
            // Convert to ISO format: "2025-05-31T07:54:58Z"
            let isoDateString = dateValue
                .replace(" ", "T")
                .replace(" UTC", "Z");
            console.log("Converted to ISO format:", isoDateString);

            // Create Date object
            const date = new Date(isoDateString);
            console.log("Date object:", date);

            // Check if date is valid
            if (isNaN(date.getTime())) {
                console.log("Date is invalid, trying alternative method");

                // Alternative method: manual parsing
                const parts = dateValue.match(
                    /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/
                );
                if (parts) {
                    const [, year, month, day, hour, minute, second] = parts;
                    const manualDate = new Date(
                        parseInt(year),
                        parseInt(month) - 1, // JavaScript months start from 0
                        parseInt(day),
                        parseInt(hour),
                        parseInt(minute),
                        parseInt(second)
                    );

                    if (!isNaN(manualDate.getTime())) {
                        return manualDate.toLocaleString("en-US", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        });
                    }
                }

                return "Invalid date";
            }

            // Return formatted date
            return date.toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true, // Add AM/PM format
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Date error";
        }
    };

    // Fetch transactions using useEffect
    useEffect(() => {
        const fetchTransactions = async () => {
            const walletId = await AsyncStorage.getItem("walletid");
            const token = await AsyncStorage.getItem("token");
            try {
                const response = await fetch(
                    `https://test.bukhara-best.uz/api/wallet/transaction/${walletId}/history/`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch transactions");
                }

                const data = await response.json();

                // Log API response for debugging
                console.log("API response:", data);

                
                const formattedTransactions =
                    data.transactions?.map((tx: any, index: number) => {
                        // Log each transaction data
                        console.log(`Transaction ${index + 1}:`, {
                            time: tx.time,
                            out_msgs: tx.out_msgs,
                            in_msg: tx.in_msg,
                        });

                        // Determine transaction type
                        const isSentTransaction =
                            tx.out_msgs && tx.out_msgs.length > 0;

                        // Get address
                        let address = "Unknown address";
                        if (isSentTransaction && tx.out_msgs[0]?.destination) {
                            address =
                                tx.out_msgs[0].destination.slice(0, 6) +
                                "..." +
                                tx.out_msgs[0].destination.slice(-6);
                        } else if (
                            !isSentTransaction &&
                            tx.in_msg?.source &&
                            tx.in_msg.source !== ""
                        ) {
                            address =
                                tx.in_msg.source.slice(0, 6) +
                                "..." +
                                tx.in_msg.source.slice(-6);
                        } else if (
                            !isSentTransaction &&
                            (!tx.in_msg?.source || tx.in_msg.source === "")
                        ) {
                            address = "System"; // Empty source means system transaction
                        }

                        // Get and format amount
                        let amount = "0 TON";
                        if (isSentTransaction && tx.out_msgs[0]?.value) {
                            // Sent - with minus sign
                            amount = `- ${tx.out_msgs[0].value}`;
                        } else if (!isSentTransaction && tx.in_msg?.value) {
                            // Received - with plus sign
                            amount = `+ ${tx.in_msg.value}`;
                        }

                        return {
                            id: index + 1,
                            type: isSentTransaction ? "Sent" : "Received",
                            icon: isSentTransaction ? "arrow-up" : "arrow-down",
                            address: address,
                            amount: amount,
                            amountColor: isSentTransaction
                                ? "#F44336"
                                : "#4CAF50",
                            date: formatDate(tx.time),
                        };
                    }) || [];

                setTransactions(formattedTransactions);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                // Set empty array on error
                setTransactions([]);
            }
        };

        fetchTransactions();
    }, []); // Empty dependency array to run once on mount

    return (
        <View style={styles.scrollContainer}>
            <StatusBar barStyle="light-content" />
            <ScrollView>
                <Text style={styles.title}>History</Text>

                {/* Filter buttons */}
                <View style={styles.filterContainer}>
                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterText}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterText}>Spam</Text>
                    </TouchableOpacity>
                </View>

                {/* Month label */}
                <Text style={styles.monthText}>May 2025</Text>

                {/* Transactions */}
                {transactions.length > 0 ? (
                    transactions.map((tx) => (
                        <View key={tx.id} style={styles.card}>
                            <View style={styles.iconWrapper}>
                                <Feather
                                    name={tx.icon}
                                    size={15}
                                    color="#FFFFFF"
                                />
                            </View>
                            <View style={styles.cardContent}>
                                <View>
                                    <Text style={styles.typeText}>
                                        {tx.type}
                                    </Text>
                                    <Text style={styles.addressText}>
                                        {tx.address}
                                    </Text>
                                </View>
                                <View style={styles.rightSection}>
                                    <Text
                                        style={[
                                            styles.amountText,
                                            { color: tx.amountColor },
                                        ]}
                                    >
                                        {tx.amount}
                                    </Text>
                                    <Text style={styles.dateText}>
                                        {tx.date}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No transactions found
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: Colors.dark.background,
        padding: 16,
        paddingTop: 100,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 16,
    },
    filterContainer: {
        flexDirection: "row",
        marginBottom: 30,
    },
    filterButton: {
        backgroundColor: "#1C1F26",
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    filterText: {
        color: "#FFFFFF",
        fontSize: 14,
    },
    monthText: {
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "600",
        marginBottom: 12,
    },
    card: {
        backgroundColor: "#1C1F26",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    iconWrapper: {
        width: 30,
        height: 30,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        borderColor: "#2F3847",
        borderWidth: 2,
    },
    cardContent: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    typeText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 15,
    },
    addressText: {
        color: "#AAAAAA",
        fontSize: 12,
        marginTop: 2,
    },
    rightSection: {
        alignItems: "flex-end",
    },
    amountText: {
        fontWeight: "600",
        fontSize: 15,
    },
    dateText: {
        color: "#AAAAAA",
        fontSize: 12,
        marginTop: 2,
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 50,
    },
    emptyText: {
        color: "#AAAAAA",
        fontSize: 16,
    },
});
