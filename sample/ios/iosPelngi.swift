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
  
  @objc(initialize:clientSecret:)
  func initialize(_ clientId: String, clientSecret: String) {
    _ = Plengi.initialize(clientID: clientId, clientSecret: clientSecret, echoCode: nil)
  }
  
  @objc(initialize:clientSecret:echoCode:)
  func initialize(_ clientId: String, clientSecret: String, echoCode: String) {
    _ = Plengi.initialize(clientID: clientId, clientSecret: clientSecret, echoCode: echoCode)
  }
  
  @objc(start)
  func start() {
    _ = Plengi.start()
  }
  
  @objc(stop)
  func stop() {
    _ = Plengi.stop()
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
