import {
  EvsComm,
  EvsDisplay,
  EvsKit,
  EvsSensors,
  EvsUI,
} from '@therealitycrafters/react-native-evskit';
import * as React from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

/**
 * Android 12+ (API 31+) classifies BLUETOOTH_SCAN / BLUETOOTH_CONNECT as
 * dangerous permissions — manifest entries alone are not enough. Without a
 * runtime grant, BLEScanner silently returns 0 results and the SDK's
 * "configure" screen shows "Scan completed" with an empty list.
 * Mirrors checkPerm() in the native HelloWorld sample.
 */
async function requestBlePermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }
  const apiLevel
    = typeof Platform.Version === 'string'
      ? Number.parseInt(Platform.Version, 10)
      : Platform.Version;
  if (apiLevel < 31) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  const requested = [
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ];
  const results = await PermissionsAndroid.requestMultiple(requested);
  return requested.every(
    permission => results[permission] === PermissionsAndroid.RESULTS.GRANTED,
  );
}

export function HomeScreen() {
  React.useEffect(() => {
    let cancelled = false;

    async function initEvsKit() {
      try {
        // BLUETOOTH_CONNECT is needed to connect() to an already-paired
        // device too, and SCAN (+ location) is needed for the SDK's
        // "configure" scan UI — so request up front on every launch.
        if (!(await requestBlePermissions())) {
          console.warn('BLE permission denied — scan will find no glasses');
          return;
        }
        if (cancelled)
          return;

        await EvsKit.start();
        if (cancelled)
          return;

        if (await EvsComm.hasConfiguredDevice()) {
          await EvsComm.connect();
          if (cancelled)
            return;
          // Only safe once connected — without a link these throw / no-op.
          await EvsSensors.enableTouch(true);
          await EvsDisplay.setAutoBrightness({ enabled: true });
        }
        else {
          // Simplest path: let the SDK's own scan/pair UI handle it.
          // show() just presents the screen and resolves; pairing/connecting
          // happens via user interaction + connection-state events, so do NOT
          // enable sensors/touch here — wait until connected.
          await EvsUI.show('configure');
        }
      }
      catch (error) {
        if (!cancelled) {
          console.error('Failed to initialize EvsKit', error);
        }
      }
    }

    void initEvsKit();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View className="flex-1">
      <FocusAwareStatusBar />
      <Text>Hi</Text>
    </View>
  );
}
