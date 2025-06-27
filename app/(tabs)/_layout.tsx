import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import React from "react";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false, // 💥 Header butunlay o‘chirilgan
                tabBarIcon: ({ color, focused }) => {
                    let iconName: any;

                    if (route.name === "home") {
                        iconName = focused ? "wallet" : "wallet-outline";
                    } else if (route.name === "history") {
                        iconName = focused ? "time" : "time-outline";
                    } else if (route.name === "browser") {
                        iconName = focused ? "compass" : "compass-outline";
                    } else if (route.name === "collectible") {
                        iconName = focused ? "cube" : "cube-outline";
                    }

                    return <Ionicons name={iconName} size={30} color={color} />;
                },
                tabBarLabel: () => null,
                tabBarActiveTintColor: "#007AFF",
                tabBarInactiveTintColor: "#fff",
                tabBarStyle: {
                    backgroundColor: Colors.dark.background,
                    height: 80,
                    paddingBottom: 8,
                    paddingTop: 8,
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderTopColor: "transparent",
                },
            })}
        >
            <Tabs.Screen name="home" />
            <Tabs.Screen name="history" />
            <Tabs.Screen name="browser" />
            <Tabs.Screen name="collectible" />
        </Tabs>
    );
}
