# Plengi SDK for React Native

React Native loplat plengi Native Modules 가이드
<br/>


## Installation

- 상세한 내용은 [로플랫 개발자](https://developers.loplat.com) 페이지 참고 바랍니다.

<br/>

## Cautions

- 해당 샘플 프로젝트에 적용된 SDK는 TEST 버전 SDK 입니다. (자체 디버그용 UI 포함 및 로깅으로 인한 부하가 있으므로 테스트 용도로만 사용바람)
- 프로덕션 SDK는 [로플랫 개발자](https://developers.loplat.com) 에 안내되어 있습니다.
- Native Modules만 샘플프로젝트를 참고하여 적용해 주시기 바랍니다.
- 샘플앱에 React Native (Javascript) 에 작성된 코드는 Foreground 일 때만 동작합니다. (Background 에서는 Emitter, Callback 등 실행 안됨)
- Background 일 때 필요한 기능은 React Native (Javascript) 가 아닌 Native Module 에 작성해주시기 바랍니다.

<br/>

## How to import

기본적인 프로젝트 세팅은 [로플랫 개발자](https://developers.loplat.com) 에 안내되어 있습니다. (디펜던시 추가, 프로젝트 세팅, 권한 추가 등)

로플랫 SDK를 포함시키기 위하여 Android, iOS 각각의 Native Modules(브릿지 함수)를 작성해야 합니다.

<br/>



### Android Native Modules

#### 로플랫 SDK 사용

##### 필수 구현 파일

- LoplatAndroidModule.java
- LoplatAndroidPackage.java
- MainApplication.java

<br/>

##### LoplatAndroidModule

`LoplatAndroidModule.java` 에 React-Native 에서 로플랫 SDK 의 함수를 호출하기 위한 코드를 작성합니다.

```java
@Override
public String getName() {
    return “AndroidPlengi”;
}
@ReactMethod
public void init(String clientId, String clientSecret, String echoCode, Callback callback) {
    ...
}
@ReactMethod
public void start(Callback callback) {
    ...
}
@ReactMethod
public void stop(Callback callback) {
    ...
}
@ReactMethod
public void enableAdNetwork(boolean isEnableAdNetwork, boolean isEnableLoplatX)
```

<br/>

이때 아래와 같이 작성한 코드는 React-Native 에서 `NativeModules.모듈명.함수명()` 이렇게 사용됩니다.

```java
@Override
public String getName() {
    return “모듈명“;
}
@ReactMethod
public void 함수명() {
}
```

<br/>



##### LoplatAndroidPackage

`LoplatAndroidPackage.java` 에 모듈클래스인 `LoplatAndroidModule.java` 를 추가합니다.

```java
@Override
public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new LoplatAndroidModule(reactContext)); // 모듈 클래스 추가
    return modules;
}
```

<br/>



##### MainApplication

`MainApplication.java` 에 패키지클래스인 `LoplatAndroidPackage.java`를 추가합니다.

```java
private final ReactNativeHost mReactNativeHost =
        new ReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }
            @Override
            protected List<ReactPackage> getPackages() {
                @SuppressWarnings(“UnnecessaryLocalVariable”)
                List<ReactPackage> packages = new PackageList(this).getPackages();
                packages.add(new LoplatAndroidPackage()); // 패키지 클래스 추가한다.
                return packages;
            }
            @Override
            protected String getJSMainModuleName() {
                return “index”;
            }
        };
```
<br/>

##### React-Native 에서의 사용

- NativeModules.AndroidPlengi.init(‘clientId: String’, ‘clientSecret: String’, ‘echo_code: String’)
  - callback으로 결과값이 리턴됩니다. SUCCESS는 0 FAIL은 -1이하의 값을 리턴합니다.
- NativeModules.AndroidPlengi.start()
  - callback으로 결과값이 리턴됩니다. SUCCESS는 0 FAIL은 -1이하의 값을 리턴합니다.
- NativeModules.AndroidPlengi.stop()
  - callback으로 결과값이 리턴됩니다. SUCCESS는 0 FAIL은 -1이하의 값을 리턴합니다.
- NativeModules.AndroidPlengi.enableAdNetwork(‘enableAd: Bool’, ‘enableNoti: Bool’)
  - enableAd가 true인 경우 loplat X를 사용합니다. enableNoti가 true인 경우 SDK가 알람이벤트를 자체적으로 발생시킵니다.

<br/>

#### 장소 인식 결과를 사용

##### 필수 구현 파일

- LoplatPlengiListener.java

<br/>

##### LoplatPlengiListener

`LoplatPlengiListener.java` 에서 받은 위치 정보 값을 포맷에 맞게 변환 후 React-Native 의 함수에 값을 넣어 호출

```java
@Override
public void listen(PlengiResponse response) {
    // Loplat SDK 로부터 위치 정보를 받은 후 React-Native 에 값을 넘김
    try {
        Gson gson = new Gson();
        String json = gson.toJson(response);
        JsonObject gsonObject = new JsonParser().parse(json).getAsJsonObject();
        JSONObject jsonObject = new JSONObject(gsonObject.toString());
        WritableMap map = convertJsonToMap(jsonObject);
        WritableMap params = Arguments.createMap();
        params.putMap(“plengiResponse”, map);
        ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        if(reactContext != null){
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(“listen”, params);
        }else{
            reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                @Override
                public void onReactContextInitialized(ReactContext context) {
                    context
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(“listen”, params);
                }
            });
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

<br/>

```javascript
const onListenSDK = (event) => {
    // SDK가 위치인식을 하면 결과값을 리턴합니다.
    // 자세한 사항은 https://developers.loplat.com/ 를 참고해주십시오.
    if (event.plengiResponse != null) {
      setMyText(JSON.stringify(event.plengiResponse))
    }
}
```

<br/>
<br/>


### iOS Native Modules

1. AppDelegate.h 함수에 MiniPlengi, Bridgin-Header.h import및 필수 함수 구현

```objective-c
#import <MiniPlengi/MiniPlengi-Swift.h>
#import "프로젝트명-Bridging-Header.h"
@import UserNotifications;

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>
```

위와 같이 Appdelegate.h 함수에 MiniPlengi, Bridging-Header, UserNotification을 import 한 후, AppDelegate interface에서도 UNUserNotificationCenterDelegate 프로토콜을 채택해 주세요. (loplat X 사용을 위한 알림처리)

<br/>



2. AppDelegate.m 함수의 \- (**BOOL**)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions 함수 내부에서 아래의 내용을 필수로 호출해 주십시오.

   ```objective-c
   - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
   		if (@available(iOS 10.0, *)) {
       	UNUserNotificationCenter.currentNotificationCenter.delegate = self;
   		}
   		
   		if ([Plengi initializeWithClientID:@"클라이언트 ID"
                   clientSecret:@"클라이언트 Secret"
                             echoCode:NULL] == ResultSUCCESS) {
           // init 성공
           NSLog(@"init 성공");
           //[Plengi setIsDebug:YES]; 테스트 SDK의 경우만 포함
   
     		} else {
           // init 실패
           NSLog(@"init 실패");
     		}
   }
   
   ```

   
<br/>


3. loplat X를 알림 서비스를 사용하시면 아래의 내용도 AppDelegate.m에 추가하여야 합니다.

   ```objective-c
   - (void)application:(UIApplication *)application
   handleActionWithIdentifier:(NSString *)identifier
       forLocalNotification:(UILocalNotification *)notification
           completionHandler:(void (^)())completionHandler {
     [Plengi processLoplatAdvertisement:application
             handleActionWithIdentifier:identifier
                         for:notification
                 completionHandler:completionHandler];
   }
   
   - (void)userNotificationCenter:(UNUserNotificationCenter *)center
          willPresentNotification:(UNNotification *)notification
            withCompletionHandler:(void  (^)(UNNotificationPresentationOptions))completionHandler API_AVAILABLE(ios(10.0)) {
       completionHandler(UNNotificationPresentationOptionAlert |
                         UNNotificationPresentationOptionBadge |
                         UNNotificationPresentationOptionSound);
   }
   
   
   - (void)userNotificationCenter:(UNUserNotificationCenter *)center
   didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void  (^)(void))completionHandler API_AVAILABLE(ios(10.0)) {
   
     [Plengi processLoplatAdvertisement:center
                 didReceive:response
                 withCompletionHandler:completionHandler];
     completionHandler();
     // loplat SDK가 사용자의 알림 트래킹 (Click, Dismiss) 를 처리하기 위한 코드
   }
   ```

<br/>



4. 프로젝트명-Bridging-Header.h에서는 NatvieModule 구현을 위해 아래의 React 모듈을 import 해주세요.

   ```objective-c
   #import "React/RCTBridgeModule.h"
   #import "React/RCTEventEmitter.h"
   ```
<br/>
   
   


5. iOS NativeModule 구현을 위해서는 샘플 프로젝트에서 아래의 4개의 파일을 참고하여 해당 내용을 필수로 구현해주어야합니다.

- RCTiosPlengiModule.h 
- RCTiosPlengiModule.m // iosPlengi.swift 파일의 구현 내용을 React-Native에서 사용할 수 있도록 하는 Objc 매크로
- iosPelngi.swift // iOS SDK 랩핑 클래스
- PlengiResponseForJS.swift // PlengiResponse를 JS에서 사용할 수 있도록 타입 변환하는 객체

<br/>

```swift
@objc(iosPlengi)
class iosPlengi: RCTEventEmitter, PlaceDelegate {
  // PlengiResponse를 위한 함수
  // 아래 함수 3개를 구현해야지 React-Native에서 위치 인식 결과를 콜백으로 리턴 받을 수 있습니다. 
  func responsePlaceEvent(_ plengiResponse: PlengiResponse) {
      let encoder = JSONEncoder()
      let plengiResponseForJS = PlengiResponseForJS(plengiResponse: plengiResponse)
      
      do {
          let json = try encoder.encode(plengiResponseForJS)
          do {
            let jsonData = try JSONSerialization.jsonObject(with: json, options: [])
            if let jsonDictionary = jsonData as? [String: Any] {
              sendEvent(withName: "onResponsePlaceEvent", body: ["plengiResponse": jsonDictionary])
            }
          } catch {
            sendEvent(withName: "onResponsePlaceEvent", body: ["error": "Swift to JSON Serialization Error"])
          }
      } catch {
        sendEvent(withName: "onResponsePlaceEvent", body: ["error": "Swift to JSON Encoding Error"])
      }
  }
  
  override init() {
      super.init()
      _ = Plengi.setDelegate(self)
  }

  override func supportedEvents() -> [String]! {
    return ["onResponsePlaceEvent"]
  }  
  
	// iOS SDK API
	@objc(start:)
  func start(_ callback: RCTResponseSenderBlock) {
    let result = Plengi.start()
    callback([result.rawValue])
  }
  
  @objc(stop:)
  func stop(_ callback: RCTResponseSenderBlock) {
    let result = Plengi.stop()
    callback([result.rawValue])
  }
  
  @objc(enableAdNetwork:enableNoti:)
  func enableAdNetwork(_ enableAd: Bool, enableNoti: Bool) {
    _ = Plengi.enableAdNetwork(enableAd, enableNoti: enableNoti)
  }

  ...
}
```

<br/>

```objective-c
// RCTCalendarModule.m에 작성된 내용
#import "RCTiosPlengiModule.h"
#import "React/RCTBridgeModule.h"
#import "React/RCTEventEmitter.h"
#import <React/RCTLog.h>

@interface RCT_EXTERN_MODULE(iosPlengi, RCTEventEmitter)

RCT_EXTERN_METHOD(initialize:(NSString *)clientId clientSecret:(NSString *)clientSecret: callback:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(start:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(stop:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(enableAdNetwork:(BOOL *)enableAd enableNoti:(BOOL *)enableNoti)
RCT_EXTERN_METHOD(requestAlwaysAuthorization)
RCT_EXTERN_METHOD(requestIdfa)
RCT_EXTERN_METHOD(requestAlert)
RCT_EXTERN_METHOD(supportedEvents)

@end

```

<br/>

6. 상위 4개 파일을 구현하면 아래와 같이 iOS SDK의 Native 함수를 다음과 같이 React-Native에서 호출할 수 있습니다.

   ```javascript
   if (value == true) {
    // 유저가 위치기반약관을 동의하면 iOS 시스템 위치 권한 요청 및 loplat SDK가 start됩니다.
    NativeModules.iosPlengi.requestAlwaysAuthorization()
   
    // 반드시 유저가 위치 약관을 동의한 이후 start를 호출해 주세요.
    // start()는 여러번 호출되어도 한번만 호출됩니다.
    NativeModules.iosPlengi.start( (result) => {
       console.log(`start result: ${result}`); // result가 0면 SUCCESS 이하의 음수 값은 FAIL
    })
   } else {
     // 유저가 위치기반약관을 철회하면  loplat SDK를 stop 시킵니다.
     NativeModules.iosPlengi.stop( (result) => {
        console.log(`stop result: ${result}`); // result가 0면 SUCCESS 이하의 음수 값은 FAIL
     })
   }
   ```

