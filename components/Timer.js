import React from "react";
import { View, Text } from "react-native";

const Timer = props => {
  const { timeRemaining } = props;
  return (
    <View>
      <Text>Time Remaining: {timeRemaining}</Text>
    </View>
  );
};

export default Timer;
