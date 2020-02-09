import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

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

class StepForm extends React.Component {
  addButton = async () => {
    const blob = await fetch("http://192.168.0.29:5001/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Step One",
        hold_time: 2,
        hold_temp: 70
      })
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>This is the form</Text>
        <TextInput keyboardType="decimal-pad" onChange={this.handleOnChange} />
        <Button title="Add Step" onPress={this.addButton}></Button>
      </View>
    );
  }
}

export default StepForm;
