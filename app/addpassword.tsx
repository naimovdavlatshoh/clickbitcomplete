import {
    View,
    Text,
    Pressable,
    StyleSheet,
    StatusBar,
    Vibration,
    Alert,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

export default function AddPassword() {
    const [pin, setPin] = useState<string>("");

    const handlePress = async (value: string) => {
        if (pin.length < 4) {
            const newPin = pin + value;
            setPin(newPin);

            if (newPin.length === 4) {
                try {
                    await AsyncStorage.setItem("userPin", newPin);
                    setTimeout(() => {
                        router.push("/repassword");
                    }, 200);
                } catch (err) {
                    Alert.alert("Storage Error", "Failed to save PIN.");
                }
            }
        }
    };

    const handleDelete = () => {
        if (pin.length > 0) {
            setPin(pin.slice(0, -1));
            Vibration.vibrate(10);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>x</Text>
                </Pressable>
                <Text style={styles.title}>Create Passcode</Text>
            </View>
            <Text style={styles.subtitle}>Create Passcode</Text>

            <View style={styles.pinContainer}>
                {[0, 1, 2, 3].map((i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            {
                                backgroundColor:
                                    i < pin.length ? "#fff" : "#2D343E",
                            },
                        ]}
                    />
                ))}
            </View>

            {/* Keypad */}
            <View style={styles.pad}>
                {[
                    ["1", "2", "3"],
                    ["4", "5", "6"],
                    ["7", "8", "9"],
                    ["", "0", "←"],
                ].map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((item, colIndex) => (
                            <Pressable
                                key={colIndex}
                                style={[
                                    styles.key,
                                    item === "" && {
                                        backgroundColor: "transparent",
                                    },
                                ]}
                                onPress={() => {
                                    if (item === "←") handleDelete();
                                    else if (item !== "") handlePress(item);
                                }}
                            >
                                <Text style={styles.keyText}>{item}</Text>
                            </Pressable>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
}

// styles ... (siz yozgancha qoldirdim)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        paddingVertical: 60,
        paddingHorizontal: 20,
        justifyContent: "space-between",
    },
    header: {
        alignItems: "center",
        marginBottom: 150,
        position: "relative",
        justifyContent: "center",
    },
    backButton: {
        position: "absolute",
        left: 0,
        top: 0,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    backButtonText: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "600",
    },
    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 12,
    },
    subtitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 30,
    },
    pinContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        marginBottom: 150,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 10,
        backgroundColor: "#fff",
    },
    pad: {
        justifyContent: "center",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        gap: 20,
        marginBottom: 20,
    },
    key: {
        width: 70,
        height: 70,
        marginHorizontal: 10,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
    },
    keyText: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "bold",
    },
});
