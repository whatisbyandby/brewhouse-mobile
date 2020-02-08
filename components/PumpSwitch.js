import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "50%",
    alignContent: "center"
  },
  title: {
    fontSize: 19,
    fontWeight: "bold"
  }
});

const PumpSwitch = props => {
  const { value, onChange, label } = props;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{label}</Text>
      <Switch style={styles.switch} onChange={onChange} value={value} />
    </View>
  );
};

export default PumpSwitch;
