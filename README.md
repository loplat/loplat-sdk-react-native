# Plengi SDK for React Native

React Native loplat plengi Native Modules 가이드

## Installation

- 상세한 내용은 [로플랫 개발자](https://developers.loplat.com) 페이지 참고 바랍니다.

## Cautions

- 해당 샘플 프로젝트에 적용된 SDK는 TEST 버전 SDK 입니다. (자체 디버그용 UI 포함 및 로깅으로 인한 부하가 있으므로 테스트 용도로만 사용바람)
- 프로덕션 SDK는 [로플랫 개발자](https://developers.loplat.com) 에 안내되어 있습니다.
- 샘플앱의 Native Modules만 참고하여 적용해 주시기 바랍니다.

## How to import

기본적인 프로젝트 세팅은 [로플랫 개발자](https://developers.loplat.com) 에 안내되어 있습니다. (디펜던시 추가, 프로젝트 세팅, 권한 추가 등)

로플랫 SDK를 포함시키기 위하여 Android, iOS 각각의 Native Modules(브릿지 함수)를 작성해야 합니다.



### Android Native Modules



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

