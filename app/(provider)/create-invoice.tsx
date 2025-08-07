import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function CreateInvoice() {
  const router = useRouter();
  const [booking, setBooking] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('draft');

  // Dummy bookings for dropdown (replace with real data later)
  const bookings = [
    { id: '1', label: 'Booking #1 - Client Name' },
    { id: '2', label: 'Booking #2 - Client Name' },
  ];

  const handleCreateInvoice = () => {
    // TODO: Implement Supabase integration
    console.log('Creating invoice:', { booking, amount, status });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Create Invoice</Text>
        <TouchableOpacity 
          className="bg-primary-500 rounded-lg px-4 py-2"
          onPress={handleCreateInvoice}
        >
          <Save size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <ScrollView className="flex-1 px-6 py-4">
        {/* Booking Selection */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Select Booking</Text>
          <View className="border border-gray-300 rounded-lg">
            <Picker
              selectedValue={booking}
              onValueChange={setBooking}
              style={{ height: 50 }}
            >
              <Picker.Item label="Select a booking" value="" />
              {bookings.map(b => (
                <Picker.Item key={b.id} label={b.label} value={b.id} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Amount Input */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Amount</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg"
            placeholder="Enter amount"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Status Selection */}
        <View className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Status</Text>
          <View className="border border-gray-300 rounded-lg">
            <Picker
              selectedValue={status}
              onValueChange={setStatus}
              style={{ height: 50 }}
            >
              <Picker.Item label="Draft" value="draft" />
              <Picker.Item label="Sent" value="sent" />
              <Picker.Item label="Paid" value="paid" />
            </Picker>
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity 
          className="bg-primary-500 rounded-lg py-4 mt-6"
          onPress={handleCreateInvoice}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Create Invoice
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
} 