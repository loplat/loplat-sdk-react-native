package com.loplat.sample;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.loplat.placeengine.PlengiListener;
import com.loplat.placeengine.PlengiResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

public class LoplatPlengiListener implements PlengiListener {

    private static ReactNativeHost reactNativeHost;

    public LoplatPlengiListener(ReactNativeHost mReactNativeHost) {
        this.reactNativeHost = mReactNativeHost;
    }


    @Override
    public void listen(PlengiResponse response) {
        // Loplat SDK 로부터 위치 정보를 받은 후 React-Native 에 값을 넘김
        try {
            Gson gson = new Gson();
            String json = gson.toJson(response);
            JsonObject gsonObject = new JsonParser().parse(json).getAsJsonObject();
            JSONObject jsonObject = new JSONObject(gsonObject.toString());
            WritableMap map = convertJsonToMap(jsonObject);

            WritableMap params = Arguments.createMap();
            params.putMap("plengiResponse", map);

            ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
            ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
            // 샘플앱에 React Native (Javascript) 에 작성된 코드는 Foreground 일 때만 동작합니다. (Background 에서는 Emitter, Callback 등 실행 안됨)
            // Background 일 때 필요한 기능은 React Native (Javascript) 가 아닌 Native Module 에 작성해주시기 바랍니다.
            if(reactContext != null){
                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("listen", params);
            }else{
                reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                    @Override
                    public void onReactContextInitialized(ReactContext context) {
                        context
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("listen", params);
                    }
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static WritableMap convertJsonToMap(JSONObject jsonObject) throws Exception {
        WritableMap map = new WritableNativeMap();

        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof JSONArray) {
                map.putArray(key, convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof  Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof  Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String)  {
                map.putString(key, (String) value);
            } else {
                map.putString(key, value.toString());
            }
        }
        return map;
    }

    private static WritableArray convertJsonToArray(JSONArray jsonArray) throws Exception {
        WritableArray array = new WritableNativeArray();

        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            if (value instanceof JSONObject) {
                array.pushMap(convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                array.pushArray(convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                array.pushBoolean((Boolean) value);
            } else if (value instanceof  Integer) {
                array.pushInt((Integer) value);
            } else if (value instanceof  Double) {
                array.pushDouble((Double) value);
            } else if (value instanceof String)  {
                array.pushString((String) value);
            } else {
                array.pushString(value.toString());
            }
        }
        return array;
    }
}
