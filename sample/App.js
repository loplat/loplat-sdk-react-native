import React, { useState } from "react";
import { Platform, SafeAreaView, Text, StatusBar, Switch, StyleSheet, NativeModules, DeviceEventEmitter, PermissionsAndroid, NativeEventEmitter } from "react-native";

const SWITCH_TEXT_LOCATION = "위치 기반 서비스 동의"
const SWITCH_TEXT_MARKETING = "마케팅 알림 동의"

const SWITCH_TYPE_LOCATION = 1
const SWITCH_TYPE_MARKETING = 2

/**
 * Android NativeModulse
 * 해당 API는 LoplatAndroidModule.java에 구현되어있음.
 * 
 * 해당 코드의 샘플은 아래에 있음.
 * 
 * NativeModules.AndroidPlengi.init('clientId: String', 'clientSecret: String', 'echo_code: String') // callback으로 결과값이 리턴됩니다. SUCCESS는 0 FAIL은 -1이하의 값을 리턴합니다.
 * NativeModules.AndroidPlengi.start() // callback으로 결과값이 리턴됩니다. SUCCESS는 0 FAIL은 -1이하의 값을 리턴합니다.
 * NativeModules.AndroidPlengi.stop() // callback으로 결과값이 리턴됩니다. SUCCESS는 0 FAIL은 -1이하의 값을 리턴합니다.
 * NativeModules.AndroidPlengi.enableAdNetwork('enableAd: Bool', 'enableNoti: Bool') // enableAd가 true인 경우 loplat X를 사용합니다. enableNoti가 true인 경우 SDK가 알람이벤트를 자체적으로 발생시킵니다.
 * 
 */

/**
 * iOS NativeModulse
 * 해당 API는 iosPlengi.swift에 구현되어있음.
 * 
 * 해당 코드의 샘플은 아래에 있음.
 * 
 * NativeModules.iosPlengi.initialize('clientId: String', 'clientSecret: String', 'echo_code: String') // callback으로 결과값이 리턴됩니다. SUCCESS는 0 FAIL은 -1이하의 값을 리턴합니다.
 * NativeModules.iosPlengi.start() // callback으로 결과값이 리턴됩니다. SUCCESS는 0 FAIL은 -1이하의 값을 리턴합니다.
 * NativeModules.iosPlengi.stop() // callback으로 결과값이 리턴됩니다. SUCCESS는 0 FAIL은 -1이하의 값을 리턴합니다.
 * NativeModules.iosPlengi.enableAdNetwork('enableAd: Bool', 'enableNoti: Bool') // enableAd가 true인 경우 loplat X를 사용합니다. enableNoti가 true인 경우 SDK가 알람이벤트를 자체적으로 발생시킵니다.
 * 
 * NativeModules.iosPlengi.requestAlwaysAuthorization() // 위치 '항상' 권한을 요청합니다. Xcode에서 설정이 필요합니다. 자세한 내용은 개발자 홈페이지(https://developers.loplat.com/ios/#_1) 및 샘플앱의 Xcode 세팅을 참고해주세요.
 * NativeModules.iosPlengi.requestIdfa() // 광고 ID 권한을 요청합니다. Xcode에서 설정이 필요합니다. 자세한 내용은 개발자 홈페이지(https://developers.loplat.com/ios/#_1) 및 샘플앱의 Xcode 세팅을 참고해주세요.
 * NativeModules.iosPlengi.requestAlert() // 알람 권한을 요청합니다.
 * 
 */


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
    ]).then((result) => {
      if (result['android.permission.ACCESS_FINE_LOCATION']
        && result['android.permission.ACCESS_COARSE_LOCATION']
        === 'granted') {
        console.log("모든 권한 획득");
      } else {
        console.log("권한거절");
      }
    })
  }
}

