import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Calendar, Clock, X, Check } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

interface BookingModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (bookingData: {
    scheduled_date: string;
    scheduled_time: string;
    notes: string;
  }) => void;
  serviceTitle: string;
  isLoading?: boolean;
}

export default function BookingModal({
  visible,
  onClose,
  onConfirm,
  serviceTitle,
  isLoading = false,
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setSelectedTime(time);
    }
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select both date and time');
      return;
    }

    const scheduled_date = selectedDate.toISOString().split('T')[0];
    const scheduled_time = selectedTime.toTimeString().split(' ')[0];

    onConfirm({
      scheduled_date,
      scheduled_time,
      notes: notes.trim(),
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <TouchableOpacity onPress={onClose} disabled={isLoading}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Book Service</Text>
          <View className="w-6" />
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          {/* Service Title */}
          <View className="mb-6">
            <Text className="text-sm text-gray-600 mb-1">Service</Text>
            <Text className="text-lg font-semibold text-gray-900">{serviceTitle}</Text>
          </View>

          {/* Date Selection */}
          <View className="mb-6">
            <Text className="text-sm text-gray-600 mb-3">Select Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center justify-between p-4 border border-gray-300 rounded-lg bg-white"
            >
              <View className="flex-row items-center">
                <Calendar size={20} color="#6b7280" />
                <Text className="text-gray-900 ml-3 font-medium">
                  {formatDate(selectedDate)}
                </Text>
              </View>
              <Text className="text-primary-500 font-medium">Change</Text>
            </TouchableOpacity>
          </View>

          {/* Time Selection */}
          <View className="mb-6">
            <Text className="text-sm text-gray-600 mb-3">Select Time</Text>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              className="flex-row items-center justify-between p-4 border border-gray-300 rounded-lg bg-white"
            >
              <View className="flex-row items-center">
                <Clock size={20} color="#6b7280" />
                <Text className="text-gray-900 ml-3 font-medium">
                  {formatTime(selectedTime)}
                </Text>
              </View>
              <Text className="text-primary-500 font-medium">Change</Text>
            </TouchableOpacity>
          </View>

          {/* Notes */}
          <View className="mb-6">
            <Text className="text-sm text-gray-600 mb-3">Additional Notes (Optional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any special requests or notes for the provider..."
              multiline
              numberOfLines={4}
              className="p-4 border border-gray-300 rounded-lg bg-white text-gray-900"
              textAlignVertical="top"
            />
          </View>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* Time Picker */}
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
          )}
        </ScrollView>

        {/* Bottom Action Bar */}
        <View className="border-t border-gray-200 bg-white px-6 py-4">
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={isLoading}
            className={`py-4 rounded-lg flex-row items-center justify-center ${
              isLoading ? 'bg-gray-300' : 'bg-primary-500'
            }`}
          >
            <Check size={20} color={isLoading ? '#9ca3af' : 'white'} />
            <Text className={`font-semibold text-lg ml-2 ${
              isLoading ? 'text-gray-500' : 'text-white'
            }`}>
              {isLoading ? 'Creating Booking...' : 'Confirm Booking'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
} 