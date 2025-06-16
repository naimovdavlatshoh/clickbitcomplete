import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Alert,
    Pressable,
    StatusBar,
} from "react-native";
import {
    CameraView,
    useCameraPermissions,
    BarcodeScanningResult,
} from "expo-camera";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ScanModal() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        if (!permission || !permission.granted) {
            requestPermission();
        }
    }, [permission]);

    const handleBarCodeScanned = (result: BarcodeScanningResult) => {
        if (!scanned) {
            setScanned(true);
            Alert.alert(
                "Scanned",
                `Type: ${result.type}\nData: ${result.data}`
            );
            // bu yerda navigatsiya yoki boshqa logika qo‘shing
        }
    };

    if (!permission || !permission.granted) {
        return (
            <View style={styles.center}>
                <Text>No access to camera</Text>
            </View>
        );
    }

    return (
        <View style={styles.modalContainer}>
            <StatusBar barStyle="light-content" />
            <View style={styles.topBar}>
                <Link href="../" style={styles.settingsIcon}>
                    <Ionicons name="chevron-down-outline" size={24} color="white" />
                </Link>
            </View>
            <View style={styles.container}>
                <Text style={styles.walletText}>Scan QR code</Text>
                <CameraView
                    ref={cameraRef}
                    style={styles.scanContainer}
                    facing="back"
                    onBarcodeScanned={handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "ean13", "code128"], // kerakli turdagi barcode'lar
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: Colors.dark.background,
        height: Dimensions.get("window").height * 0.93,
    },
    container: {
        padding: 40,
        flex: 1,
        position: "relative",
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
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 10,
    },
    walletText: {
        color: "white",
        textAlign: "center",
        fontSize: 22,
        marginHorizontal: 5,
        fontWeight: "600",
    },
    settingsIcon: {
      marginLeft:10,
      marginTop:10,
        padding: 8,
    },
    scanContainer: {
        borderColor: "#fff",
        borderWidth: 5,
        height: Dimensions.get("window").height * 0.4,
        width: "100%",
        marginTop: 20, // ⬅️ bu yerda pastga tushirilmoqda
        borderRadius: 34,
        overflow: "hidden",
    },
    overlay: {
        position: "absolute",
        bottom: 40,
        width: "100%",
        alignItems: "center",
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 8,
        borderRadius: 8,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
