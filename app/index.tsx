import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ActivityIndicator, View, Text } from "react-native";

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                // Token mavjudligini tekshirish
                if (token) {
                    router.replace("/(tabs)/home");
                } else {
                    router.replace("/welcome");
                }
            } catch (error) {
                console.error("Tokenni olishda xatolik:", error);
                // Xato bo'lsa, foydalanuvchini welcome sahifasiga yo'naltirish
                router.replace("/welcome");
            } finally {
                setIsLoading(false); // Yuklanish holatini o'chirish
            }
        };

        checkToken();
    }, []);

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color="#000" />
                <Text style={{ marginTop: 10 }}>Yuklanmoqda...</Text>
            </View>
        );
    }

    return null; // Yuklanish tugagach, hech narsa ko'rsatilmaydi, chunki navigatsiya allaqachon amalga oshirilgan
}
