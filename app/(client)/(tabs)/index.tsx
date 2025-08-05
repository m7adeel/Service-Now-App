import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useServicesStore } from '@/store/servicesStore';
import { MapPin, Star, Clock } from 'lucide-react-native';

const CATEGORIES = [
  'All',
  'Cleaning',
  'Plumbing',
  'Electrical',
  'Gardening',
  'Beauty',
  'Fitness',
  'Tutoring',
];

export default function ClientHome() {
  const { profile } = useAuthStore();
  const { services, isLoading, fetchServices } = useServicesStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };

  const filteredServices = services.filter(service => 
    selectedCategory === 'All' || service.category === selectedCategory
  );

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
          <View className="flex-row items-center mt-2">
            <MapPin size={16} color="#6b7280" />
            <Text className="text-gray-600 ml-1">Your Location</Text>
          </View>
        </View>

        {/* Categories */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedCategory === category
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      selectedCategory === category ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Services */}
        <View className="px-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Available Services
          </Text>
          {filteredServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
            >
              <View className="flex-row">
                {service.image_url ? (
                  <Image
                    source={{ uri: service.image_url }}
                    className="w-16 h-16 rounded-lg bg-gray-200"
                  />
                ) : (
                  <View className="w-16 h-16 rounded-lg bg-gray-200" />
                )}
                <View className="flex-1 ml-4">
                  <Text className="text-lg font-semibold text-gray-900">
                    {service.title}
                  </Text>
                  <Text className="text-gray-600 mt-1 numberOfLines={2}">
                    {service.description}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <Text className="text-primary-500 font-bold text-lg">
                      ${service.price}
                    </Text>
                    <View className="flex-row items-center ml-4">
                      <Clock size={14} color="#6b7280" />
                      <Text className="text-gray-500 text-sm ml-1">
                        {service.duration_minutes}min
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center mt-1">
                    <Star size={14} color="#fbbf24" fill="#fbbf24" />
                    <Text className="text-gray-600 text-sm ml-1">
                      by {service.profiles.full_name}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}