const App = () => {
  const [resultText, setMyText] = useState("장소 인식 결과 ");

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
        // SDK가 위치인식을 하면 결과값을 리턴합니다.
        // 자세한 사항은 https://developers.loplat.com/ 를 참고해주십시오.
        if (event.plengiResponse != null) {
          setMyText(JSON.stringify(event.plengiResponse))
        }
      }
    // Loplat SDK 의 위치정보의 결과 값을 Native(android) 에서 React-Native 로 불러오기 위한 리스너 등록
    DeviceEventEmitter.addListener('listen', onListenSDK);
  } else if (Platform.OS === 'ios') {
      NativeModules.iosPlengi.requestIdfa() // iOS 시스템 IDFA 권한 요청

      /**
      * @functions clientId, clientSecret, echoCode 를 변경(설정) 하기 위한 ios bridge 함수
      * NativeModules.iosPlengi.init(clientId, clientSecret, echoCode,
      *   (result) => {
      *     console.log(`init result: ${result}`);
      *   }
      * )
      */
      const onListenSDK = (event) => {
        // SDK가 위치인식을 하면 결과값을 리턴합니다.
        // 자세한 사항은 https://developers.loplat.com/ 를 참고해주십시오.
        if (event.plengiResponse != null) {            
          setMyText(JSON.stringify(event.plengiResponse))
        }
      }

      // instantiate the event emitter
      const iosPlengi = new NativeEventEmitter(NativeModules.iosPlengi)
      // subscribe to event
      iosPlengi.addListener("onResponsePlaceEvent", onListenSDK);
  }

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
      <Text>{resultText}</Text>
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
          // 반드시 유저가 위치 약관을 동의한 이후 start를 호출해 주세요.
          // start()는 여러번 호출되어도 한번만 동작됩니다.
          NativeModules.AndroidPlengi.start(
            (result) => {
              console.log(`start result: ${result}`); // result가 0면 SUCCESS 이하의 음수 값은 FAIL
            }
          )
        } else {
          NativeModules.AndroidPlengi.stop(
            (result) => {
              console.log(`stop result: ${result}`); // result가 0면 SUCCESS 이하의 음수 값은 FAIL
            }
          )
        }
      } else if (props.type === SWITCH_TYPE_MARKETING) {
        /**
         * OS: Android
         * type: SWITCH_TYPE_MARKETING (마케팅 알림 동의)
         * value: value (동의 여부)
         * 작성 내용: 마케팅 알림 동의에 따른 Loplat SDK 설정 (Loplat X Campaigns)
         */
        if (value === true) {
          // 유저가 마케팅 권한을 동의하는 경우 enableAdNetwork를 호출해줍니다.
          NativeModules.AndroidPlengi.enableAdNetwork(value, value)
        } else {
          // SDK의 자체 알림을 사용하지않고, PlengiResponse.advertisement의 정보를 이용해 자체 알림을 사용할 경우 두번째 파라미터를 false로 세팅해주세요.
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
        if (value == true) {
            // 유저가 위치기반약관을 동의하면 iOS 시스템 위치 권한 요청 및 loplat SDK가 start됩니다.
            NativeModules.iosPlengi.requestAlwaysAuthorization()

            // 반드시 유저가 위치 약관을 동의한 이후 start를 호출해 주세요.
            // start()는 중복호출되어도 한번만 호출됩니다.
            NativeModules.iosPlengi.start( (result) => {
              console.log(`start result: ${result}`); // result가 0면 SUCCESS 이하의 음수 값은 FAIL
            })
        } else {
            // 유저가 위치기반약관을 철회하면  loplat SDK를 stop 시킵니다.
            NativeModules.iosPlengi.stop( (result) => {
              console.log(`stop result: ${result}`); // result가 0면 SUCCESS 이하의 음수 값은 FAIL
            })
        }
      } else if(props.type === SWITCH_TYPE_MARKETING){
        /**
         * OS: iOS
         * type: SWITCH_TYPE_MARKETING (마케팅 알림 동의)
         * value: value (동의 여부)
         * 작성 내용: 마케팅 알림 동의에 따른 Loplat SDK 설정 (Loplat X Campaigns)
         * 설명 : loplat X를 사용하고 유저가 마케팅 알림을 동의하는 경우 
         *       NativeModules.iosPlengi.enableAdNetwork(value, value)를 호출합니다.
         */

        // iOS 시스템 알림 권한을 요청합니다.
         NativeModules.iosPlengi.requestAlert()

         // 유저가 마케팅 권한을 동의하는 경우 enableAdNetwork를 호출해줍니다.
         if (value === true) {
          NativeModules.iosPlengi.enableAdNetwork(value, value)
        } else {
          // SDK의 자체 알림을 사용하지않고, PlengiResponse.advertisement의 정보를 이용해 자체 알림을 사용할 경우 두번째 파라미터를 false로 세팅해주세요.
          NativeModules.iosPlengi.enableAdNetwork(value, false)
        }
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
    margin: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start'
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