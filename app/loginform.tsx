import {
    View,
    Text,
    Pressable,
    StyleSheet,
    StatusBar,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Vibration,
    Alert,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function LoginForm() {
    const [inputValue, setInputValue] = useState("");
    const [password, setPassword] = useState("");

    const handlePress = async () => {
        if (inputValue && password) {
            try {
                const data = {
                    email: inputValue,
                    password: password,
                };

                const response = await axios.post(
                    "https://test.bukhara-best.uz/api/auth/login/",
                    data
                );

                await AsyncStorage.setItem("token", response.data.access);
                setTimeout(() => {
                    router.push("/(tabs)/home");
                }, 200);
            } catch (error) {
                Vibration.vibrate(100);
                Alert.alert("Error", "Something went wrong. Please try again.");
            }
        } else {
            Vibration.vibrate(100);
            Alert.alert("Error", "Incorrect passcode. Please try again.");
        }
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colors.dark.background }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <StatusBar barStyle="light-content" />
                    <View style={styles.main}>
                        <View>
                            <Text style={styles.text}>
                                Please enter your email address
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter email"
                                placeholderTextColor="#888"
                                value={inputValue}
                                onChangeText={setInputValue}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#888"
                                value={password}
                                onChangeText={setPassword}
                                keyboardType="number-pad"
                                autoCapitalize="none"
                            />
                            <View style={styles.registerContainer}>
                                <Text style={styles.registerText}>
                                    Don't have an account?{" "}
                                    <Text
                                        onPress={() =>
                                            router.push("/registerform")
                                        }
                                        style={styles.registerLink}
                                    >
                                        Register
                                    </Text>
                                </Text>
                            </View>
                        </View>

                        <Pressable style={styles.button} onPress={handlePress}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: Colors.light.background,
        justifyContent: "center",
        paddingTop: 100,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    main: {
        flex: 1,
        justifyContent: "space-between",
    },
    text: {
        fontSize: 24,
        color: "white",
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        color: "#fff",
        backgroundColor: "#222C3A",
    },
    button: {
        backgroundColor: "#378AC2",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    registerContainer: {
        marginTop: 20,
        alignItems: "center",
    },
    registerText: {
        color: "#ccc",
        fontSize: 14,
    },
    registerLink: {
        color: "#45AEF5",
        fontWeight: "bold",
    },
});
