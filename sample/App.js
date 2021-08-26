import React, { useState } from "react";
<<<<<<< HEAD
import { Platform, SafeAreaView, Text, StatusBar, Switch, StyleSheet, NativeModules, DeviceEventEmitter, PermissionsAndroid } from "react-native";
=======
import { Platform, SafeAreaView, Text, StatusBar, Switch, StyleSheet, ToastAndroid, Alert, NativeModules, NativeEventEmitter } from "react-native";
>>>>>>> 328c72b9d20ad7462b65acc71f01b5a1e1695308

const SWITCH_TEXT_LOCATION = "위치 기반 서비스 동의"
const SWITCH_TEXT_MARKETING = "마케팅 알림 동의"

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
      //Loplat SDK 의 위치정보가 정상적으로 동작하는지 확인하기 위한 로그
      // console.log('plengiResponse start')
      // console.log(typeof event.plengiResponse)
      // console.log(event.plengiResponse)
      // console.log(event.plengiResponse.type)
      // console.log(event.plengiResponse.placeEvent)
      // console.log('plengiResponse finish')
      if (event.plengiResponse != null) {
        setMyText(JSON.stringify(event.plengiResponse))
      }
    }

    // Loplat SDK 의 위치정보의 결과 값을 Native(android) 에서 React-Native 로 불러오기 위한 리스너 등록
    DeviceEventEmitter.addListener('listen', onListenSDK);
  } else if (Platform.OS === 'ios') {
    // instantiate the event emitter
    const iosPlengi = new NativeEventEmitter(NativeModules.iosPlengi)
    // subscribe to event
    iosPlengi.addListener(
      "onResponsePlaceEvent",
      res => console.log("onResponsePlaceEvent", res.plengiResponse.location)
    )
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
         * type: SWITCH_TYPE_MARKETING (마케팅 알림 동의)
         * value: value (동의 여부)
         * 작성 내용: 마케팅 알림 동의에 따른 Loplat SDK 설정 (Loplat X Campaigns)
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
        if (value == true) {
            // 유저가 위치기반약관을 동의하면 iOS 시스템 위치 권한 요청 및 loplat SDK가 start됩니다.
            NativeModules.iosPlengi.requestAlwaysAuthorization()
            NativeModules.iosPlengi.start( (result) => {
              console.log("start is ", result)
            })
        } else {
            // 유저가 위치기반약관을 철회하면  loplat SDK를 stop 시킵니다.
            NativeModules.iosPlengi.stop( (result) => {
              console.log("stop is ", result)
            })
        }
      }else if(props.type === SWITCH_TYPE_MARKETING){
        /**
         * OS: iOS
         * type: SWITCH_TYPE_MARKETING (마케팅 알림 동의)
         * value: value (동의 여부)
         * 작성 내용: 마케팅 알림 동의에 따른 Loplat SDK 설정 (Loplat X Campaigns)
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