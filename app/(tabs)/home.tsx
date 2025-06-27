import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
    Modal,
    Animated,
    Pressable,
    Image,
    StatusBar,
    FlatList,
    Clipboard,
    ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Link, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DataState {
    name?: string;
    ton_balance: string;
    non_bounceable_address: string;
}

interface Wallet {
    id: string;
    name: string;
    ton_balance: string;
    non_bounceable_address: string;
}

export default function Wallet() {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [faceIdEnabled, setFaceIdEnabled] = useState(false);
    const [data, setData] = useState<DataState>();
    const [copied, setCopied] = useState(false);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [walletid, setWalletid] = useState<string>("");

    const [fadeAnim] = useState(new Animated.Value(0));

    const handleCopy = (walletAddress: string) => {
        if (walletAddress) {
            Clipboard.setString(walletAddress);
            setCopied(true);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setTimeout(() => {
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => setCopied(false));
                }, 2000);
            });
        }
    };

    const removeToken = async () => {
        try {
            await AsyncStorage.removeItem("token");
            router.replace("/welcome");
        } catch (error) {
            console.error("Tokenni o'chirishda xatolik:", error);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleSelectWallet = async (wallet: Wallet) => {
        try {
            await AsyncStorage.setItem("walletid", String(wallet.id));
            setWalletid(String(wallet.id));
            setData({
                name: wallet.name,
                ton_balance: wallet.ton_balance,
                non_bounceable_address: wallet.non_bounceable_address,
            });
            setModalVisible(false);
        } catch (error) {
            console.error("Walletni saqlashda xatolik:", error);
        }
    };

    const handleAddWallet = () => {
        router.push("/addWallet");
        handleCloseModal();
    };

    // Wallet details olish
    useEffect(() => {
        const getData = async () => {
            if (!walletid) return;

            const token = await AsyncStorage.getItem("token");

            try {
                const response = await axios.get(
                    `https://test.bukhara-best.uz/api/wallet/${walletid}/detaile/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data && response.data.length > 0) {
                    setData(response.data[0]);
                    console.log(response.data[0]);
                }
            } catch (error) {
                console.error("Error fetching wallet details:", error);
            }
        };

        getData();
    }, [walletid]);

    // Barcha walletlarni olish
    useEffect(() => {
        const getData = async () => {
            const savedWalletId = await AsyncStorage.getItem("walletid");
            const token = await AsyncStorage.getItem("token");

            try {
                const response = await axios.get(
                    `https://test.bukhara-best.uz/api/wallet/all/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setWallets(response.data);

                // Agar walletid bo'lmasa yoki mavjud bo'lmasa, birinchi walletni tanlash
                if (response.data.length > 0) {
                    if (
                        !savedWalletId ||
                        !response.data.find(
                            (w: Wallet) => w.id === savedWalletId
                        )
                    ) {
                        const firstWalletId = String(response.data[0].id);
                        setWalletid(firstWalletId);
                        await AsyncStorage.setItem("walletid", firstWalletId);
                        setData({
                            name: response.data[0].name,
                            ton_balance: response.data[0].ton_balance,
                            non_bounceable_address:
                                response.data[0].non_bounceable_address,
                        });
                    } else {
                        setWalletid(savedWalletId);
                    }
                }
            } catch (error) {
                console.error("Error fetching wallet details:", error);
            }
        };

        getData();
    }, []);

    const renderWalletItem = ({ item }: { item: Wallet }) => (
        <TouchableOpacity
            style={styles.walletCard}
            onPress={() => handleSelectWallet(item)}
        >
            <View style={styles.walletCardContent}>
                <View style={styles.walletIcon}>
                    <Ionicons name="wallet" size={24} color="#fff" />
                </View>
                <View style={styles.walletInfo}>
                    <Text style={styles.walletCardTitle}>{item.name}</Text>
                    <Text style={styles.walletCardBalance}>
                        ${item.ton_balance}
                    </Text>
                    <Text style={styles.walletCardAddress}>
                        {item.non_bounceable_address
                            ? `${item.non_bounceable_address.slice(
                                  0,
                                  4
                              )}...${item.non_bounceable_address.slice(-4)}`
                            : ""}
                    </Text>
                </View>
                <Ionicons
                    name={
                        walletid === item.id
                            ? "checkmark-circle"
                            : "ellipse-outline"
                    }
                    size={24}
                    color={walletid === item.id ? "#3599EA" : "#aaa"}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            {/* Top Bar */}
            <View style={styles.topBar}>
                <View style={styles.leftSpace} />
                <Pressable
                    onPress={() => setModalVisible(true)}
                    style={styles.walletHeader}
                >
                    <Ionicons name="wallet" size={20} color="white" />
                    <Text style={styles.walletText}>
                        {data?.name || "Select Wallet"}
                    </Text>
                    <Ionicons
                        name="chevron-down"
                        size={20}
                        color="white"
                        style={{ marginLeft: 4 }}
                    />
                </Pressable>
                <TouchableOpacity
                    onPress={removeToken}
                    style={styles.settingsIcon}
                >
                    <Ionicons name="log-out-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Balance */}
            <Text style={styles.balance}>${data?.ton_balance || "0.00"}</Text>

            {/* Address Container */}
            <View style={styles.addressContainer}>
                <View style={styles.addressRow}>
                    <Text style={styles.address}>
                        Your address:{" "}
                        {data?.non_bounceable_address
                            ? `${data.non_bounceable_address.slice(
                                  0,
                                  2
                              )}...${data.non_bounceable_address.slice(-5)}`
                            : "No address"}
                    </Text>
                    <Pressable
                        onPress={() =>
                            handleCopy(data?.non_bounceable_address || "")
                        }
                        style={styles.copyButton}
                    >
                        <Ionicons
                            name="copy-outline"
                            size={18}
                            color="#AFAFAF"
                        />
                    </Pressable>
                </View>

                {copied && (
                    <Animated.View
                        style={[
                            styles.copiedNotification,
                            { opacity: fadeAnim },
                        ]}
                    >
                        <Text style={styles.copiedText}>Copied!</Text>
                    </Animated.View>
                )}
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
                <Link href="/sendModal" asChild>
                    <TouchableOpacity style={styles.actionButton}>
                        <Feather
                            name="arrow-up-right"
                            size={20}
                            color="white"
                        />
                        <Text style={styles.actionText}>Send</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/show" asChild>
                    <TouchableOpacity style={styles.actionButton}>
                        <Feather
                            name="arrow-down-left"
                            size={20}
                            color="white"
                        />
                        <Text style={styles.actionText}>Receive</Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/scan" asChild>
                    <TouchableOpacity style={styles.actionButton}>
                        <MaterialCommunityIcons
                            name="qrcode-scan"
                            size={20}
                            color="white"
                        />
                        <Text style={styles.actionText}>Scan</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            <View style={styles.actionsRowCenter}>
                <Link href="/swapModal" asChild>
                    <TouchableOpacity style={styles.actionButton}>
                        <MaterialCommunityIcons
                            name="swap-horizontal"
                            size={20}
                            color="white"
                        />
                        <Text style={styles.actionText}>Swap</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* Finish Setting Up */}
            <Text style={styles.finishTitle}>Finish setting up</Text>
            <ScrollView style={styles.finishSetup}>
                <View style={styles.settingItem}>
                    <Image
                        source={require("../../assets/images/ellipse1.png")}
                        style={styles.settingIcon}
                    />
                    <Text style={styles.settingText}>
                        Enable transaction notifications
                    </Text>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: "#767577", true: "#3599EA" }}
                        thumbColor={
                            notificationsEnabled ? "#ffffff" : "#f4f3f4"
                        }
                    />
                </View>

                <TouchableOpacity style={styles.settingItem}>
                    <Image
                        source={require("../../assets/images/ellipse4.png")}
                        style={styles.settingIcon}
                    />
                    <Text style={styles.settingText}>
                        Join ClickBit Channel
                    </Text>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Open</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.settingItem}>
                    <Image
                        source={require("../../assets/images/ellipse3.png")}
                        style={styles.settingIcon}
                    />
                    <Text style={styles.settingText}>
                        Use Face ID to approve transactions
                    </Text>
                    <Switch
                        value={faceIdEnabled}
                        onValueChange={setFaceIdEnabled}
                        trackColor={{ false: "#767577", true: "#3599EA" }}
                        thumbColor={faceIdEnabled ? "#ffffff" : "#f4f3f4"}
                    />
                </View>

                <TouchableOpacity style={styles.settingItem}>
                    <Image
                        source={require("../../assets/images/ellipse2.png")}
                        style={styles.settingIcon}
                    />
                    <Text style={styles.settingText}>
                        Back up the wallet's recovery phrase
                    </Text>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                </TouchableOpacity>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <TouchableOpacity
                    style={styles.modalBackground}
                    activeOpacity={1}
                    onPress={handleCloseModal}
                >
                    <Pressable style={styles.modalContainer} onPress={() => {}}>
                        <Text style={styles.modalTitle}>Select Wallet</Text>
                        {wallets.length === 0 ? (
                            <Text style={styles.noWalletsText}>
                                No wallets available
                            </Text>
                        ) : (
                            <FlatList
                                data={wallets}
                                renderItem={renderWalletItem}
                                keyExtractor={(item) => item.id}
                                style={styles.walletList}
                                showsVerticalScrollIndicator={false}
                            />
                        )}

                        <TouchableOpacity
                            style={styles.addwallet}
                            onPress={handleAddWallet}
                        >
                            <Text style={styles.addwallettext}>
                                + Add wallet
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleCloseModal}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </Pressable>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        paddingTop: 40,
        paddingHorizontal: 20,
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
        backgroundColor: "#293342",
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 10,
    },
    walletText: {
        color: "white",
        fontSize: 16,
        marginHorizontal: 5,
    },
    settingsIcon: {
        padding: 8,
    },
    balance: {
        color: "white",
        fontSize: 40,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
    },
    addressContainer: {
        position: "relative",
        alignItems: "center",
        marginBottom: 30,
    },
    addressRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    address: {
        color: "#aaa",
        fontSize: 14,
        textAlign: "center",
    },
    copyButton: {
        marginLeft: 8,
        padding: 4,
    },
    copiedNotification: {
        position: "absolute",
        top: 30,
        backgroundColor: "#3599EA",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    copiedText: {
        color: "white",
        fontSize: 14,
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 20,
    },
    actionsRowCenter: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 30,
    },
    actionButton: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 10,
    },
    actionText: {
        color: "white",
        marginTop: 4,
        fontSize: 14,
    },
    finishSetup: {
        backgroundColor: "#222C3A",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    finishTitle: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 20,
    },
    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    settingIcon: {
        width: 40,
        height: 40,
        marginRight: 15,
    },
    settingText: {
        flex: 1,
        color: "white",
        fontSize: 14,
    },
    button: {
        backgroundColor: "#3A404B",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 6,
    },
    buttonText: {
        color: "white",
        fontSize: 14,
    },
    modalBackground: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        backgroundColor: Colors.dark.background,
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "80%",
    },
    modalTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    noWalletsText: {
        color: "#aaa",
        fontSize: 16,
        textAlign: "center",
        marginVertical: 20,
    },
    walletList: {
        flexGrow: 0,
        maxHeight: 400,
    },
    walletCard: {
        backgroundColor: "#293342",
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    walletCardContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    walletIcon: {
        backgroundColor: "#3599EA",
        borderRadius: 8,
        padding: 8,
        marginRight: 15,
    },
    walletInfo: {
        flex: 1,
    },
    walletCardTitle: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    walletCardBalance: {
        color: "#ccc",
        fontSize: 14,
        marginTop: 4,
    },
    walletCardAddress: {
        color: "#aaa",
        fontSize: 12,
        marginTop: 4,
    },
    modalButton: {
        backgroundColor: "#378AC2",
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 15,
    },
    addwallet: {
        borderStyle: "dashed",
        borderWidth: 1,
        borderColor: "#378AC2",
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },
    modalButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    addwallettext: {
        color: "#378AC2",
        fontSize: 16,
        fontWeight: "600",
    },
});
