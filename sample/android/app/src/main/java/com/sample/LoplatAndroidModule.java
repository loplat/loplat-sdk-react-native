package com.sample;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.core.PermissionListener;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResult;
import com.google.android.gms.location.LocationSettingsStatusCodes;
import com.loplat.placeengine.Plengi;

public class LoplatAndroidModule extends ReactContextBaseJavaModule implements ActivityEventListener, PermissionListener, GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener  {

    private static ReactApplicationContext reactContext;

    private static final int UPDATE_INTERVAL_MS = 1000;  // 1초
    private static final int FASTEST_UPDATE_INTERVAL_MS = 500; // 0.5초
    private static final int REQUEST_LOCATION_PERMISSION = 10000;
    private static final int REQUEST_LOCATION_STATUS = 10001;
    private static final int REQUEST_WIFI_STATUS = 10002;

    GoogleApiClient mGoogleApiClient;

    LocationRequest locationRequest = new LocationRequest()
            .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
            .setInterval(UPDATE_INTERVAL_MS)
            .setFastestInterval(FASTEST_UPDATE_INTERVAL_MS);

    public LoplatAndroidModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "AndroidPlengi";
    }

    @ReactMethod
    public void init(String clientId, String clientSecret, String echoCode, Callback callback) {
         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            /**
             * 백그라운드에서 동작 시 출력될 ForgroundService의 알림 설정
             * 따로 설정하지 않으면 기본 값으로 출력
             *
             * 특정 요소만 custom하기 원한다면 아래와 같이 resource 입력
             * 기본 값을 쓰기 원하는 요소엔 0 입력
             */
             Plengi.getInstance(reactContext).setDefaultNotificationChannel(R.string.foreground_service_noti_channel_name,0);
             Plengi.getInstance(reactContext).setDefaultNotificationInfo(
                    R.drawable.ic_launcher,
                    R.string.foreground_service_noti_title,
                    0);
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            /**
             * 위치 권한-항상허용 심사 관련 설정
             * Loplat이 제공하는 심사용 프롬프트를 사용하지 않고 자체 프롬프트를 사용할 경우에만
             * Plengi.disableFeatureBgLocationReviewUX(true) 호출
             *
             * Loplat이 제공하는 심사용 프롬프트 중 사용자에게 표시되는 명시적인 인앱 공개 대화상자를
             * custom 필요시 Plengi.setBackgroundLocationAccessDialogLayout(@LayoutRes) 호출
             */
            Plengi.getInstance(reactContext).setBackgroundLocationAccessDialogLayout(R.layout.dialog_background_location_info);
        }

        // Loplat SDK 설정들은 반드시 Plengi.init() 전에 호출 필요
        Toast.makeText(reactContext, "init", Toast.LENGTH_SHORT).show();
        int result = Plengi.getInstance(reactContext).init(clientId, clientSecret, echoCode);
        Log.d("LOGTAG/INIT", String.valueOf(result));
        callback.invoke(result);
    }

    @ReactMethod
    public void start(Callback callback) {
        // 로플랫 SDK start
        Toast.makeText(reactContext, "start", Toast.LENGTH_SHORT).show();
        int result = Plengi.getInstance(reactContext).start();
        Log.d("LOGTAG/START", String.valueOf(result));
        callback.invoke(result);
    }

    @ReactMethod
    public void stop(Callback callback) {
        // 로플랫 SDK stop
        Toast.makeText(reactContext, "stop", Toast.LENGTH_SHORT).show();
        int result = Plengi.getInstance(reactContext).stop();
        Log.d("LOGTAG/STOP", String.valueOf(result));
        callback.invoke(result);
    }

    @ReactMethod
    public void enableAdNetwork(boolean isEnableAdNetwork, boolean isEnableLoplatX) {
        Toast.makeText(reactContext, "enableAdNetwork:"+ isEnableAdNetwork + isEnableLoplatX, Toast.LENGTH_SHORT).show();
        Plengi.getInstance(reactContext).enableAdNetwork(isEnableAdNetwork, isEnableLoplatX);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_LOCATION_PERMISSION) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (reactContext.checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    locationPermissionGranted();
                } else if (reactContext.checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_DENIED) {
                    locationPermissionDenied();
                }
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    private boolean locationPermissionGranted() {
        Toast.makeText(reactContext, reactContext.getText(R.string.toast_location_message_agree), Toast.LENGTH_SHORT).show();
        Plengi.getInstance(reactContext).start();

        /**
         * loplat SDK는 위치 permission, GPS setting가 WiFi scan을 할 수 없더라도 start된 상태를 유지하고
         * 위치 permission, GPS setting에 따라 WiFi scan이 가능한 상황이 되면 실제 동작.
         * 앱에 로플랫 SDK 적용시 약관의 위치서비스 동의한 사용자에게 설정 변경을 쉽게 할 수 있도록
         * checkWiFiScanCondition 활용해주세요.
         */
        checkLocationScanCondition();
        return true;
    }

    private boolean locationPermissionDenied() {
        Toast.makeText(reactContext, reactContext.getText(R.string.toast_location_message_revoke), Toast.LENGTH_SHORT).show();
        Plengi.getInstance(reactContext).stop();
        return false;
    }

    /**
     * 위치 인식을 할 수 있는 상태인지 확인
     */
    private boolean checkLocationScanCondition() {
        boolean available = true;
        if (!checkLocationPermissionIfNeeded()) {
            // 위치 권한 상태 확인

            available = false;
            Toast.makeText(reactContext, reactContext.getText(R.string.request_location_permission), Toast.LENGTH_SHORT).show();
        } else if (!checkGpsStatus()) {
            // GPS 활성화 상태 확인

            available = false;
            Toast.makeText(reactContext, reactContext.getText(R.string.request_gps), Toast.LENGTH_SHORT).show();

            /* GPS 켜는 방법은 google play service를 통해 앱내에서 직접 설정, GPS 설정화면 이용 등 2가지 방법이 있음
               현재 sample code에서는 google play service를 이용하는 방법으로 작성되었음
               google-play-service를 사용하지 않고 GPS 설정화면을 넘기는 경우에는 아래 주석처리된 코드 참조 바람

               google play service(location) 사용하는 경우 -> dependency google-play-services 선언이 필요함
               compile 'com.google.android.gms:play-services:[latest version]'
            */
            if (GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(reactContext.getApplicationContext()) == ConnectionResult.SUCCESS) {
                if (isGoogleClientConnected()) {
                    turnGpsOnByGooglePlayService();
                } else {
                    connectGoogleClient();
                }
            }

            // GPS 설정화면을 이용하는 방법
            /*Intent intent = new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS);
            intent.addCategory(Intent.CATEGORY_DEFAULT);
            startActivity(intent);*/

        } else if (!checkWifiScanIsAvailable()) {
            // Wi-Fi 스캔 가능 여부 확인

            available = false;
            /**
             * 안드로이드 4.3 이상 버전은 background wifi scan 설정이 켜져있으면 됨
             * 확인 방법
             * 1. 삼성 계열 폰:
             *  - [설정] -> [연결] -> [위치] -> [정확도 향상] -> WiFi 찾기 On
             *  - [설정] -> [개인정보 보호 및 안전] -> [위치] -> [정확도 향상] -> WiFi 찾기 On
             * 2. LG 계열 폰: [설정] -> [잠금화면 및 보안] -> [프라이버시, 위치정보] -> [고급 검색] -> WiFi 찾기 On
             * 공장 초기화 기준 해당 옵션의 default 값은 On 입니다
             * [참고: https://developer.android.com/reference/android/net/wifi/WifiManager.html#isScanAlwaysAvailable()]
             */
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
                Intent intent = new Intent(WifiManager.ACTION_REQUEST_SCAN_ALWAYS_AVAILABLE);
                getCurrentActivity().startActivityForResult(intent, REQUEST_WIFI_STATUS);
            } else {
                // 안드로이드 4.2 이하 버전은 WiFi가 켜져있어야 wifi scanning 가능함
                WifiManager wifiManager = (WifiManager) reactContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
                wifiManager.setWifiEnabled(true);
            }
        }
        return available;
    }

    /**
     * 위치 권한 활성화 여부 확인 후 거부 상태라면 상태에 따라 처리
     */
    private boolean checkLocationPermissionIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (isGrantedLocationPermission()) {
                return true;
            } else {
                getCurrentActivity().requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION, android.Manifest.permission.ACCESS_COARSE_LOCATION}, REQUEST_LOCATION_PERMISSION);
                return false;
            }
        }
        return true;
    }

    /**
     * 위치 권한 활성화 여부 확인
     */
    private boolean isGrantedLocationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return reactContext.checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)
                    == PackageManager.PERMISSION_GRANTED
                    || reactContext.checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION)
                    == PackageManager.PERMISSION_GRANTED;
        }
        return true;
    }

    @Override
    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        return false;
    }

    /**
     * Wi-Fi 스캔 가능 여부 확인
     */
    private boolean checkWifiScanIsAvailable() {
        WifiManager wifiManager = (WifiManager) reactContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);

        boolean wifiScanEnabled = false;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
            wifiScanEnabled = wifiManager.isScanAlwaysAvailable();
        }

        return wifiManager.isWifiEnabled() || wifiScanEnabled;
    }

    /**
     * GPS 활성화 여부 확인
     */
    private boolean checkGpsStatus() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            LocationManager locationManager = (LocationManager) reactContext.getApplicationContext().getSystemService(Context.LOCATION_SERVICE);
            boolean isNetworkEnabled = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
            boolean isGPSEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
            if (!isNetworkEnabled && !isGPSEnabled) {
                return false;
            }
        }
        return true;
    }

    private void connectGoogleClient() {
        if (mGoogleApiClient == null) {
            mGoogleApiClient = new GoogleApiClient.Builder(reactContext.getApplicationContext())
                    .addConnectionCallbacks(this)
                    .addOnConnectionFailedListener(this)
                    .addApi(LocationServices.API)
                    .build();

        }
        mGoogleApiClient.connect();
    }

    private boolean isGoogleClientConnected() {
        if (mGoogleApiClient != null) {
            return mGoogleApiClient.isConnected() || mGoogleApiClient.isConnecting();
        }
        return false;
    }

    /**
     * 위치 기능 활성화 요청
     * [참고: https://developer.android.com/training/location/change-location-settings]
     */
    private void turnGpsOnByGooglePlayService() {
        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder();
        builder.addLocationRequest(locationRequest);
        builder.setAlwaysShow(true);

        PendingResult<LocationSettingsResult> result =
                LocationServices.SettingsApi.checkLocationSettings(mGoogleApiClient, builder.build());
        result.setResultCallback(new ResultCallback<LocationSettingsResult>() {
            @Override
            public void onResult(LocationSettingsResult result) {
                final Status status = result.getStatus();
                switch (status.getStatusCode()) {
                    case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                        try {
                            // Show the dialog by calling startResolutionForResult(),
                            // and check the result in onActivityResult().
                            status.startResolutionForResult(getCurrentActivity(), REQUEST_LOCATION_STATUS);
                        } catch (IntentSender.SendIntentException e) {
                            // Ignore the error.
                        }
                        break;
                }
            }
        });
    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {
        // GPS 활성화
        turnGpsOnByGooglePlayService();
    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {

    }
}