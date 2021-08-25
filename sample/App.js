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
        if (value == true) {
            // 유저가 위치기반약관을 동의하면 iOS 시스템 위치 권한 요청 및 loplat SDK가 start됩니다.
            NativeModules.iosPlengi.requestAlwaysAuthorization()
            NativeModules.iosPlengi.start()
        } else {
            // 유저가 위치기반약관을 철회하면  loplat SDK를 stop 시킵니다.
            NativeModules.iosPlengi.stop()
        }
      }else if(props.type === SWITCH_TYPE_MARKETING){
        /**
         * OS: iOS
         * type: SWITCH_TYPE_MARKETING (마케팅 서비스 동의)
         * value: value (동의 여부)
         * 작성 내용: 마케팅 서비스 동의에 따른 Loplat SDK 설정 (Loplat X Campaigns)
         */

        // loplat X를 사용하여 캠페인 알림을 매칭하려는 경우 enableAdNetwork를 true, true로 세팅합니다.
         NativeModules.iosPlengi.enableAdNetwork(value, value)
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