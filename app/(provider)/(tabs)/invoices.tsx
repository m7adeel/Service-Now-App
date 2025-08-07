import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Receipt, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProviderInvoices() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-900">Invoices</Text>
        <TouchableOpacity 
          className="bg-primary-500 rounded-lg p-2" 
          onPress={() => router.push('/create-invoice')}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center px-6">
        <Receipt size={64} color="#d1d5db" />
        <Text className="text-gray-500 text-lg mt-4 text-center">
          No invoices yet
        </Text>
        <Text className="text-gray-400 text-center mt-2">
          Create invoices for your completed services
        </Text>
        
        <TouchableOpacity 
          className="bg-primary-500 rounded-lg px-6 py-3 mt-6"
          onPress={() => router.push('/create-invoice')}
        >
          <Text className="text-white font-semibold">Create Invoice</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}