//
//  PlengiResponseForJS.swift
//  sample
//
//  Created by 정기욱 on 2021/08/26.
//
import MiniPlengi
import Foundation

enum Result: Int {
    case SUCCESS = 0
    case FAIL = -1
    case PENDING = -2
    case NETWORK_FAIL = -3
    case ERROR_CLOUD_ACCESS = -4;
    case FAIL_INTERNET_UNAVAILABLE = -5;
    case FAIL_WIFI_SCAN_UNAVAILABLE = -6;
    case NOT_SUPPORTED_OS_VERSION = -7;
    case ALREADY_STARTED = -8;
    case NOT_INITIALIZED = -9;
}

@objc public enum PlaceEvent: Int {
    case NOT_AVAILABLE = 0
    case ENTER = 1
    case LEAVE = 2
    case NEARBY = 3
}

@objc public enum ResponseType: Int {
    case UNKNOWN = 0;
    case PLACE = 1
    case PLACE_EVENT = 2
    case CELL_LOCATION_EVENT = 3
    case IP_LOC_EVENT = 4
}

struct PlengiResponseForJS: Codable {
    
    var echoCode:    String? = nil
    var errorReason: String? = nil
    
    var result     = Result.SUCCESS.rawValue
    var type       = ResponseType.UNKNOWN.rawValue
    var placeEvent = PlaceEvent.NOT_AVAILABLE.rawValue
    
    var place:    PlaceForJS? = nil
    var area:     AreaForJS? = nil
    var complex:  ComplexForJS? = nil
    var geofence: GeofenceForJS? = nil
    var nearbys:  Array<NearbysForJS>? = nil
    var district: DistrictForJS? = nil
    
    var advertisement: AdvertisementForJS? = nil
    var location: LocationForJS? = nil
  
    init(plengiResponse: PlengiResponse) {
      self.echoCode = plengiResponse.echoCode
      self.errorReason = plengiResponse.errorReason
      
      self.result = plengiResponse.result.rawValue
      self.type = plengiResponse.type.rawValue
      self.placeEvent = plengiResponse.placeEvent.rawValue
      
      self.place = plengiResponse.place == nil ? nil : PlaceForJS(place: plengiResponse.place)
      self.area =  plengiResponse.area == nil ? nil : AreaForJS(area: plengiResponse.area)
      self.complex = plengiResponse.complex == nil ? nil : ComplexForJS(complex: plengiResponse.complex)
      self.geofence = plengiResponse.geofence == nil ? nil : GeofenceForJS(geofence: plengiResponse.geofence)
      
      self.nearbys = plengiResponse.nearbys == nil ? nil : plengiResponse.nearbys?.map { NearbysForJS(nearbys: $0) }
      self.district = plengiResponse.district == nil ? nil : DistrictForJS(district: plengiResponse.district)
      
      self.advertisement = plengiResponse.advertisement == nil ? nil : AdvertisementForJS(advertisemend: plengiResponse.advertisement)
      self.location = plengiResponse.location == nil ? nil : LocationForJS(location: plengiResponse.location)
    }
  
    struct PlaceForJS: Codable {
        var loplat_id: Int = 0
        
        var name:  String = ""
        var tags:  String = ""
        var distance: Int = 0  // 1. In, 2. Border, 3. Nearby, 4. Far
        var floor:    Int = 0
        var lat:   Double = 0.0
        var lng:   Double = 0.0
        
        var accuracy:      Double = 0.0
        var threshold:     Double = 0.0
        var client_code:   String = ""
        var category:      String = ""
        var category_code: String = ""
        
        var address:       String = ""
        var address_road:  String = ""
        var post:          String = ""
      
        init(place: Place?) {
          self.loplat_id = place?.loplat_id ?? 0
          
          self.name = place?.name ?? ""
          self.tags = place?.tags ?? ""
          self.distance  = place?.distance ?? 0
          self.floor  = place?.floor ?? 0
          self.lat  = place?.lat ?? 0.0
          self.lng  = place?.lng ?? 0.0
          
          self.accuracy  = place?.accuracy ?? 0.0
          self.threshold  = place?.threshold ?? 0.0
          self.client_code  = place?.client_code ?? ""
          self.category  = place?.category ?? ""
          self.category_code  = place?.category_code ?? ""
          
          self.address  = place?.address ?? ""
          self.address_road  = place?.address_road ?? ""
          self.post  = place?.post ?? ""
        }
    }
  
    struct AreaForJS: Codable {
        var id:    Int    = 0
        var name:  String = ""
        var tag:   String = ""
        var lat:   Double = 0.0
        var lng:   Double = 0.0
      
