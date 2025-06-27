import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Alert,
    Pressable,
    StatusBar,
    Platform,
    SafeAreaView,
} from "react-native";
import {
    CameraView,
    useCameraPermissions,
    BarcodeScanningResult,
} from "expo-camera";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function ScanSendModal() {
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
                `Type: ${result.type}\nData: ${result.data}`,
                [
                    {
                        text: "OK",
                        onPress: () => setScanned(false), // Reset scan state
                    },
                ]
            );
            // bu yerda navigatsiya yoki boshqa logika qo'shing
        }
    };

    if (!permission) {
        return (
            <SafeAreaView style={styles.center}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={Colors.dark.background}
                    translucent={false}
                />
                <Text style={styles.permissionText}>Loading camera...</Text>
            </SafeAreaView>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.center}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={Colors.dark.background}
                    translucent={false}
                />
                <View style={styles.permissionContainer}>
                    <Ionicons
                        name="camera-outline"
                        size={64}
                        color="#888"
                        style={styles.cameraIcon}
                    />
                    <Text style={styles.permissionTitle}>
                        Camera Access Required
                    </Text>
                    <Text style={styles.permissionText}>
                        We need access to your camera to scan QR codes
                    </Text>
                    <Pressable
                        style={styles.permissionButton}
                        onPress={requestPermission}
                        android_ripple={{ color: "rgba(255,255,255,0.1)" }}
                    >
                        <Text style={styles.permissionButtonText}>
                            Grant Permission
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.modalContainer}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={Colors.dark.background}
                translucent={false}
            />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <Link href="../" style={styles.settingsIcon}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="chevron-down-outline"
                            size={24}
                            color="white"
                        />
                    </View>
                </Link>
                <View style={styles.spacer} />
            </View>

            {/* Main Content */}
            <View style={styles.container}>
                <Text style={styles.walletText}>Scan QR code</Text>
                <Text style={styles.instructionText}>
                    Point your camera at a QR code to scan
                </Text>

                {/* Camera Container */}
                <View style={styles.cameraWrapper}>
                    <CameraView
                        ref={cameraRef}
                        style={styles.scanContainer}
                        facing="back"
                        onBarcodeScanned={
                            scanned ? undefined : handleBarCodeScanned
                        }
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr", "ean13", "code128"],
                        }}
                    />

                    {/* Scan Overlay */}
                    <View style={styles.scanOverlay}>
                        <View style={styles.scanFrame}>
                            {/* Corner indicators */}
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                        </View>
                    </View>
                </View>

                {/* Bottom Instructions */}
                <View style={styles.bottomInstructions}>
                    <Text style={styles.instructionSubText}>
                        Position the QR code within the frame
                    </Text>
                    {scanned && (
                        <Pressable
                            style={styles.scanAgainButton}
                            onPress={() => setScanned(false)}
                            android_ripple={{ color: "rgba(255,255,255,0.1)" }}
                        >
                            <Text style={styles.scanAgainText}>Scan Again</Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        paddingTop:40
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
        alignItems: "center",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: Platform.OS === "android" ? 10 : 0,
        marginBottom: 20,
        height: 50,
    },
    settingsIcon: {
        borderRadius: 20,
    },
    iconContainer: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    spacer: {
        width: 40, // Balance the back button
    },
    walletText: {
        color: "white",
        textAlign: "center",
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 8,
    },
    instructionText: {
        color: "#888",
        textAlign: "center",
        fontSize: 16,
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    cameraWrapper: {
        position: "relative",
        width: width * 0.8,
        height: width * 0.8,
        maxWidth: 300,
        maxHeight: 300,
        marginBottom: 30,
    },
    scanContainer: {
        width: "100%",
        height: "100%",
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#000",
    },
    scanOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    scanFrame: {
        width: "70%",
        height: "70%",
        position: "relative",
    },
    corner: {
        position: "absolute",
        width: 30,
        height: 30,
        borderColor: "#45AEF5",
        borderWidth: 3,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 8,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 8,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 8,
    },
    bottomInstructions: {
        alignItems: "center",
        paddingHorizontal: 20,
    },
    instructionSubText: {
        color: "#888",
        textAlign: "center",
        fontSize: 14,
        marginBottom: 20,
    },
    scanAgainButton: {
        backgroundColor: "#378AC2",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
        marginTop: 10,
    },
    scanAgainText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.background,
    },
    permissionContainer: {
        alignItems: "center",
        paddingHorizontal: 40,
    },
    cameraIcon: {
        marginBottom: 20,
    },
    permissionTitle: {
        color: "white",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 12,
        textAlign: "center",
    },
    permissionText: {
        color: "#888",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 30,
        lineHeight: 22,
    },
    permissionButton: {
        backgroundColor: "#378AC2",
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: Platform.OS === "android" ? 2 : 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    permissionButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});
