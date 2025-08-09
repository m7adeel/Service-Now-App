import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookingsStore } from '@/store/bookingsStore';
import { useAuthStore } from '@/store/authStore';
import { Calendar as CalendarIcon, Clock, User, Phone, Check, X, Eye } from 'lucide-react-native';
import { format } from 'date-fns';

const STATUS_COLORS = {
  pending: 'bg-warning-100 text-warning-700',
  confirmed: 'bg-primary-100 text-primary-700',
  completed: 'bg-success-100 text-success-700',
  cancelled: 'bg-error-100 text-error-700',
};

export default function ProviderBookings() {
  const { profile } = useAuthStore();
  const { bookings, isLoading, fetchBookings, updateBookingStatus } = useBookingsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'completed'>('pending');
  const [showCalendar, setShowCalendar] = useState(false);
  const [displayBooking, setDisplayBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const providerBookings = bookings.filter(booking => booking.provider_id === profile?.id);
  const pendingBookings = providerBookings.filter(booking => booking.status === 'pending');
  const confirmedBookings = providerBookings.filter(booking => booking.status === 'confirmed');
  const completedBookings = providerBookings.filter(booking =>
    booking.status === 'completed' || booking.status === 'cancelled'
  );

  const getDisplayBookings = () => {
    switch (activeTab) {
      case 'pending': return pendingBookings;
      case 'confirmed': return confirmedBookings;
      case 'completed': return completedBookings;
      default: return [];
    }
  };

  useEffect(() => {
    const displayBookings = getDisplayBookings();
    setDisplayBookings(displayBookings)
  }, [activeTab])

  const handleUpdateStatus = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await updateBookingStatus(bookingId, status);
      Alert.alert('Success', `Booking ${status} successfully!`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-900">Bookings</Text>
          <TouchableOpacity
            onPress={() => setShowCalendar(true)}
            className="bg-primary-500 px-4 py-2 rounded-lg flex-row items-center"
          >
            <Eye size={16} color="white" />
            <Text className="text-white font-semibold ml-2">Show Calendar</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-gray-100 rounded-lg p-1 mb-6">
          <TouchableOpacity
            onPress={() => setActiveTab('pending')}
            className={`flex-1 py-2 rounded-md ${activeTab === 'pending' ? 'bg-white shadow-sm' : ''
              }`}
          >
            <Text className={`text-center font-semibold ${activeTab === 'pending' ? 'text-gray-900' : 'text-gray-600'
              }`}>
              Pending ({pendingBookings.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('confirmed')}
            className={`flex-1 py-2 rounded-md ${activeTab === 'confirmed' ? 'bg-white shadow-sm' : ''
              }`}
          >
            <Text className={`text-center font-semibold ${activeTab === 'confirmed' ? 'text-gray-900' : 'text-gray-600'
              }`}>
              Confirmed ({confirmedBookings.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('completed')}
            className={`flex-1 py-2 rounded-md ${activeTab === 'completed' ? 'bg-white shadow-sm' : ''
              }`}
          >
            <Text className={`text-center font-semibold ${activeTab === 'completed' ? 'text-gray-900' : 'text-gray-600'
              }`}>
              History ({completedBookings.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {displayBooking.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <CalendarIcon size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4">
              No {activeTab} bookings
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              {activeTab === 'pending'
                ? 'New booking requests will appear here'
                : activeTab === 'confirmed'
                  ? 'Your confirmed appointments will appear here'
                  : 'Your completed and cancelled bookings will appear here'
              }
            </Text>
          </View>
        ) : (
          displayBooking.map((booking) => (
            <View
              key={booking.id}
              className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {booking.services.title}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <User size={14} color="#6b7280" />
                    <Text className="text-gray-600 ml-1">
                      {booking.client_profile.full_name}
                    </Text>
                  </View>
                </View>
                <View className={`px-3 py-1 rounded-full ${STATUS_COLORS[booking.status]}`}>
                  <Text className="text-xs font-semibold capitalize">
                    {booking.status}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center mb-2">
                <CalendarIcon size={16} color="#6b7280" />
                <Text className="text-gray-600 ml-2">
                  {format(new Date(booking.scheduled_date), 'EEEE, MMMM d, yyyy')}
                </Text>
              </View>

              <View className="flex-row items-center mb-2">
                <Clock size={16} color="#6b7280" />
                <Text className="text-gray-600 ml-2">
                  {booking.scheduled_time} ({booking.services.duration_minutes} minutes)
                </Text>
              </View>

              {booking.client_profile.phone && (
                <View className="flex-row items-center mb-3">
                  <Phone size={16} color="#6b7280" />
                  <Text className="text-gray-600 ml-2">
                    {booking.client_profile.phone}
                  </Text>
                </View>
              )}

              <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                <Text className="text-lg font-bold text-success-600">
                  ${booking.services.price}
                </Text>

                {booking.status === 'pending' && (
                  <View className="flex-row space-x-2">
                    <TouchableOpacity
                      onPress={() => handleUpdateStatus(booking.id, 'cancelled')}
                      className="bg-error-100 px-3 py-2 rounded-lg flex-row items-center"
                    >
                      <X size={16} color="#dc2626" />
                      <Text className="text-error-600 font-semibold ml-1">Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleUpdateStatus(booking.id, 'confirmed')}
                      className="bg-success-100 px-3 py-2 rounded-lg flex-row items-center"
                    >
                      <Check size={16} color="#059669" />
                      <Text className="text-success-600 font-semibold ml-1">Accept</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {booking.status === 'confirmed' && (
                  <TouchableOpacity
                    onPress={() => handleUpdateStatus(booking.id, 'completed')}
                    className="bg-primary-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-semibold">Mark Complete</Text>
                  </TouchableOpacity>
                )}
              </View>

              {booking.notes && (
                <View className="mt-3 pt-3 border-t border-gray-100">
                  <Text className="text-gray-600 text-sm">
                    <Text className="font-semibold">Notes: </Text>
                    {booking.notes}
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-900">Calendar</Text>
            <TouchableOpacity
              onPress={() => setShowCalendar(false)}
              className="p-2 rounded-full bg-gray-100"
              accessibilityLabel="Close calendar"
            >
              <X size={22} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView>

          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}