        init(area: Area?) {
          self.id = area?.id ?? 0
          self.name = area?.name ?? ""
          self.tag = area?.tag ?? ""
          self.lat = area?.lat ?? 0.0
          self.lng = area?.lng ?? 0.0
        }
    }

  
    struct ComplexForJS: Codable {
        var id:            Int    = 0
        var name:          String = ""
        var branch_name:   String = ""
        var category:      String = ""
        var category_code: String = ""
      
        init(complex: Complex?) {
          self.id = complex?.id ?? 0
          self.name = complex?.name ?? ""
          self.branch_name = complex?.branch_name ?? ""
          self.category = complex?.category ?? ""
          self.category_code = complex?.category_code ?? ""
        }
    }
  
    struct FenceForJS: Codable {
      
        var gfid:        Int    = 0
        var dist:        Double = 0.0
        var name:        String = ""
        var client_code: String = ""
      
        init(fence: Fence?) {
          self.gfid = fence?.gfid ?? 0
          self.dist = fence?.dist ?? 0.0
          self.name = fence?.name ?? ""
          self.client_code = fence?.client_code ?? ""
        }
    }

    struct GeofenceForJS: Codable {
      
        var lat: Double = 0.0
        var lng: Double = 0.0
        var fences = Array<FenceForJS>()
      
        init(geofence: Geofence?) {
          self.lat = geofence?.lat ?? 0.0
          self.lng = geofence?.lng ?? 0.0
          let fences = geofence?.fences.map { FenceForJS(fence: $0) }
          self.fences = fences ?? []
        }
    }
  
    struct NearbysForJS: Codable {
        var loplat_id: Int    = 0
        var placename: String = ""
        var tags:      String = ""
        var floor:     Int    = 0
        var lat:       Double = 0.0
        var lng:       Double = 0.0
        var accuracy:  Double = 0.0
      
        init(nearbys: Nearbys?) {
          self.loplat_id = nearbys?.loplat_id ?? 0
          self.placename = nearbys?.placename ?? ""
          self.tags = nearbys?.tags  ?? ""
          self.floor = nearbys?.floor ?? 0
          self.lat = nearbys?.lat ?? 0.0
          self.lng = nearbys?.lng ?? 0.0
          self.accuracy = nearbys?.accuracy ?? 0.0
        }
    }

    struct DistrictForJS: Codable {
        var lv0_code: String = ""
        var lv1_name: String = ""
        var lv2_name: String = ""
        var lv3_name: String = ""
        var lv1_code: String = ""
        var lv2_code: String = ""
        var lv3_code: String = ""
      
        init(district: District?) {
          self.lv0_code = district?.lv0_code ?? ""
          self.lv1_name = district?.lv1_name ?? ""
          self.lv2_name = district?.lv2_name ?? ""
          self.lv3_name = district?.lv3_name ?? ""
          self.lv1_code = district?.lv1_code ?? ""
          self.lv2_code = district?.lv2_code ?? ""
          self.lv3_code = district?.lv3_code ?? ""
        }
    }
  
    struct AdvertisementForJS: Codable {
        var alarm:       String  = ""
        var title:       String? = nil
        var body:        String? = nil
        var img:         String  = ""
        var campaign_id: Int     = 0
        var delay:       Int     = 0
        var delay_type:  String  = ""
        var intent:      String  = ""
        var msg_id:      Int     = 0
        var target_pkg:  String  = ""
        var client_code: String  = ""
      
        init(advertisemend: Advertisement?) {
            self.alarm = advertisemend?.alarm ?? ""
            self.title = advertisemend?.title
            self.body = advertisemend?.body
            self.img = advertisemend?.img ?? ""
            self.campaign_id = advertisemend?.campaign_id ?? 0
            self.delay = advertisemend?.delay ?? 0
            self.delay_type = advertisemend?.delay_type ?? ""
            self.intent = advertisemend?.intent ?? ""
            self.msg_id = advertisemend?.msg_id ?? 0
            self.target_pkg = advertisemend?.target_pkg ?? ""
            self.client_code = advertisemend?.client_code ?? ""
        }
    }
  
    struct LocationForJS: Codable {
        var provider = "loplat"
        var floor:       Int = 0
        var time:      Int64 = 0
        var lat:      Double = 0.0
        var lng:      Double = 0.0
        var accuracy: Double = 0.0
      
        init(location: Location?) {
          self.provider = location?.provider ?? "loplat"
          self.floor = location?.floor ?? 0
          self.time = location?.time ?? 0
          self.lat = location?.lat ?? 0.0
          self.lng = location?.lng ?? 0.0
          self.accuracy = location?.accuracy ?? 0.0
        }
    }
}

