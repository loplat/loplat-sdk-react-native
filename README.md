# Plengi SDK for React Native
React Native용 loplat plengi 라이브러리

## Installation
iOS Project -> Podfile 편집 -> pod 'MiniPlengi', '1.4.2.xcode12.5' 추가 (테스트 버전의 경우 pod 'MiniPlengi', '1.4.2.react-native') -> pod install
Android Project -> 

## How to import

### iOS
Xcode .xcworkspace 파일을 오픈하여 info.plist에 다음 권한을 위한 위치 권한 스트링 추가
 - Privacy - Location Always and When In Use Usage Description : '앱의 시나리오에 따른 백그라운드 위치 사용 설명 추가 필수!! ex) 매장 방문 시 할인 쿠폰을 발행하기 위해 백그라운드에서 위치 정보를 사용합니다.'
 - Privacy - Location When In Use Usage Description : '위치 권한 사용 설명 추가'
 - Privacy - Tracking Usage Description : 'IDFA 권한 사용 설명 추가'

TARGETS -> Signing & Capabilities-> +Capability 버튼 -> Access WiFi Information Entitle 추가 (WiFi 연결 정보를 얻어오는 권한)
TARGETS -> Signing & Capabilities-> +Capability 버튼 -> Background Modes, Location updates 추가 (백그라운드 동작)

### Android

#### 1. loplat maven 저장소 추가하기

