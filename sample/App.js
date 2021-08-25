import React, { useState } from "react";
import { Platform, SafeAreaView, Text, StatusBar, Switch, StyleSheet, NativeModules } from "react-native";

const SWITCH_TEXT_LOCATION = "위치 기반 서비스 동의"
const SWITCH_TEXT_MARKETING = "마케팅 서비스 동의"

const SWITCH_TYPE_LOCATION = 1
const SWITCH_TYPE_MARKETING = 2

const App = () => {
  const clientId = 'loplatdemo' // Test ID
  const clientSecret = 'loplatdemokey' // Test PW
  const echoCode = '18497358207' // Test CODE

  if (Platform.OS === 'android') {
    NativeModules.AndroidPlengi.init(clientId, clientSecret, echoCode,
     (result) => {
       console.log(`init result: ${result}`);
     }
    )
  }
  
  /**
   * MainApplication 에서 init 되지만 clientId, clientSecret, echoCode 를 변경하고 싶다면 사용
   * const clientId = 'loplatdemo' // Test ID
   * const clientSecret = 'loplatdemokey' // Test PW
   * const echoCode = '18497358207' // Test CODE
   * 
   * if (Platform.OS === 'android') {
   *  NativeModules.AndroidPlengi.init(clientId, clientSecret, echoCode,
   *    (result) => {
   *      console.log(`stop result: ${result}`);
   *    }
   *  )
   * else if (Platform.OS === 'ios') {
   * }
   */

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
    console.log('toggleSwitch')
    if (Platform.OS === 'android') {
      if (props.type === SWITCH_TYPE_LOCATION) {
        /**
         * OS: Android
         * type: SWITCH_TYPE_LOCATION (위치 기반 서비스 동의)
         * value: value (동의 여부)
         * 작성 내용: 위치 기반 서비스 동의에 따른 Loplat SDK 동작
         */
        if (value === true) {
          console.log('위치 기반 서비스 이용에 동의 하였습니다')
          NativeModules.AndroidPlengi.start(
            (result) => {
              console.log(`start result: ${result}`);
            }
          )
        } else {
          console.log('위치 기반 서비스 이용을 취소 하였습니다')
          NativeModules.AndroidPlengi.stop(
            (result) => {
              console.log(`stop result: ${result}`);
            }
          )
        }
      } else if (props.type === SWITCH_TYPE_MARKETING) {
        /**
         * OS: Android
         * type: SWITCH_TYPE_MARKETING (마케팅 서비스 동의)
         * value: value (동의 여부)
         * 작성 내용: 마케팅 서비스 동의에 따른 Loplat SDK 설정 (Loplat X Campaigns)
         */
        if (value === true) {
          console.log('푸시 알림 마케팅 수신에 동의 하였습니다')
          NativeModules.AndroidPlengi.enableAdNetwork(value, value)
        } else {
          console.log('푸시 알림 마케팅 수신에 취소 하였습니다')
          NativeModules.AndroidPlengi.enableAdNetwork(value, false)
        }
      }
    } else if (Platform.OS === 'ios') {
      console.log('ios')
      if (props.type === SWITCH_TYPE_LOCATION) {
        console.log('SWITCH_TYPE_LOCATION')
        /**
         * OS: iOS
         * type: SWITCH_TYPE_LOCATION (위치 기반 서비스 동의)
         * value: value (동의 여부)
         * 작성 내용: 위치 기반 서비스 동의에 따른 Loplat SDK 동작
         */
      } else if (props.type === SWITCH_TYPE_MARKETING) {
        console.log('SWITCH_TYPE_MARKETING')
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