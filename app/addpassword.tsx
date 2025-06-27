import {
    View,
    Text,
    Pressable,
    StyleSheet,
    StatusBar,
    Vibration,
    Alert,
    Platform,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddPassword() {
    const [pin, setPin] = useState<string>("");
    const insets = useSafeAreaInsets();

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
        <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={Colors.light.background}
                translucent={true}
            />

            {/* Header */}

            {/* Content */}
            <View style={styles.content}>
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
                                    android_ripple={{
                                        color: "rgba(255, 255, 255, 0.2)",
                                        borderless: true,
                                    }}
                                >
                                    <Text style={styles.keyText}>{item}</Text>
                                </Pressable>
                            ))}
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        paddingHorizontal: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
        position: "relative",
        justifyContent: "center",
        paddingVertical: 20,
    },
    backButton: {
        position: "absolute",
        left: 0,
        top: 20,
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 22,
    },
    backButtonText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "600",
        lineHeight: 24,
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 20,
    },
    content: {
        flex: 1,
        justifyContent: "space-between",
        paddingBottom: 50,
    },
    subtitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 40,
    },
    pinContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 16,
        marginBottom: 60,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#2D343E",
    },
    pad: {
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20,
    },
    row: {
        flexDirection: "row",
        gap: 25,
        marginBottom: 20,
        justifyContent: "center",
    },
    key: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        justifyContent: "center",
        alignItems: "center",

        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
        }),
    },
    keyText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "600",
        textAlign: "center",
    },
});
