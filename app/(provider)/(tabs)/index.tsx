import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useBookingsStore } from '@/store/bookingsStore';
import { useServicesStore } from '@/store/servicesStore';
import { Calendar, DollarSign, Briefcase, TrendingUp, Clock, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function ProviderDashboard() {
  const { profile } = useAuthStore();
  const { bookings, fetchBookings } = useBookingsStore();
  const { services, fetchServices } = useServicesStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
    fetchServices();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchBookings(), fetchServices()]);
    setRefreshing(false);
  };

  const providerBookings = bookings.filter(booking => booking.provider_id === profile?.id);
  const providerServices = services.filter(service => service.provider_id === profile?.id);

  const pendingBookings = providerBookings.filter(booking => booking.status === 'pending');
  const todayBookings = providerBookings.filter(booking => {
    const today = new Date().toISOString().split('T')[0];
    return booking.scheduled_date === today && booking.status === 'confirmed';
  });

  const totalEarnings = providerBookings
    .filter(booking => booking.status === 'completed')
    .reduce((sum, booking) => sum + booking.services.price, 0);

  const stats = [
    {
      title: 'Active Services',
      value: providerServices.filter(s => s.is_active).length,
      icon: Briefcase,
      color: 'bg-primary-500',
    },
    {
      title: 'Pending Requests',
      value: pendingBookings.length,
      icon: Clock,
      color: 'bg-warning-500',
    },
    {
      title: 'Today\'s Bookings',
      value: todayBookings.length,
      icon: Calendar,
      color: 'bg-success-500',
    },
    {
      title: 'Total Earnings',
      value: `$${totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-2xl font-bold text-gray-900">
            Welcome back, {profile?.full_name?.split(' ')[0]}!
          </Text>
          <Text className="text-gray-600">Here's your business overview</Text>
        </View>

        {/* Stats Grid */}
        <View className="px-6 mb-6">
          <View className="flex-row flex-wrap -mx-2">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} className="w-1/2 px-2 mb-4">
                  <View className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <View className="flex-row items-center justify-between mb-2">
                      <View className={`w-10 h-10 rounded-lg ${stat.color} items-center justify-center`}>
                        <IconComponent size={20} color="white" />
                      </View>
                    </View>
                    <Text className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </Text>
                    <Text className="text-gray-600 text-sm">{stat.title}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent Bookings */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">Recent Bookings</Text>
            <TouchableOpacity>
              <Text className="text-primary-500 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          {providerBookings.slice(0, 3).map((booking) => (
            <View
              key={booking.id}
              className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {booking.services.title}
                  </Text>
                  <Text className="text-gray-600 mt-1">
                    with {booking.client_profile.full_name}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    {booking.scheduled_date} at {booking.scheduled_time}
                  </Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${
                  booking.status === 'pending' ? 'bg-warning-100' :
                  booking.status === 'confirmed' ? 'bg-primary-100' :
                  booking.status === 'completed' ? 'bg-success-100' :
                  'bg-error-100'
                }`}>
                  <Text className={`text-xs font-semibold ${
                    booking.status === 'pending' ? 'text-warning-700' :
                    booking.status === 'confirmed' ? 'text-primary-700' :
                    booking.status === 'completed' ? 'text-success-700' :
                    'text-error-700'
                  }`}>
                    {booking.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-1 bg-primary-500 rounded-lg p-4 items-center">
              <Briefcase size={24} color="white" />
              <Text className="text-white font-semibold mt-2">Add Service</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-success-500 rounded-lg p-4 items-center">
              <CheckCircle size={24} color="white" />
              <Text className="text-white font-semibold mt-2">Mark Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}