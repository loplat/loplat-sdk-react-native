#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <MiniPlengi/MiniPlengi-Swift.h>
#import "sample-Bridging-Header.h"
@import UserNotifications;

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
