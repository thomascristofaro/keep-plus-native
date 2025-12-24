const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Expo config plugin to add Android share intent support
 * This modifies the AndroidManifest.xml to register the app
 * as a share target for text content
 */
module.exports = function withShareIntent(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const { manifest } = androidManifest;

    if (!manifest.application || !Array.isArray(manifest.application)) {
      return config;
    }

    const application = manifest.application[0];
    
    if (!application.activity || !Array.isArray(application.activity)) {
      return config;
    }

    // Find the main activity
    const mainActivity = application.activity.find(
      (activity) =>
        activity.$?.['android:name'] === '.MainActivity'
    );

    if (mainActivity) {
      // Ensure intent-filter array exists
      if (!mainActivity['intent-filter']) {
        mainActivity['intent-filter'] = [];
      }

      // Add share intent filter if not already present
      const hasShareIntent = mainActivity['intent-filter'].some(
        (filter) =>
          filter.action?.some(
            (action) => action.$?.['android:name'] === 'android.intent.action.SEND'
          )
      );

      if (!hasShareIntent) {
        mainActivity['intent-filter'].push({
          action: [
            {
              $: {
                'android:name': 'android.intent.action.SEND',
              },
            },
          ],
          category: [
            {
              $: {
                'android:name': 'android.intent.category.DEFAULT',
              },
            },
          ],
          data: [
            {
              $: {
                'android:mimeType': 'text/plain',
              },
            },
          ],
        });
      }

      // Set launchMode to singleTask to avoid multiple instances
      if (mainActivity.$) {
        mainActivity.$['android:launchMode'] = 'singleTask';
      }
    }

    return config;
  });
};
