import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<'client' | 'provider'>('client');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthStore();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, fullName, userType);
      // Navigation is handled in index.tsx based on user type
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-center">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
          <Text className="text-gray-600">Sign up to get started</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2">Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2">Account Type</Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setUserType('client')}
                className={`flex-1 py-3 rounded-lg border ${
                  userType === 'client' 
                    ? 'bg-primary-500 border-primary-500' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text className={`text-center font-semibold ${
                  userType === 'client' ? 'text-white' : 'text-gray-700'
                }`}>
                  Client
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUserType('provider')}
                className={`flex-1 py-3 rounded-lg border ${
                  userType === 'provider' 
                    ? 'bg-primary-500 border-primary-500' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text className={`text-center font-semibold ${
                  userType === 'provider' ? 'text-white' : 'text-gray-700'
                }`}>
                  Service Provider
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-primary-500 rounded-lg py-3 mt-6"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">Create Account</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary-500 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}