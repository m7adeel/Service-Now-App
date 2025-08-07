import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Phone, MapPin, LogOut } from 'lucide-react-native';

export default function ClientProfile() {
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
      <ScrollView>
        <View className="px-6 py-4">
          <Text className="text-2xl font-bold text-gray-900">Profile</Text>
        </View>

        <View className="flex-1 px-6">
          {/* Profile Picture */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4">
              <User size={48} color="#3b82f6" />
            </View>
            <TouchableOpacity>
              <Text className="text-primary-500 font-semibold">Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Form */}
          <View className="space-y-6">
            <View>
              <Text className="text-gray-700 mb-2 font-semibold">Full Name</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <User size={20} color="#6b7280" />
                <TextInput
                  value={formData.full_name}
                  onChangeText={(text) => setFormData({ ...formData, full_name: text })}
                  editable={isEditing}
                  className="flex-1 ml-3 text-gray-900"
                  placeholder="Enter your full name"
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
          </View>

          {/* Action Buttons */}
          <View className="mt-8 space-y-4">
            <TouchableOpacity
              onPress={handleSignOut}
              className="flex-row items-center justify-center bg-error-500 rounded-lg py-3"
            >
              <LogOut size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}