package com.loplat.sample;

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

public class LoplatAndroidModule extends ReactContextBaseJavaModule {

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
    }

    @Override
    public String getName() {
        return "AndroidPlengi";
    }

    @ReactMethod
    public void init(String clientId, String clientSecret, String echoCode, Callback callback) {
        // 로플랫 SDK init
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            /**
             * 백그라운드에서 동작 시 출력될 ForgroundService의 알림 설정
             * 따로 설정하지 않으면 기본 값으로 출력
             *
             * 특정 요소만 custom하기 원한다면 아래와 같이 resource 입력
             * 기본 값을 쓰기 원하는 요소엔 0 입력
             */
            Plengi.getInstance(reactContext).setDefaultNotificationChannel(R.string.foreground_service_noti_channel_name, 0);
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
        callback.invoke(result);
    }

    @ReactMethod
    public void start(Callback callback) {
        // 로플랫 SDK start
        Toast.makeText(reactContext, "start", Toast.LENGTH_SHORT).show();
        int result = Plengi.getInstance(reactContext).start();
        callback.invoke(result);
    }

    @ReactMethod
    public void stop(Callback callback) {
        // 로플랫 SDK stop
        Toast.makeText(reactContext, "stop", Toast.LENGTH_SHORT).show();
        int result = Plengi.getInstance(reactContext).stop();
        callback.invoke(result);
    }

    @ReactMethod
    public void enableAdNetwork(boolean isEnableAdNetwork, boolean isEnableLoplatX) {
        // 마케팅 알림 설정
        // isEnableAdNetwork 은 마케팅 알림의 허용 유무
        // isEnableLoplatX 은 해당 마케팅 알림을 SDK 에서 생성할 것인지에 대한 유무
        // [true / true] SDK 에서 만든 알림을 사용
        // [true / false] 앱에서 만든 알림을 사용
        // [false / false] 마케팅 알림 거부

        // SDK 가 생성한 알림에 보여줄 icon 설정
        // Plengi.getInstance(this).setAdNotiLargeIcon(R.drawable.ic_launcher);
        // Plengi.getInstance(this).setAdNotiSmallIcon(R.drawable.ic_launcher);
        Toast.makeText(reactContext, "enableAdNetwork:" + isEnableAdNetwork + isEnableLoplatX, Toast.LENGTH_SHORT).show();
        Plengi.getInstance(reactContext).enableAdNetwork(isEnableAdNetwork, isEnableLoplatX);
    }
}