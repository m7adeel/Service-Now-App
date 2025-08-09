import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useServicesStore } from '@/store/servicesStore';
import { Search as SearchIcon, Filter, Star, Clock } from 'lucide-react-native';

import SearchBar from '@/components/SearchBar';

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

export default function Search() {
  const router = useRouter();
  const { services, searchQuery, selectedCategory, fetchServices, searchServices, filterByCategory } = useServicesStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = !localSearch || 
      service.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      service.description?.toLowerCase().includes(localSearch.toLowerCase()) ||
      service.category.toLowerCase().includes(localSearch.toLowerCase());
    
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || 
      service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (text: string) => {
    setLocalSearch(text);
    searchServices(text);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Search Services</Text>
        
        {/* Search Bar */}
        <SearchBar 
          searchQuery={localSearch}
          setSearchQuery={setLocalSearch}
        />

        {/* Filter Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
          <View className="flex-row space-x-3">
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => filterByCategory(category === 'All' ? null : category)}
                className={`px-4 py-2 rounded-full border ${
                  (!selectedCategory && category === 'All') || selectedCategory === category
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    (!selectedCategory && category === 'All') || selectedCategory === category
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Results */}
      <ScrollView className="flex-1 px-6">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          {filteredServices.length} services found
        </Text>
        
        {filteredServices.map((service) => (
          <TouchableOpacity
            key={service.id}
            onPress={() => router.push(`/service/${service.id}`)}
            className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
          >
            <View className="flex-row">
              {service.image_url ? (
                <Image
                  source={{ uri: service.image_url }}
                  className="w-20 h-20 rounded-lg bg-gray-200"
                />
              ) : (
                <View className="w-20 h-20 rounded-lg bg-gray-200" />
              )}
              <View className="flex-1 ml-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-gray-900">
                    {service.title}
                  </Text>
                  <View className="bg-primary-100 px-2 py-1 rounded">
                    <Text className="text-primary-600 text-xs font-semibold">
                      {service.category}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-600 mt-1 numberOfLines={2}">
                  {service.description}
                </Text>
                <View className="flex-row items-center justify-between mt-3">
                  <View className="flex-row items-center">
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
                  <TouchableOpacity 
                    className="bg-primary-500 px-4 py-2 rounded-lg"
                    onPress={(e) => {
                      e.stopPropagation();
                      router.push(`/service/${service.id}`);
                    }}
                  >
                    <Text className="text-white font-semibold text-sm">Book Now</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center mt-2">
                  <Star size={14} color="#fbbf24" fill="#fbbf24" />
                  <Text className="text-gray-600 text-sm ml-1">
                    by {service.profiles.full_name}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}