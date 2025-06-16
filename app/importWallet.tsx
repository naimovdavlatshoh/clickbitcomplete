import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import React from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CheckBackup() {
  const [mnemonics, setMnemonics] = useState<string[]>(
      Array(24).fill("")
  );
  const [walletName, setWalletName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleChange = (index: number, value: string) => {
      const updated = [...mnemonics];
      updated[index] = value.trim();
      setMnemonics(updated);
  };

  const handleSubmit = async () => {
      try {
          setLoading(true);
          const token = await AsyncStorage.getItem("token");
          const walletid = await AsyncStorage.getItem("walletid");

          if (!token || !walletid) throw new Error("Token yoki walletid yo'q");

          const payload = {
              name: walletName,
              mnemonics,
          };

          const response = await axios.post(
              `https://test.bukhara-best.uz/api/wallet/import/`,
              payload,
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                  },
              }
          );

          console.log("✅ Success:", response.data);
          router.push("/(tabs)/home");
      } catch (err) {
          console.error("❌ Xatolik:", err);
          setError(err);
      } finally {
          setLoading(false);
      }
  };

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.container}
      >
          <StatusBar barStyle="light-content" />
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
              {/* Header */}
              <View style={styles.header}>
                  <Pressable onPress={() => router.back()}>
                      <Ionicons name="chevron-back" size={28} color="#fff" />
                  </Pressable>
              </View>

              <Text style={styles.headerTitle}>Backup Check</Text>

              <Text style={styles.description}>
                  Please enter your 24 recovery words and wallet name below.
              </Text>

              {/* Wallet Name */}
              <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                      style={styles.input}
                      value={walletName}
                      onChangeText={setWalletName}
                      placeholder="Enter wallet name"
                      placeholderTextColor="#888"
                  />
              </View>

              {/* Mnemonics */}
              <View style={styles.mnemonicContainer}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => (
                      <View key={index} style={styles.mnemonicInputWrapper}>
                          <Text style={styles.mnemonicIndex}>{index + 1}.</Text>
                          <TextInput
                              style={styles.mnemonicInput}
                              value={mnemonics[index]}
                              onChangeText={(text) => handleChange(index, text)}
                              placeholder="Word"
                              placeholderTextColor="#888"
                          />
                      </View>
                  ))}
              </View>

              <View style={styles.mnemonicContainer}>
                  {[12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map((index) => (
                      <View key={index} style={styles.mnemonicInputWrapper}>
                          <Text style={styles.mnemonicIndex}>{index + 1}.</Text>
                          <TextInput
                              style={styles.mnemonicInput}
                              value={mnemonics[index]}
                              onChangeText={(text) => handleChange(index, text)}
                              placeholder="Word"
                              placeholderTextColor="#888"
                          />
                      </View>
                  ))}
              </View>

              {/* Submit Button */}
              <Pressable style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitText}>
                      {loading ? "Verifying..." : "Continue"}
                  </Text>
              </Pressable>
          </ScrollView>
      </KeyboardAvoidingView>
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
      marginBottom: 20,
  },
  headerTitle: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
  },
  description: {
      color: "#ccc",
      fontSize: 14,
      marginBottom: 20,
      textAlign: "center",
  },
  inputGroup: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#1D2633",
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 12,
      marginBottom: 20,
  },
  label: {
      color: "#fff",
      fontWeight: "500",
      fontSize: 16,
      width: 60,
  },
  input: {
      flex: 1,
      color: "#fff",
      fontSize: 16,
  },
  mnemonicContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 10,
  },
  mnemonicInputWrapper: {
      width: "48%",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#1D2633",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 10,
  },
  mnemonicIndex: {
      color: "#aaa",
      marginRight: 5,
  },
  mnemonicInput: {
      flex: 1,
      color: "#fff",
      fontSize: 15,
  },
  submitButton: {
      backgroundColor: "#378AC2",
      height: 50,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
  },
  submitText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "600",
  },
});
