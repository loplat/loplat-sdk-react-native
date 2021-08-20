import React, { useState } from "react";
import { SafeAreaView, Text, StatusBar, View, Switch, StyleSheet } from "react-native";
import Toast from 'react-native-easy-toast';

const App = () => {
  const locationSwitchText = "위치 기반 서비스 동의"
  const marketingSwitchText = "마케팅 서비스 동의"

  return (
    <SafeAreaView style={appStyles.container}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor="#000000" />
      <SwitchComponent type={locationSwitchText} />
      <SwitchComponent type={marketingSwitchText} />
    </SafeAreaView>
  );
}

const SwitchComponent = (props) => {
  let toastRef;
  const showToast = function(type, isEnabled){
    const text = type + " permission is " + isEnabled
    console.log(text)
    toastRef.show(text)
  }
  const switchType = props.type
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    console.log(switchType)
    console.log(isEnabled)
    if (switchType === "location") {
      console.log("1")
    } else if (switchType === "marketing") {
      console.log("2")
    }
    console.log(isEnabled)
    showToast(switchType, isEnabled)
    setIsEnabled(previousState => !previousState);
    console.log(isEnabled)
  }


  return (
    <SafeAreaView style={switchStyles.container}>
      <Text>{switchType}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <Toast ref={(toast) => toastRef = toast} position={'bottom'} />
    </SafeAreaView>
  )
}

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

const switchStyles = StyleSheet.create({
  container: {
    flexDirection:'column',
    alignItems: "center",
    justifyContent: "flex-start"
  }
});

export default App;