import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  try {
    let status = (await Notifications.getPermissionsAsync()).status;
    if (status !== 'granted') {
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    if (status !== 'granted') return { token: null, platform: Platform.OS };
    const tokenResp = await Notifications.getExpoPushTokenAsync();
    const token = tokenResp?.data || null;
    return { token, platform: Platform.OS };
  } catch {
    return { token: null, platform: Platform.OS };
  }
}

