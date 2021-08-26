#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <MiniPlengi/MiniPlengi-Swift.h>
#import "sample-Bridging-Header.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
