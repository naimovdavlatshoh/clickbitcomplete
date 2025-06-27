import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    StatusBar,
    Platform,
    ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Backup() {
    const [modalVisible, setModalVisible] = useState(false);
    const [secondModalVisible, setSecondModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recoveryWords, setRecoveryWords] = useState([]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const insets = useSafeAreaInsets();

    const getMnemon = async () => {
        try {
            const value = await AsyncStorage.getItem("mnemonics");
            if (value) {
                const parsed = JSON.parse(value);
                setRecoveryWords(parsed);
            }
        } catch (error) {
            console.error("Error reading mnemonics from AsyncStorage:", error);
        }
    };

    useEffect(() => {
        getMnemon();
    }, []);

    const firstHalf = recoveryWords?.slice(0, 12);
    const secondHalf = recoveryWords?.slice(12, 24);

    const handleBackupPress = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleContinue = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setModalVisible(false);
            getMnemon();
            setSecondModalVisible(true);
        }, 2000);
    };

    const handleCloseSecondModal = () => {
        setSecondModalVisible(false);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={Colors.dark.background}
                translucent={true}
            />

            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    style={styles.backButton}
                    android_ripple={{
                        color: "rgba(255, 255, 255, 0.2)",
                        borderless: true,
                    }}
                >
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                </Pressable>
                <Text style={styles.headerTitle}>Backup</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.subtitle}>Manual</Text>
                <Text style={styles.description}>
                    Back up your wallet manually by writing down the recovery
                    phrase.
                </Text>

                <Pressable
                    onPress={handleBackupPress}
                    style={styles.createButton}
                    android_ripple={{ color: "rgba(255, 255, 255, 0.1)" }}
                >
                    <Text style={styles.createText}>Back Up Manually</Text>
                </Pressable>
            </View>

            {/* First Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
                statusBarTranslucent={true}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View
                        style={[
                            styles.modalOverlay,
                            {
                                paddingTop:
                                    Platform.OS === "android" ? insets.top : 0,
                            },
                        ]}
                    >
                        <View style={styles.modalContentFirst}>
                            <View style={styles.firstModalCloseBtnContainer}>
                                <Pressable
                                    onPress={handleCloseModal}
                                    style={styles.closeButtonContainer}
                                >
                                    <Text style={styles.firstModalCloseBtn}>
                                        ×
                                    </Text>
                                </Pressable>
                            </View>

                            <Text style={styles.firstModalTitle}>
                                Attention
                            </Text>
                            <Text style={styles.firstModalDescription}>
                                Back up your wallet manually by writing down the
                                recovery phrase.
                            </Text>

                            <View style={styles.firstModalInfoBox}>
                                <Text style={styles.firstModalPoint}>
                                    • Never enter your recovery phrase in any
                                    other place than ClickBit Wallet.
                                </Text>
                                <Text style={styles.firstModalPoint}>
                                    • ClickBit support never asks for a recovery
                                    phrase.
                                </Text>
                                <Text style={styles.firstModalPoint}>
                                    • Anybody with your recovery phrase can
                                    access your wallet.
                                </Text>
                            </View>

                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator
                                        size="large"
                                        color="#378AC2"
                                    />
                                    <Text style={styles.loadingText}>
                                        Processing...
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.buttonContainer}>
                                    <Pressable
                                        onPress={handleContinue}
                                        style={styles.firstModalContinueBtn}
                                        android_ripple={{
                                            color: "rgba(255, 255, 255, 0.2)",
                                        }}
                                    >
                                        <Text
                                            style={
                                                styles.firstModalContinueText
                                            }
                                        >
                                            Continue
                                        </Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={handleCloseModal}
                                        style={styles.firstModalCancelBtn}
                                        android_ripple={{
                                            color: "rgba(255, 255, 255, 0.1)",
                                        }}
                                    >
                                        <Text
                                            style={
                                                styles.firstModalContinueText
                                            }
                                        >
                                            Cancel
                                        </Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Second Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={secondModalVisible}
                onRequestClose={handleCloseSecondModal}
                statusBarTranslucent={true}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View
                        style={[
                            styles.modalOverlay,
                            {
                                paddingTop:
                                    Platform.OS === "android" ? insets.top : 0,
                            },
                        ]}
                    >
                        <View style={styles.modalContentSecond}>
                            <Text style={styles.secondModalTitle}>
                                Recovery phrase
                            </Text>
                            <Text style={styles.secondModalDescription}>
                                Back up your wallet manually by writing down the
                                recovery phrase.
                            </Text>

                            <ScrollView
                                style={styles.scrollContainer}
                                showsVerticalScrollIndicator={false}
                                bounces={false}
                            >
                                <View style={styles.recoveryPhraseContainer}>
                                    <View style={styles.recoveryColumn}>
                                        {firstHalf.map((word, index) => (
                                            <View
                                                key={index}
                                                style={styles.recoveryWordBox}
                                            >
                                                <Text
                                                    style={
                                                        styles.recoveryWordIndex
                                                    }
                                                >
                                                    {/* @ts-ignore */}
                                                    {word.id}.
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.recoveryWordText
                                                    }
                                                >
                                                    {/* @ts-ignore */}
                                                    {word.mnemonics}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                    <View style={styles.recoveryColumn}>
                                        {secondHalf.map((word, index) => (
                                            <View
                                                key={index + 12}
                                                style={styles.recoveryWordBox}
                                            >
                                                <Text
                                                    style={
                                                        styles.recoveryWordIndex
                                                    }
                                                >
                                                    {/* @ts-ignore */}
                                                    {word.id}.
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.recoveryWordText
                                                    }
                                                >
                                                    {/* @ts-ignore */}
                                                    {word.mnemonics}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </ScrollView>

                            <View>
                                <Pressable
                                    onPress={() => {
                                        setSecondModalVisible(false);
                                        router.push("/check");
                                    }}
                                    style={styles.secondModalContinueBtn}
                                    android_ripple={{
                                        color: "rgba(255, 255, 255, 0.2)",
                                    }}
                                >
                                    <Text
                                        style={styles.secondModalContinueText}
                                    >
                                        Check Backup
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
        paddingVertical: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 22,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    content: {
        flex: 1,
        paddingTop: 20,
    },
    subtitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    description: {
        color: "#ccc",
        fontSize: 14,
        marginBottom: 30,
        lineHeight: 20,
    },
    createButton: {
        backgroundColor: "#222C3A",
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30,
        ...Platform.select({
            android: {
                elevation: 2,
            },
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
        }),
    },
    createText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },

    // Shared Modal Overlay
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "flex-end",
        alignItems: "center",
    },

    // First Modal
    modalContentFirst: {
        width: "100%",
        backgroundColor: Colors.dark.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: "70%",
        minHeight: "50%",
    },
    firstModalCloseBtnContainer: {
        alignItems: "flex-end",
        marginBottom: 10,
    },
    closeButtonContainer: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    firstModalCloseBtn: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "600",
        lineHeight: 24,
    },
    firstModalTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    firstModalDescription: {
        color: "#ccc",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 20,
    },
    firstModalInfoBox: {
        backgroundColor: "#1D2633",
        borderRadius: 10,
        padding: 15,
        marginBottom: 30,
    },
    firstModalPoint: {
        color: "#ccc",
        fontSize: 14,
        marginBottom: 10,
        lineHeight: 20,
    },
    loadingContainer: {
        alignItems: "center",
        paddingVertical: 20,
    },
    loadingText: {
        color: "#fff",
        marginTop: 10,
        fontSize: 14,
    },
    buttonContainer: {
        gap: 10,
    },
    firstModalContinueBtn: {
        backgroundColor: "#378AC2",
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    firstModalCancelBtn: {
        backgroundColor: "#222C3A",
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    firstModalContinueText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },

    // Second Modal
    modalContentSecond: {
        width: "100%",
        backgroundColor: Colors.dark.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: "95%",
        minHeight: "100%",
    },
    secondModalHeader: {
        alignItems: "flex-end",
        marginBottom: 10,
    },
    secondModalCloseBtn: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "600",
        lineHeight: 24,
    },
    secondModalTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    secondModalDescription: {
        color: "#ccc",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 20,
    },
    scrollContainer: {
        flex: 1,
        marginBottom: 20,
    },
    recoveryPhraseContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        paddingHorizontal: 5,
    },
    recoveryColumn: {
        flex: 1,
    },
    recoveryWordBox: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
        paddingVertical: 8,
        paddingHorizontal: 8,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 8,
    },
    recoveryWordIndex: {
        color: "#378AC2",
        width: 28,
        fontWeight: "bold",
        fontSize: 12,
    },
    recoveryWordText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "500",
    },

    secondModalContinueBtn: {
        backgroundColor: "#378AC2",
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    secondModalContinueText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
});
