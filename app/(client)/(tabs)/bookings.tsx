import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookingsStore } from '@/store/bookingsStore';
import { useAuthStore } from '@/store/authStore';
import { Calendar, Clock, User, Phone } from 'lucide-react-native';
import { format } from 'date-fns';

const STATUS_COLORS = {
  pending: 'bg-warning-100 text-warning-700',
  confirmed: 'bg-primary-100 text-primary-700',
  completed: 'bg-success-100 text-success-700',
  cancelled: 'bg-error-100 text-error-700',
};

export default function ClientBookings() {
  const { profile } = useAuthStore();
  const { bookings, isLoading, fetchBookings } = useBookingsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const clientBookings = bookings.filter(booking => booking.client_id === profile?.id);

  const upcomingBookings = clientBookings.filter(booking => 
    booking.status === 'pending' || booking.status === 'confirmed'
  );

  const pastBookings = clientBookings.filter(booking => 
    booking.status === 'completed' || booking.status === 'cancelled'
  );

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900 mb-4">My Bookings</Text>
        
        {/* Tabs */}
        <View className="flex-row bg-gray-100 rounded-lg p-1 mb-6">
          <TouchableOpacity
            onPress={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 rounded-md ${
              activeTab === 'upcoming' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text className={`text-center font-semibold ${
              activeTab === 'upcoming' ? 'text-gray-900' : 'text-gray-600'
            }`}>
              Upcoming ({upcomingBookings.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('past')}
            className={`flex-1 py-2 rounded-md ${
              activeTab === 'past' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text className={`text-center font-semibold ${
              activeTab === 'past' ? 'text-gray-900' : 'text-gray-600'
            }`}>
              Past ({pastBookings.length})
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
        {displayBookings.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Calendar size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4">
              No {activeTab} bookings
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              {activeTab === 'upcoming' 
                ? 'Book a service to see your upcoming appointments here'
                : 'Your completed and cancelled bookings will appear here'
              }
            </Text>
          </View>
        ) : (
          displayBookings.map((booking) => (
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
                      {booking.provider_profile.full_name}
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
                <Calendar size={16} color="#6b7280" />
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

              {booking.provider_profile.phone && (
                <View className="flex-row items-center mb-3">
                  <Phone size={16} color="#6b7280" />
                  <Text className="text-gray-600 ml-2">
                    {booking.provider_profile.phone}
                  </Text>
                </View>
              )}

              <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                <Text className="text-lg font-bold text-primary-500">
                  ${booking.services.price}
                </Text>
                <View className="flex-row space-x-2">
                  <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-lg">
                    <Text className="text-gray-700 font-semibold">Message</Text>
                  </TouchableOpacity>
                  {booking.status === 'pending' && (
                    <TouchableOpacity className="bg-error-500 px-4 py-2 rounded-lg">
                      <Text className="text-white font-semibold">Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
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
    </SafeAreaView>
  );
}