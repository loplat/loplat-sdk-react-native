import React, { useState } from "react";
import { Platform, SafeAreaView, Text, StatusBar, Switch, StyleSheet, ToastAndroid, Alert, NativeModules } from "react-native";

const SWITCH_TEXT_LOCATION = "위치 기반 서비스 동의"
const SWITCH_TEXT_MARKETING = "마케팅 서비스 동의"

const SWITCH_TYPE_LOCATION = 1
const SWITCH_TYPE_MARKETING = 2

const App = () => {
  console.log('App')
  /**
   * MainApplication 에서 init 되지만 clientId, clientSecret, echoCode 를 변경하고 싶다면 사용
   * const clientId = 'loplatdemo' // Test ID
   * const clientSecret = 'loplatdemokey' // Test PW
   * const echoCode = '18497358207' // Test CODE
   * 
   * if (Platform.OS === 'android') {
   *  initLoplatSDKAndroid(clientId, clientSecret, echoCode)
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

const toastAndroid = (message) => {
  NativeModules.LoplatAndroidApp.showToast(message)
}
const initLoplatSDKAndroid = (clientId, clientSecret, echoCode) => {
  /**
   * 로그인시 init 호출하세요 <- 이런식으로 주석
   * @param {string} clientId
   * @param {string} clientSecret
   * @param {string} echoCode
   * @param {string} largeIcon
   * @param {string} smallIcon
   * NativeModules.LoplatAndroidApp.initLoplatSDK(clientId, clientSecret, echoCode)
   */
   NativeModules.AndroidPlengi.start(clientId, clientSecret, echoCode)
}

const startLoplatSDKAndroid = () => {
  /**
   * NativeModules.LoplatAndroidApp.startLoplatSDK()
   */
   NativeModules.AndroidPlengi.start()
}

const stopLoplatSDKAndroid = () => {
  /**
   * NativeModules.LoplatAndroidApp.stopLoplatSDK()
   */
   NativeModules.LoplatAndroidApp.stop()
}

const setEnableAdNetworkAndroid = (isEnableAdNetwork) => {
  /**
   * @param {boolean} isEnableAdNetwork
   * NativeModules.LoplatAndroidApp.setEnableAdNetwork(isEnableAdNetwork)
   */
   NativeModules.LoplatAndroidApp.setEnableAdNetwork(isEnableAdNetwork)
}

// const setEnableAdNetworkAndroid = (isEnableAdNetwork, isEnableAdNetwork) => {
//   /**
//    * @param {boolean} isEnableAdNetwork
//    * NativeModules.LoplatAndroidApp.setEnableAdNetwork(isEnableAdNetwork)
//    */
//    NativeModules.LoplatAndroidApp.setEnableAdNetwork(isEnableAdNetwork)
// }

const permissionRequestLocationAndroid = () => {
  /**
   * @returns {boolean} isLocationPermissionGranted
   * NativeModules.LoplatAndroidApp.permissionRequestLocation()
   */
  return NativeModules.LoplatAndroidApp.permissionRequestLocation()
}

const permissionRequestMarketingAndroid = () => {
  /**
   * @returns {boolean} isMarketingPermissionGranted
   * NativeModules.LoplatAndroidApp.permissionRequestMarketing()
   */
  return NativeModules.LoplatAndroidApp.permissionRequestMarketing()
}

const SwitchComponent = (props) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = (value) => {
    setIsEnabled(value);
    console.log('toggleSwitch')
    if (Platform.OS === 'android') {
      NativeModules.LoplatAndroidApp.showToast('test')
      if (props.type === SWITCH_TYPE_LOCATION) {
        /**
         * OS: Android
         * type: SWITCH_TYPE_LOCATION (위치 기반 서비스 동의)
         * value: value (동의 여부)
         * 작성 내용: 위치 기반 서비스 동의에 따른 Loplat SDK 동작
         */
        if(value === true){
          if(permissionRequestLocationAndroid()){
            toastAndroid('위치 기반 서비스 이용에 동의 하였습니다')
            startLoplatSDKAndroid()
          }else{
            toastAndroid('권한에 동의하셔야 위치 기반 서비스를 이용하실 수 있습니다.')
            setIsEnabled(!value);
            stopLoplatSDKAndroid()
          }
        }else{
          toastAndroid('위치 기반 서비스 이용을 취소 하였습니다')
          stopLoplatSDKAndroid()
        }
      } else if (props.type === SWITCH_TYPE_MARKETING) {
        /**
         * OS: Android
         * type: SWITCH_TYPE_MARKETING (마케팅 서비스 동의)
         * value: value (동의 여부)
         * 작성 내용: 마케팅 서비스 동의에 따른 Loplat SDK 설정 (Loplat X Campaigns)
         */
         if(value === true){
          if(permissionRequestMarketingAndroid()){
            toastAndroid('푸시 알림 마케팅 수신에 동의 하였습니다')
            startLoplatSDKAndroid()
          }else{
            toastAndroid('권한에 동의하셔야 마케팅 서비스를 이용하실 수 있습니다.')
            setIsEnabled(!value);
            // setEnableAdNetworkAndroid(true, false)
          }
        }else{
          toastAndroid('푸시 알림 마케팅 수신에 취소 하였습니다')
          // setEnableAdNetworkAndroid(false)
          stopLoplatSDKAndroid()
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