#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"sample"
                                            initialProperties:nil];

  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }
  
  if (@available(iOS 10.0, *)) {
    UNUserNotificationCenter.currentNotificationCenter.delegate = self;
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  if ([Plengi initializeWithClientID:@"loplatdemo"
                clientSecret:@"loplatdemokey"
                          echoCode:NULL] == ResultSUCCESS) {
        // init 성공
        NSLog(@"init 성공");
        [Plengi setIsDebug:YES];

  } else {
        // init 실패
        NSLog(@"init 실패");
  }
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}



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

@end
