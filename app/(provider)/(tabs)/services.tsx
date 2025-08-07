import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useServicesStore } from '@/store/servicesStore';
import { useAuthStore } from '@/store/authStore';
import { Plus, CreditCard as Edit, Trash2, DollarSign, Clock } from 'lucide-react-native';

const CATEGORIES = [
  'Cleaning',
  'Plumbing',
  'Electrical',
  'Gardening',
  'Beauty',
  'Fitness',
  'Tutoring',
  'Other',
];

export default function ProviderServices() {
  const { profile } = useAuthStore();
  const { services, fetchProviderServices, createService, updateService, deleteService, toggleServiceStatus } = useServicesStore();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Cleaning',
    price: '',
    duration_minutes: '60',
  });

  useEffect(() => {
    if (profile?.id) {
      fetchProviderServices(profile.id);
    }
  }, [profile?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (profile?.id) {
      await fetchProviderServices(profile.id);
    }
    setRefreshing(false);
  };

  const providerServices = services;

  const handleSaveService = async () => {
    if (!formData.title || !formData.price) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    try {
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price),
        duration_minutes: parseInt(formData.duration_minutes),
        provider_id: profile?.id!,
      };

      if (editingService) {
        await updateService(editingService.id, serviceData);
      } else {
        await createService(serviceData);
      }

      // Refresh the services list
      if (profile?.id) {
        await fetchProviderServices(profile.id);
      }

      setModalVisible(false);
      resetForm();
      Alert.alert('Success', `Service ${editingService ? 'updated' : 'created'} successfully!`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || '',
      category: service.category,
      price: service.price.toString(),
      duration_minutes: service.duration_minutes.toString(),
    });
    setModalVisible(true);
  };

  const handleDeleteService = (service: any) => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteService(service.id);
              // Refresh the services list
              if (profile?.id) {
                await fetchProviderServices(profile.id);
              }
              Alert.alert('Success', 'Service deleted successfully!');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  const handleToggleServiceStatus = async (service: any) => {
    try {
      await toggleServiceStatus(service.id);
      // Refresh the services list
      if (profile?.id) {
        await fetchProviderServices(profile.id);
      }
      Alert.alert('Success', `Service ${service.is_active ? 'deactivated' : 'activated'} successfully!`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Cleaning',
      price: '',
      duration_minutes: '60',
    });
    setEditingService(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-900">My Services</Text>
        <TouchableOpacity
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
          className="bg-primary-500 rounded-lg p-2"
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {providerServices.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg">No services yet</Text>
            <Text className="text-gray-400 text-center mt-2">
              Create your first service to start receiving bookings
            </Text>
          </View>
        ) : (
          providerServices.map((service) => (
            <View
              key={service.id}
              className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {service.title}
                  </Text>
                  <View className="bg-primary-100 px-2 py-1 rounded mt-1 self-start">
                    <Text className="text-primary-600 text-xs font-semibold">
                      {service.category}
                    </Text>
                  </View>
                </View>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={() => handleEditService(service)}
                    className="p-2"
                  >
                    <Edit size={18} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteService(service)}
                    className="p-2"
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>

              {service.description && (
                <Text className="text-gray-600 mb-3">{service.description}</Text>
              )}

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <DollarSign size={16} color="#10b981" />
                  <Text className="text-success-600 font-bold text-lg ml-1">
                    {service.price}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Clock size={16} color="#6b7280" />
                  <Text className="text-gray-500 ml-1">
                    {service.duration_minutes} min
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <Text className={`text-sm font-semibold ${
                  service.is_active ? 'text-success-600' : 'text-error-600'
                }`}>
                  {service.is_active ? 'Active' : 'Inactive'}
                </Text>
                <TouchableOpacity
                  onPress={() => handleToggleServiceStatus(service)}
                  className={`px-4 py-2 rounded-lg ${
                    service.is_active ? 'bg-error-100' : 'bg-success-100'
                  }`}
                >
                  <Text className={`font-semibold text-sm ${
                    service.is_active ? 'text-error-600' : 'text-success-600'
                  }`}>
                    {service.is_active ? 'Deactivate' : 'Activate'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Service Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="px-6 py-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-900">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </Text>
          </View>

          <ScrollView className="flex-1 px-6 py-6">
            <View className="space-y-4">
              <View>
                <Text className="text-gray-700 mb-2 font-semibold">Service Title *</Text>
                <TextInput
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  placeholder="e.g., House Cleaning Service"
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
                />
              </View>

              <View>
                <Text className="text-gray-700 mb-2 font-semibold">Description</Text>
                <TextInput
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Describe your service..."
                  multiline
                  numberOfLines={4}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
                />
              </View>

              <View>
                <Text className="text-gray-700 mb-2 font-semibold">Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row space-x-3">
                    {CATEGORIES.map((category) => (
                      <TouchableOpacity
                        key={category}
                        onPress={() => setFormData({ ...formData, category })}
                        className={`px-4 py-2 rounded-full border ${
                          formData.category === category
                            ? 'bg-primary-500 border-primary-500'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <Text
                          className={`font-semibold ${
                            formData.category === category ? 'text-white' : 'text-gray-700'
                          }`}
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-gray-700 mb-2 font-semibold">Price ($) *</Text>
                  <TextInput
                    value={formData.price}
                    onChangeText={(text) => setFormData({ ...formData, price: text })}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-gray-700 mb-2 font-semibold">Duration (minutes)</Text>
                  <TextInput
                    value={formData.duration_minutes}
                    onChangeText={(text) => setFormData({ ...formData, duration_minutes: text })}
                    placeholder="60"
                    keyboardType="number-pad"
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View className="px-6 py-4 border-t border-gray-200">
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                className="flex-1 bg-gray-200 rounded-lg py-3"
              >
                <Text className="text-gray-700 text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveService}
                className="flex-1 bg-primary-500 rounded-lg py-3"
              >
                <Text className="text-white text-center font-semibold">
                  {editingService ? 'Update' : 'Create'} Service
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}