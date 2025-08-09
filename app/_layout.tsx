import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import '../global.css';
import { useAuthStore } from '@/store/authStore';

export default function RootLayout() {
  useFrameworkReady();

  const { user, profile } = useAuthStore();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={user === null || profile === null}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={user !== null && profile !== null}>
          <Stack.Protected guard={profile?.user_type === 'client'}>
            <Stack.Screen name="(client)" />
          </Stack.Protected>
          <Stack.Protected guard={profile?.user_type === 'provider'}>
            <Stack.Screen name="(provider)" />
          </Stack.Protected>
          <Stack.Screen name="+not-found" />
        </Stack.Protected>
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}