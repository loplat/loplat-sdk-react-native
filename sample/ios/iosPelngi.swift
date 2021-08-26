//
//  LoplatSdkManager.swift
//  sample
//
//  Created by 정기욱 on 2021/08/23.
//

import Foundation
import MiniPlengi


@objc(iosPlengi)
class iosPlengi: RCTEventEmitter, PlaceDelegate {
  
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

  /// Base overide for RCTEventEmitter.
  ///
  /// - Returns: all supported events
  // we need to override this method and
  // return an array of event names that we can listen to
  override func supportedEvents() -> [String]! {
    return ["onResponsePlaceEvent"]
  }
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
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
