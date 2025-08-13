import { Stack } from 'expo-router';

export default function ProviderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name='create-service'
        options={{
          headerShown: true,
          title: 'Create a Service',
          headerBackButtonDisplayMode: 'minimal'
        }}
      />
    </Stack>
  );
}