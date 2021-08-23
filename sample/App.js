import React, { useState } from "react";
import { Platform, SafeAreaView, Text, StatusBar, Switch, StyleSheet, ToastAndroid, Alert, NativeModules } from "react-native";

const SWITCH_TEXT_LOCATION = "위치 기반 서비스 동의"
const SWITCH_TEXT_MARKETING = "마케팅 서비스 동의"

const SWITCH_TYPE_LOCATION = 1
const SWITCH_TYPE_MARKETING = 2

const App = () => {
  return (
    <SafeAreaView style={appStyles.container}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor="#000000" />
      <SwitchComponent
        text={SWITCH_TEXT_LOCATION}
        type={SWITCH_TYPE_LOCATION} />
      <SwitchComponent
        text={SWITCH_TEXT_MARKETING}
        type={SWITCH_TYPE_MARKETING} />
    </SafeAreaView>
  );
}

const SwitchComponent = (props) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = (value) => {
    setIsEnabled(value);
    if(Platform.OS === 'android'){
      if(props.type === SWITCH_TYPE_LOCATION){
        /**
         * OS: Android
         * type: SWITCH_TYPE_LOCATION (위치 기반 서비스 동의)
         * value: value (동의 여부)
         * 작성 내용: 위치 기반 서비스 동의에 따른 Loplat SDK 동작
         */
      }else if(props.type === SWITCH_TYPE_MARKETING){
        /**
         * OS: Android
         * type: SWITCH_TYPE_MARKETING (마케팅 서비스 동의)
         * value: value (동의 여부)
         * 작성 내용: 마케팅 서비스 동의에 따른 Loplat SDK 설정 (Loplat X Campaigns)
         */
      }
    }else if(Platform.OS === 'ios'){
      if(props.type === SWITCH_TYPE_LOCATION){
        /**
         * OS: iOS
         * type: SWITCH_TYPE_LOCATION (위치 기반 서비스 동의)
         * value: value (동의 여부)
         * 작성 내용: 위치 기반 서비스 동의에 따른 Loplat SDK 동작
         */
      }else if(props.type === SWITCH_TYPE_MARKETING){
        /**
         * OS: iOS
         * type: SWITCH_TYPE_MARKETING (마케팅 서비스 동의)
         * value: value (동의 여부)
         * 작성 내용: 마케팅 서비스 동의에 따른 Loplat SDK 설정 (Loplat X Campaigns)
         */
      }
    }
  }

  return (
    <SafeAreaView style={switchStyles.container}>
      <Text>{props.text}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </SafeAreaView>
  )
}

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const switchStyles = StyleSheet.create({
  container: {
    margin: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default App;