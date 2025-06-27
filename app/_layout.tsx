import { Stack } from "expo-router";
import React from "react";
import "react-native-gesture-handler";

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="sendModal"
                options={{
                    presentation: "modal",
                }}
            />
            <Stack.Screen
                name="scan"
                options={{
                    presentation: "modal",
                }}
            />

            <Stack.Screen
                name="scanSend"
                options={{
                    presentation: "modal",
                }}
            />
            <Stack.Screen
                name="show"
                options={{
                    presentation: "modal",
                }}
            />
            <Stack.Screen
                name="SwapModal"
                options={{
                    presentation: "modal",
                }}
            />
            <Stack.Screen
                name="collectDetail"
                options={{
                    presentation: "modal",
                }}
            />
        </Stack>
    );
}
