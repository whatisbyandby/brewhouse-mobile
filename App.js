import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TempReading from "./components/ControlPanel";

export default function App() {
  return (
    <View style={styles.container}>
      <TempReading />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
