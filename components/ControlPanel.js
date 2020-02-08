import React, { Component } from "react";
import {
  View,
  Button,
  Text,
  Slider,
  Switch,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import Loader from "./Loader";
import PumpSwitch from "./PumpSwitch";

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    height: "90%",
    width: "90%",
    padding: 30
  }
});

class ControlPanel extends Component {
  state = {
    socketConnected: false,
    tempReading: null,
    running: false,
    pumpOne: false,
    errorCount: 0,
    socketError: false,
    sliderValue: 130,
    showLoader: true
  };

  timeout = null;
  socket = null;

  componentDidMount() {
    this.initializeWebSocket();
  }

  initializeWebSocket = event => {
    const socket = new WebSocket("ws://192.168.0.29:5001/ws");
    socket.onopen = event => this.handleSocketOpen(event);
    socket.onmessage = event => this.handleMessage(event);
    socket.onclose = event => this.handleSocketClose(event);
    socket.onerror = event => this.handleSocketError(event);
    this.socket = socket;
  };

  handleSocketOpen = event => {
    this.setState({ socketConnected: true, showLoader: false });
  };

  handleMessage = event => {
    const { data } = event;
    const parsed = JSON.parse(data);
    this.setState({
      tempReading: parsed.current_temp,
      running: parsed.running
    });
  };

  handleSocketClose = event => {
    this.setState(
      { tempReading: null, socketConnected: false, showLoader: true },
      this.setSocketConnectionTimeout
    );
  };

  handleSocketError = event => {
    this.setState({ errorCount: this.state.errorCount + 1 });
  };

  retryToConnectToSocket = () => {
    if (this.state.errorCount < 5) {
      this.initializeWebSocket();
    } else {
      this.setState({ socketError: true, showLoader: false });
      clearTimeout(this.timeout);
    }
  };

  setSocketConnectionTimeout = () => {
    this.timeout = setTimeout(this.retryToConnectToSocket, 3000);
  };

  removeSocketError = () => {
    this.setState(
      { socketError: false, errorCount: 0, showLoader: true },
      this.setSocketConnectionTimeout()
    );
  };

  handleBooleanChange = async event => {
    const { value } = event.nativeEvent;
    this.setState({ pumpOne: value });
    const blob = await fetch("http://192.168.0.29:5001/pump/1", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const newState = await blob.json();
    if (newState !== value) {
      this.setState({ pumpOne: newState });
    }
  };

  handleSliderComplete = event => {
    this.setState({ sliderValue: 150 });
  };

  render() {
    if (this.state.socketError) {
      return (
        <View>
          <Text>Could Not Connect</Text>
          <Button title="Retry" onPress={this.removeSocketError} />
        </View>
      );
    }
    if (this.state.showLoader) {
      return <Loader />;
    } else {
      return (
        <View style={styles.container}>
          <Text>
            {this.state.tempReading
              ? this.state.tempReading
              : "Waiting for temp reading"}
          </Text>
          <Slider
            style={{ width: 300, height: 40 }}
            minimumValue={100}
            maximumValue={200}
            step={1}
            value={this.state.sliderValue}
            onSlidingComplete={this.handleSliderComplete}
          />
          <PumpSwitch
            onChange={this.handleBooleanChange}
            label="Pump"
            value={this.state.pumpOne}
          />
        </View>
      );
    }
  }
}

export default ControlPanel;
