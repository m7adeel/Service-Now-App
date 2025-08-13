import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native'
import React, { useState } from 'react'

// Mock data for existing clients - replace with actual data from your backend
const mockClients = [
  { id: '1', name: 'John Doe', phoneNumber: '+1-555-0123', email: 'john@example.com', location: 'New York' },
  { id: '2', name: 'Jane Smith', phoneNumber: '+1-555-0456', email: 'jane@example.com', location: 'Los Angeles' },
  { id: '3', name: 'Mike Johnson', phoneNumber: '+1-555-0789', email: 'mike@example.com', location: 'Chicago' },
  { id: '4', name: 'Sarah Wilson', phoneNumber: '+1-555-0321', email: 'sarah@example.com', location: 'Houston' },
]

export default function NewClient() {
  const [viewMode, setViewMode] = useState<'options' | 'newClient' | 'existingClient'>('options')
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    location: '',
    notes: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required')
      return
    }
    if (!formData.phoneNumber.trim()) {
      Alert.alert('Error', 'Phone number is required')
      return
    }

    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData)
    Alert.alert('Success', 'Client added successfully!')
    
    // Reset form
    setFormData({
      name: '',
      phoneNumber: '',
      email: '',
      location: '',
      notes: ''
    })
  }

  const handleClientSelect = (client: any) => {
    Alert.alert('Client Selected', `Selected: ${client.name}`, [
      { text: 'OK', onPress: () => console.log('Client selected:', client) }
    ])
  }

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phoneNumber.includes(searchQuery) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderClientItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
      onPress={() => handleClientSelect(item)}
    >
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>{item.name}</Text>
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>{item.phoneNumber}</Text>
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>{item.email}</Text>
      <Text style={{ fontSize: 14, color: '#666' }}>{item.location}</Text>
    </TouchableOpacity>
  )

  // Initial options screen
  if (viewMode === 'options') {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#333' }}>
          Add Client
        </Text>
        
        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={() => setViewMode('newClient')}
        >
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>
            New Client
          </Text>
          <Text style={{ color: '#fff', fontSize: 14, marginTop: 4, opacity: 0.9 }}>
            Create a new client profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#007AFF',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={() => setViewMode('existingClient')}
        >
          <Text style={{ color: '#007AFF', fontSize: 20, fontWeight: '600' }}>
            Existing Client
          </Text>
          <Text style={{ color: '#007AFF', fontSize: 14, marginTop: 4, opacity: 0.9 }}>
            Search and select from existing clients
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Existing clients list screen
  if (viewMode === 'existingClient') {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <View style={{ backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            {/* <TouchableOpacity
              onPress={() => setViewMode('options')}
              style={{ marginRight: 16 }}
            >
              <Text style={{ color: '#007AFF', fontSize: 16 }}>← Back</Text>
            </TouchableOpacity> */}
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Select Existing Client</Text>
          </View>
          
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: '#fff'
            }}
            placeholder="Search clients by name, phone, or email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        <FlatList
          data={filteredClients}
          renderItem={renderClientItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }

  // New client form screen
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          {/* <TouchableOpacity
            onPress={() => setViewMode('options')}
            style={{ marginRight: 16 }}
          >
            <Text style={{ color: '#007AFF', fontSize: 16 }}>← Back</Text>
          </TouchableOpacity> */}
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            Add New Client
          </Text>
        </View>
        
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: '600', color: '#333' }}>
            Name *
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: '#fff'
            }}
            placeholder="Enter client name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholderTextColor="#999"
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: '600', color: '#333' }}>
            Phone Number *
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: '#fff'
            }}
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: '600', color: '#333' }}>
            Email
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: '#fff'
            }}
            placeholder="Enter email address"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: '600', color: '#333' }}>
            Location
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: '#fff'
            }}
            placeholder="Enter location"
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            placeholderTextColor="#999"
          />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: '600', color: '#333' }}>
            Notes
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: '#fff',
              minHeight: 80,
              textAlignVertical: 'top'
            }}
            placeholder="Enter any additional notes"
            value={formData.notes}
            onChangeText={(value) => handleInputChange('notes', value)}
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center'
          }}
          onPress={handleSubmit}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
            Add Client
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}