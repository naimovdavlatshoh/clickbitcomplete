import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import React from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CheckBackup() {
    const [words, setWords] = useState({ one: "", two: "", three: "" });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (key: string, value: string) => {
        setWords((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem("token");
            const walletid = await AsyncStorage.getItem("walletid");

            if (!token || !walletid) {
                throw new Error("Token yoki walletid topilmadi");
            }

            const answers = [
                // @ts-ignore
                { id: data[0]?.id, mnemonics: words.one.toLowerCase() },
                // @ts-ignore
                { id: data[1]?.id, mnemonics: words.two.toLowerCase() },
                // @ts-ignore
                { id: data[2]?.id, mnemonics: words.three.toLowerCase() },
            ];

            const response = await axios.post(
                `https://test.bukhara-best.uz/api/wallet/${walletid}/mnemonic/verify/`,
                { answers },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("✅ Success:", response.data);

            router.push("/(tabs)/home");
        } catch (error) {
            console.error("❌ POST xatolik:", error);

            // @ts-ignore
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const token = await AsyncStorage.getItem("token");
                const walletid = await AsyncStorage.getItem("walletid");

                if (!token) {
                    throw new Error("Token topilmadi");
                }

                const response = await axios.get(
                    `https://test.bukhara-best.uz/api/wallet/${walletid}/mnemonic/challenge/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setData(response.data.challenge);
                console.log(response.data.challenge);
            } catch (err: any) {
                console.error("Xatolik:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading)
        return (
            <Text
                style={{ color: "white", textAlign: "center", marginTop: 20 }}
            >
                Loading...
            </Text>
        );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                </Pressable>
            </View>

            {/* Title */}
            <Text style={styles.headerTitle}>Backup Check</Text>
            <View style={{ width: 28 }} />
            <Text style={styles.description}>
                Let’s see if you’ve got everything right. Enter words{" "}
                {data?.map((word: any) => (
                    <Text key={word?.id}>{word?.id}, </Text>
                ))}
            </Text>

            {/* Inputs */}
            <View style={styles.inputGroup}>
                {/* @ts-ignore */}
                <Text style={styles.label}>{data[0]?.id}.</Text>
                <TextInput
                    style={styles.input}
                    value={words.one}
                    onChangeText={(text) => handleChange("one", text)}
                />
            </View>

            <View style={styles.inputGroup}>
                {/* @ts-ignore */}
                <Text style={styles.label}>{data[1]?.id}.</Text>
                <TextInput
                    style={styles.input}
                    value={words.two}
                    onChangeText={(text) => handleChange("two", text)}
                />
            </View>

            <View style={styles.inputGroup}>
                {/* @ts-ignore */}
                <Text style={styles.label}>{data[2]?.id}.</Text>
                <TextInput
                    style={styles.input}
                    value={words.three}
                    onChangeText={(text) => handleChange("three", text)}
                />
            </View>

            {/* Submit Button */}
            <Pressable style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Continue</Text>
            </Pressable>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 40,
        marginBottom: 30,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    description: {
        color: "#ccc",
        fontSize: 14,
        marginBottom: 20,
        textAlign: "center",
    },
    inputGroup: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1D2633",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
    },
    label: {
        color: "#fff",
        fontWeight: "500",
        fontSize: 16,
        width: 30,
    },
    input: {
        flex: 1,
        color: "#fff",
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: "#378AC2",
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    submitText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
});
