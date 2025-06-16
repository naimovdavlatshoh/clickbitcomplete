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
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Backup() {
    const [modalVisible, setModalVisible] = useState(false);
    const [secondModalVisible, setSecondModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recoveryWords, setRecoveryWords] = useState([]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getMnemon = async () => {
        try {
            const value = await AsyncStorage.getItem("mnemonics");
            // console.log(JSON.parse(value));
            if (value) {
                const parsed = JSON.parse(value);
                setRecoveryWords(parsed);
            }

            // if (value !== null) {
            //     const parsed = JSON.parse(value);
            //     // @ts-ignore
            //     setRecoveryWords(parsed);
            //     console.log(parsed);
            // } else {
            //     console.log("mnemonics not found in AsyncStorage");
            // }
        } catch (error) {
            console.error("Error reading mnemonics from AsyncStorage:", error);
        }
    };

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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                </Pressable>
                <Text style={styles.headerTitle}>Backup</Text>
                <View style={{ width: 28 }} />
            </View>

            <Text style={styles.subtitle}>Manual</Text>
            <Text style={styles.description}>
                Back up your wallet manually by writing down the recovery
                phrase.
            </Text>

            <Pressable onPress={handleBackupPress} style={styles.createButton}>
                <Text style={styles.createText}>Back Up Manually</Text>
            </Pressable>

            {/* First Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContentFirst}>
                            <View style={styles.firstModalCloseBtnContainer}>
                                <Pressable onPress={handleCloseModal}>
                                    <Text style={styles.firstModalCloseBtn}>
                                        x
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
                                <ActivityIndicator size="large" color="#fff" />
                            ) : (
                                <>
                                    <Pressable
                                        onPress={handleContinue}
                                        style={styles.firstModalContinueBtn}
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
                                    >
                                        <Text
                                            style={
                                                styles.firstModalContinueText
                                            }
                                        >
                                            Cancel
                                        </Text>
                                    </Pressable>
                                </>
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
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContentSecond}>
                            <View>
                                <Pressable onPress={handleCloseSecondModal}>
                                    <Text style={styles.secondModalCloseBtn}>
                                        x
                                    </Text>
                                </Pressable>
                            </View>
                            <Text style={styles.secondModalTitle}>
                                Recovery phrase
                            </Text>
                            <Text style={styles.secondModalDescription}>
                                Back up your wallet manually by writing down the
                                recovery phrase.
                            </Text>
                            <View style={styles.recoveryPhraseContainer}>
                                <View style={styles.recoveryColumn}>
                                    {firstHalf.map((word, index) => (
                                        <View
                                            key={index}
                                            style={styles.recoveryWordBox}
                                        >
                                            <Text
                                                style={styles.recoveryWordIndex}
                                            >
                                                {/* @ts-ignore */}
                                                {word.id}.
                                            </Text>
                                            <Text
                                                style={styles.recoveryWordText}
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
                                                style={styles.recoveryWordIndex}
                                            >
                                                {/* @ts-ignore */}
                                                {word.id}.
                                            </Text>
                                            <Text
                                                style={styles.recoveryWordText}
                                            >
                                                {/* @ts-ignore */}
                                                {word.mnemonics}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <Pressable
                                onPress={() => {
                                    setSecondModalVisible(false),
                                        router.push("/check");
                                }}
                                style={styles.secondModalContinueBtn}
                            >
                                <Text style={styles.secondModalContinueText}>
                                    Check Backup
                                </Text>
                            </Pressable>
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
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 40,
        marginBottom: 50,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
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
        marginBottom: 10,
    },
    createButton: {
        backgroundColor: "#222C3A",
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30,
    },
    createText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },

    // Shared Modal Overlay
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
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
        height: "66%",
    },
    firstModalCloseBtnContainer: {
        alignItems: "flex-end",
    },
    firstModalCloseBtn: {
        color: "#fff",
        fontSize: 30,
        fontWeight: 500,
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
    },
    firstModalInfoBox: {
        backgroundColor: "#1D2633",
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    firstModalPoint: {
        color: "#ccc",
        fontSize: 14,
        marginBottom: 10,
        fontWeight: 600,
    },
    firstModalContinueBtn: {
        backgroundColor: "#378AC2",
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
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
        height: "90%",
        paddingBottom: 50,
    },
    secondModalCloseBtn: {
        color: "#fff",
        fontSize: 30,
        fontWeight: 500,
        marginBottom: 10,
    },
    secondModalTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    secondModalDescription: {
        color: "#ccc",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
    },
    secondModalContinueBtn: {
        backgroundColor: "#378AC2",
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: "auto",
    },
    secondModalContinueText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    recoveryPhraseContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    recoveryColumn: {
        flex: 1,
    },
    recoveryWordBox: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        paddingVertical: 2,
        paddingHorizontal: 12,
    },
    recoveryWordIndex: {
        color: "#fff",
        width: 24,
        fontWeight: "bold",
    },
    recoveryWordText: {
        color: "#fff",
        fontSize: 14,
    },
});
