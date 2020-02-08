import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold"
  }
});

const Loader = props => {
  return (
    <View>
      <Text style={styles.title}>Trying to Reconnect...</Text>
      <ActivityIndicator animating size={100} />
    </View>
  );
};

export default Loader;
