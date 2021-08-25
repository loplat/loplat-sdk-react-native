//
//  LoplatSdkManager.swift
//  sample
//
//  Created by 정기욱 on 2021/08/23.
//

import Foundation
import MiniPlengi


@objc(iosPlengi)
class iosPlengi: NSObject {
  
  override init() {
    super.init()
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc(initialize:clientSecret:callback:)
  func initialize(_ clientId: String, clientSecret: String, callback: RCTResponseSenderBlock) {
    let result = Plengi.initialize(clientID: clientId, clientSecret: clientSecret, echoCode: nil)
    callback([result.rawValue])
  }
  
  @objc(initialize:clientSecret:echoCode:callback:)
  func initialize(_ clientId: String, clientSecret: String, echoCode: String, callback: RCTResponseSenderBlock) {
    let result = Plengi.initialize(clientID: clientId, clientSecret: clientSecret, echoCode: echoCode)
    callback([result.rawValue])
  }
  
  @objc(start:)
  func start(_ callback: RCTResponseSenderBlock) {
    let result = Plengi.start()
    callback([result.rawValue])
    //callback([NSNull(), ["result": result.rawValue]])
    
    
  }
  
  @objc(stop:)
  func stop(_ callback: RCTResponseSenderBlock) {
    let result = Plengi.stop()
    callback([result.rawValue])
    //callback([NSNull(), ["result": result.rawValue]])
    
  }
  
  @objc(enableAdNetwork:enableNoti:)
  func enableAdNetwork(_ enableAd: Bool, enableNoti: Bool) {
    _ = Plengi.enableAdNetwork(enableAd, enableNoti: enableNoti)
  }
  
  @objc(requestAlwaysAuthorization)
  func requestAlwaysAuthorization() {
    Plengi.requestAlwaysLocationAuthorization()
  }
}
