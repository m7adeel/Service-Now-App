import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useServicesStore } from '@/store/servicesStore';
import { useAuthStore } from '@/store/authStore';
import { useBookingsStore } from '@/store/bookingsStore';
import { useLocation } from '@/hooks/useLocation';
import { 
  MapPin, 
  Star, 
  Clock, 
  Phone, 
  Mail, 
  Calendar,
  ArrowLeft,
  MessageCircle,
  Navigation
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import BookingModal from '@/components/BookingModal';

type ServiceDetails = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price: number;
  duration_minutes: number;
  image_url: string | null;
  provider_id: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
    phone: string | null;
    email: string;
    location: any | null;
  };
};

export default function ServiceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useAuthStore();
  const { createBooking } = useBookingsStore();
  const { latitude, longitude } = useLocation();
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchServiceDetails();
    }
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          profiles:provider_id (
            full_name,
            avatar_url,
            phone,
            email,
            location
          )
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      console.error('Error fetching service details:', error);
      Alert.alert('Error', 'Failed to load service details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookService = () => {
    if (!profile || !service) return;
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async (bookingData: {
    scheduled_date: string;
    scheduled_time: string;
    notes: string;
  }) => {
    if (!profile || !service) return;

    try {
      setIsBooking(true);
      
      await createBooking({
        client_id: profile.id,
        service_id: service.id,
        provider_id: service.provider_id,
        scheduled_date: bookingData.scheduled_date,
        scheduled_time: bookingData.scheduled_time,
        status: 'pending',
        notes: bookingData.notes || null,
      });

      setShowBookingModal(false);
      
      Alert.alert(
        'Booking Created!',
        'Your booking has been created successfully. The provider will contact you soon.',
        [
          {
            text: 'View Bookings',
            onPress: () => router.push('/(client)/(tabs)/bookings'),
          },
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleMessageProvider = () => {
    if (!service) return;
    // Navigate to messages with the provider
    router.push(`/(client)/(tabs)/messages?providerId=${service.provider_id}`);
  };

  const handleCallProvider = () => {
    if (!service?.profiles?.phone) {
      Alert.alert('No Phone Number', 'Provider has not shared their phone number.');
      return;
    }
    // In a real app, you would use Linking to make a phone call
    Alert.alert('Call Provider', `Call ${service.profiles.full_name} at ${service.profiles.phone}?`);
  };

  const getDistanceFromUser = () => {
    if (!latitude || !longitude || !service?.profiles?.location) return null;
    
    const providerLocation = service.profiles.location as any;
    if (!providerLocation?.latitude || !providerLocation?.longitude) return null;

    // Simple distance calculation (Haversine formula would be more accurate)
    const latDiff = Math.abs(latitude - providerLocation.latitude);
    const lonDiff = Math.abs(longitude - providerLocation.longitude);
    const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111; // Rough km conversion
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Loading service details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!service) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Service not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const distance = getDistanceFromUser();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Service Details</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1">
        {/* Service Image */}
        {service.image_url && (
          <Image
            source={{ uri: service.image_url }}
            className="w-full h-64 bg-gray-200"
            resizeMode="cover"
          />
        )}

        {/* Service Info */}
        <View className="px-6 py-4">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {service.title}
          </Text>
          
          <View className="flex-row items-center mb-3">
            <Text className="text-primary-500 font-bold text-xl">
              ${service.price}
            </Text>
            <View className="flex-row items-center ml-4">
              <Clock size={16} color="#6b7280" />
              <Text className="text-gray-600 ml-1">
                {service.duration_minutes} minutes
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-4">
            <Text className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
              {service.category}
            </Text>
            {distance && (
              <View className="flex-row items-center ml-3">
                <MapPin size={14} color="#6b7280" />
                <Text className="text-gray-600 text-sm ml-1">{distance} away</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {service.description && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-2">Description</Text>
              <Text className="text-gray-700 leading-6">{service.description}</Text>
            </View>
          )}

          {/* Provider Info */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Service Provider</Text>
            <View className="bg-gray-50 rounded-lg p-4">
              <View className="flex-row items-center mb-3">
                {service.profiles.avatar_url ? (
                  <Image
                    source={{ uri: service.profiles.avatar_url }}
                    className="w-12 h-12 rounded-full bg-gray-200"
                  />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
                    <Text className="text-gray-600 font-semibold">
                      {service.profiles.full_name.charAt(0)}
                    </Text>
                  </View>
                )}
                <View className="ml-3 flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {service.profiles.full_name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Star size={14} color="#fbbf24" fill="#fbbf24" />
                    <Text className="text-gray-600 text-sm ml-1">5.0 (24 reviews)</Text>
                  </View>
                </View>
              </View>

              {/* Provider Location */}
              {service.profiles.location && (
                <View className="flex-row items-center mb-3">
                  <MapPin size={16} color="#6b7280" />
                  <Text className="text-gray-600 ml-2 flex-1">
                    {service.profiles.location.address || 'Location available'}
                  </Text>
                </View>
              )}

              {/* Contact Actions */}
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={handleMessageProvider}
                  className="flex-1 bg-primary-500 py-3 rounded-lg flex-row items-center justify-center"
                >
                  <MessageCircle size={16} color="white" />
                  <Text className="text-white font-semibold ml-2">Message</Text>
                </TouchableOpacity>
                
                {service.profiles.phone && (
                  <TouchableOpacity
                    onPress={handleCallProvider}
                    className="flex-1 bg-gray-100 py-3 rounded-lg flex-row items-center justify-center"
                  >
                    <Phone size={16} color="#374151" />
                    <Text className="text-gray-700 font-semibold ml-2">Call</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Location Info */}
          {service.profiles.location && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">Location</Text>
              <View className="bg-gray-50 rounded-lg p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-gray-900 font-medium">
                      {service.profiles.location.address || 'Service location'}
                    </Text>
                    {distance && (
                      <Text className="text-gray-600 text-sm mt-1">
                        {distance} from your location
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity className="bg-primary-500 p-2 rounded-lg">
                    <Navigation size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="border-t border-gray-200 bg-white px-6 py-4">
        <TouchableOpacity
          onPress={handleBookService}
          disabled={isBooking}
          className={`py-4 rounded-lg flex-row items-center justify-center ${
            isBooking ? 'bg-gray-300' : 'bg-primary-500'
          }`}
        >
          <Calendar size={20} color={isBooking ? '#9ca3af' : 'white'} />
          <Text className={`font-semibold text-lg ml-2 ${
            isBooking ? 'text-gray-500' : 'text-white'
          }`}>
            {isBooking ? 'Booking...' : 'Book This Service'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Booking Modal */}
      <BookingModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleConfirmBooking}
        serviceTitle={service?.title || ''}
        isLoading={isBooking}
      />
    </SafeAreaView>
  );
} 