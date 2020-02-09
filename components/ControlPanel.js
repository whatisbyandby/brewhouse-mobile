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
import CurrentStep from "./CurrentStep";
import StepForm from "./StepForm";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "center"
  },
  title: {
    fontWeight: "bold",
    color: "#fff"
  }
});

class ControlPanel extends Component {
  state = {
    socketConnected: false,
    currentTemp: null,
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
      currentTemp: parsed.current_temp,
      running: parsed.running,
      currentStep: parsed.current_step,
      timeRemaining: parsed.time_remaining
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

  handleStart = async () => {
    const blob = await fetch("http://192.168.0.29:5001/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
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
          {this.state.currentStep ? (
            <CurrentStep
              {...this.state.currentStep}
              timeRemaining={this.state.timeRemaining}
              currentTemp={this.state.currentTemp}
              onStart={this.handleStart}
            />
          ) : (
            <StepForm />
          )}
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
