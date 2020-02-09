import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

const CurrentStep = props => {
  const { name, hold_temp, timeRemaining, currentTemp, onStart } = props;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text>Time Remaining: {timeRemaining}</Text>
      <Text>Hold Temp: {hold_temp}</Text>
      <Text>Current Temp: {currentTemp}</Text>
      <Button title="Start" onPress={onStart} />
    </View>
  );
};

export default CurrentStep;
