import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, StatusBar } from "react-native";
// @ts-ignore
import Collectible1 from "@/assets/images/collectible1.png";
import { Link } from "expo-router";

export default function CollectiblesScreen() {
    return (
        <View style={styles.scrollContainer}>
            <StatusBar barStyle="light-content" />
            <ScrollView>
                <View style={styles.collectibleHeader}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "white",
                        }}
                    >
                        Collectibles
                    </Text>
                    <Feather name="sliders" size={20} color="#fff" />
                </View>
                <View style={styles.collectibles}>
                    <Link href="/collectDetail">
                        <View style={styles.collectible}>
                            <Image
                                source={Collectible1}
                                style={{
                                    width: 110,
                                    height: 110,
                                    marginBottom: 5,
                                    borderTopLeftRadius: 10,
                                    borderTopRightRadius: 10,
                                }}
                            />
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 12,
                                    marginLeft: 6,
                                }}
                            >
                                Gift box #35...
                            </Text>
                            <Text
                                style={{
                                    color: "#8994A3",
                                    fontSize: 10,
                                    marginLeft: 6,
                                }}
                            >
                                Gems Winter S...
                            </Text>
                            <Text></Text>
                        </View>
                    </Link>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: Colors.dark.background,
        padding: 16,
        paddingTop: 80,
        flex: 1,
    },
    collectibles: {
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    collectibleHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    collectible: {
        width: 110,
        height: 150,
        borderRadius: 10,
        backgroundColor: "#2E3847",
        marginBottom: 16,
    },
});
