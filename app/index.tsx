import { useEffect } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  return <Redirect href={'/(auth)/login'} />
}