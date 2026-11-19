import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppState, AppStateStatus } from 'react-native';
import { AppLockService } from '../src/services/security/appLock';
import { LockScreen } from '../src/components/security/LockScreen';

export default function RootLayout() {
  const [isLocked, setIsLocked] = useState(AppLockService.getLockState());

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        AppLockService.lock();
        setIsLocked(AppLockService.getLockState());
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="partner/index" options={{ presentation: 'card' }} />
      </Stack>
      <LockScreen visible={isLocked} onSuccess={() => setIsLocked(false)} />
    </>
  );
}
