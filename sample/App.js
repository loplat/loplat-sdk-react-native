import React, { useState } from "react";
import { Platform, SafeAreaView, Text, StatusBar, Switch, StyleSheet, NativeModules, DeviceEventEmitter, PermissionsAndroid} from "react-native";

const SWITCH_TEXT_LOCATION = "위치 기반 서비스 동의"
const SWITCH_TEXT_MARKETING = "마케팅 서비스 동의"

const SWITCH_TYPE_LOCATION = 1
const SWITCH_TYPE_MARKETING = 2

/**
 * Android 권한 획득
 * 필요 권한 : android.permission.ACCESS_FINE_LOCATION
 * 필요 권한 : android.permission.ACCESS_COARSE_LOCATION
 */
const requestPermission = async () => {
  if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]).then((result)=>{
          if (result['android.permission.ACCESS_FINE_LOCATION']
          && result['android.permission.ACCESS_COARSE_LOCATION']
          === 'granted') {
              console.log("모든 권한 획득");
          } else{
              console.log("권한거절");
          }
      })
  }
}

const App = () => {
  const [resultText, setMyText] = useState("Default Text");

  if (Platform.OS === 'android') {
    requestPermission()

    /**
     * @functions clientId, clientSecret, echoCode 를 변경(설정) 하기 위한 android bridge 함수
     * NativeModules.AndroidPlengi.init(clientId, clientSecret, echoCode,
     *   (result) => {
     *     console.log(`init result: ${result}`);
     *   }
     * )
     */

    const onListenSDK = (event) => {
      /**
       * Loplat SDK 의 위치정보가 정상적으로 동작하는지 확인하기 위한 로그
       * console.log('plengiResponse start')
       * console.log(typeof event.plengiResponse)
       * console.log(event.plengiResponse)
       * console.log(event.plengiResponse.type)
       * console.log(event.plengiResponse.placeEvent)
       * console.log(event.plengiResponse.place.category)
       * console.log('plengiResponse finish')
       */

      setMyText(JSON.stringify(event.plengiResponse))
    }

    // Loplat SDK 의 위치정보의 결과 값을 Native(android) 에서 React-Native 로 불러오기 위한 리스너 등록
    DeviceEventEmitter.addListener('listen', onListenSDK);
  }

  return (
    <SafeAreaView style={appStyles.container}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor="#000000" />
      <Text>{resultText}</Text>
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
    if (Platform.OS === 'android') {
      if (props.type === SWITCH_TYPE_LOCATION) {
        /**
         * OS: Android
         * type: SWITCH_TYPE_LOCATION (위치 기반 서비스 동의)
         * value: value (동의 여부)
         * 작성 내용: 위치 기반 서비스 동의에 따른 Loplat SDK 동작
         */
        if (value === true) {
          NativeModules.AndroidPlengi.start(
            (result) => {
              console.log(`start result: ${result}`);
            }
          )
        } else {
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
          NativeModules.AndroidPlengi.enableAdNetwork(value, value)
        } else {
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