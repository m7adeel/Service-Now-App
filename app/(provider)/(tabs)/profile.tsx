import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Phone, MapPin, LogOut, Briefcase } from 'lucide-react-native';

export default function ProviderProfile() {
  const { profile, signOut, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">Profile</Text>
      </View>

      <View className="flex-1 px-6">
        {/* Profile Picture */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4">
            <User size={48} color="#3b82f6" />
          </View>
          <View className="bg-success-100 px-3 py-1 rounded-full">
            <Text className="text-success-600 font-semibold text-sm">Service Provider</Text>
          </View>
          <TouchableOpacity className="mt-2">
            <Text className="text-primary-500 font-semibold">Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Form */}
        <View className="space-y-6">
          <View>
            <Text className="text-gray-700 mb-2 font-semibold">Business Name</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <Briefcase size={20} color="#6b7280" />
              <TextInput
                value={formData.full_name}
                onChangeText={(text) => setFormData({ ...formData, full_name: text })}
                editable={isEditing}
                className="flex-1 ml-3 text-gray-900"
                placeholder="Enter your business name"
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-700 mb-2 font-semibold">Email</Text>
            <View className="flex-row items-center bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
              <Mail size={20} color="#6b7280" />
              <Text className="flex-1 ml-3 text-gray-500">
                {profile?.email}
              </Text>
            </View>
            <Text className="text-gray-400 text-sm mt-1">Email cannot be changed</Text>
          </View>

          <View>
            <Text className="text-gray-700 mb-2 font-semibold">Phone Number</Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <Phone size={20} color="#6b7280" />
              <TextInput
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                editable={isEditing}
                className="flex-1 ml-3 text-gray-900"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-700 mb-2 font-semibold">Service Area</Text>
            <TouchableOpacity className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <MapPin size={20} color="#6b7280" />
              <Text className="flex-1 ml-3 text-gray-500">
                Set your service area
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Business Stats */}
        <View className="mt-8 p-4 bg-gray-50 rounded-lg">
          <Text className="text-gray-700 font-semibold mb-3">Business Overview</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary-500">0</Text>
              <Text className="text-gray-600 text-sm">Active Services</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-success-500">0</Text>
              <Text className="text-gray-600 text-sm">Completed</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-warning-500">0</Text>
              <Text className="text-gray-600 text-sm">Pending</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-8 space-y-4">
          {isEditing ? (
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setIsEditing(false);
                  setFormData({
                    full_name: profile?.full_name || '',
                    phone: profile?.phone || '',
                  });
                }}
                className="flex-1 bg-gray-200 rounded-lg py-3"
              >
                <Text className="text-gray-700 text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={loading}
                className="flex-1 bg-primary-500 rounded-lg py-3"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold">Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              className="bg-primary-500 rounded-lg py-3"
            >
              <Text className="text-white text-center font-semibold">Edit Profile</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center justify-center bg-error-500 rounded-lg py-3"
          >
            <LogOut size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}