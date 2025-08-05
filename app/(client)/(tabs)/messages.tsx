import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle } from 'lucide-react-native';

export default function ClientMessages() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">Messages</Text>
      </View>

      <View className="flex-1 justify-center items-center px-6">
        <MessageCircle size={64} color="#d1d5db" />
        <Text className="text-gray-500 text-lg mt-4 text-center">
          No messages yet
        </Text>
        <Text className="text-gray-400 text-center mt-2">
          Your conversations with service providers will appear here
        </Text>
      </View>
    </SafeAreaView>
  );
}