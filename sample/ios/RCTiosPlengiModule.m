//
//  RCTLoplatSdkManagerModule.m
//  sample
//
//  Created by 정기욱 on 2021/08/23.
//

// RCTCalendarModule.m
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
RCT_EXTERN_METHOD(supportedEvents)
@end

