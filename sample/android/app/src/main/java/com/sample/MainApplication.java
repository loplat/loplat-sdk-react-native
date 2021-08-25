package com.sample;

import android.app.Application;
import android.content.Context;
import android.os.Build;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.loplat.placeengine.Plengi;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private static MainApplication instance;

    private static final String PREFS_NAME = MainApplication.class.getSimpleName();

    public static Context getContext(){
        return instance;
    }

    private final ReactNativeHost mReactNativeHost =
            new ReactNativeHost(this) {
                @Override
                public boolean getUseDeveloperSupport() {
                    return BuildConfig.DEBUG;
                }

                @Override
                protected List<ReactPackage> getPackages() {
                    @SuppressWarnings("UnnecessaryLocalVariable")
                    List<ReactPackage> packages = new PackageList(this).getPackages();
                    // Packages that cannot be autolinked yet can be added manually here, for example:
                    // packages.add(new MyReactNativePackage());
                    packages.add(new LoplatAndroidPackage()); // 이 부분을 추가한다.
                    return packages;
                }

                @Override
                protected String getJSMainModuleName() {
                    return "index";
                }
            };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        initializeFlipper(this, getReactNativeHost().getReactInstanceManager());

        instance = this;
        // 백그라운드 동작과 위치 서비스 약관 동의, 마케팅 동의를 미리 받아 둔 사용자를 위해 반드시 필요
        loplatSdkConfiguration();
    }

    /**
     * Loads Flipper in React Native templates. Call this in the onCreate method with something like
     * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
     *
     * @param context
     * @param reactInstanceManager
     */
    private static void initializeFlipper(
            Context context, ReactInstanceManager reactInstanceManager) {
        if (BuildConfig.DEBUG) {
            try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
                Class<?> aClass = Class.forName("com.sample.ReactNativeFlipper");
                aClass
                        .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
                        .invoke(null, context, reactInstanceManager);
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
        }
    }

    public void loplatSdkConfiguration() {
        Plengi plengi = Plengi.getInstance(this);

        // 고객사에 발급한 로플랫 SDK client ID/PW 입력
        String clientId = "loplatdemo"; // Test ID
        String clientSecret = "loplatdemokey";  // Test PW
        String echoCode = "18497358207"; // Test EchoCode

        // 위치 인식 정보를 수신할 Listener 등록
        plengi.setListener(new LoplatPlengiListener(mReactNativeHost));

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            /**
             * 백그라운드에서 동작 시 출력될 ForgroundService의 알림 설정
             * 따로 설정하지 않으면 기본 값으로 출력
             *
             * 특정 요소만 custom하기 원한다면 아래와 같이 resource 입력
             * 기본 값을 쓰기 원하는 요소엔 0 입력
             */
            plengi.setDefaultNotificationChannel(R.string.foreground_service_noti_channel_name,0);
            plengi.setDefaultNotificationInfo(
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

            // plengi.disableFeatureBgLocationReviewUX(true);

            plengi.setBackgroundLocationAccessDialogLayout(R.layout.dialog_background_location_info);
        }

        /**
         * Loplat SDK 설정들은 반드시 Plengi.init() 전에 호출 필요
         * [매우 중요] echoCode 는 최초에 없을 때에는 null, 사용자 로그인 후 echoCode 를 받아왔다면 저장후에 저장한 값을 아래에 기입
         * echoCode 가 null 인 상태에서 최초로 로그인하여 echoCode 를 얻어왔다면 해당 echoCode 를 입력한 init 을 다시 실행해야 함
         */
        plengi.init(clientId, clientSecret, echoCode);
    }
}
