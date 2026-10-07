import * as React from 'react';
import { EvsComm, EvsDisplay, EvsKit, EvsSensors } from 'react-native-evskit';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export function HomeScreen() {
  React.useEffect(() => {
    async function initEvsKit() {
      await EvsKit.start();

      if (await EvsComm.hasConfiguredDevice()) {
        await EvsComm.connect();
      }
      else {
        // Simplest path: let the SDK's own scan/pair UI handle it
        await EvsKit.ui.show('configure');
      }

      await EvsSensors.enableTouch(true);
      await EvsDisplay.setAutoBrightness({ enabled: true });
    }

    void initEvsKit();
  }, []);

  return (
    <View className="flex-1">
      <FocusAwareStatusBar />
      <Text>Hi</Text>
    </View>
  );
}
