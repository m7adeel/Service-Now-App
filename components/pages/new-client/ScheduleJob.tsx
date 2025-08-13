import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native'
import React, { useState } from 'react'

// Mock data for services - replace with actual data from your backend
const mockServices = [
  { id: '1', name: 'House Cleaning', duration: 120, description: 'Standard house cleaning service' },
  { id: '2', name: 'Deep Cleaning', duration: 240, description: 'Thorough deep cleaning service' },
  { id: '3', name: 'Window Cleaning', duration: 90, description: 'Professional window cleaning' },
  { id: '4', name: 'Carpet Cleaning', duration: 180, description: 'Deep carpet cleaning and stain removal' },
]

// Mock data for clients - replace with actual data from your backend
const mockClients = [
  { id: '1', name: 'John Doe', phoneNumber: '+1-555-0123', email: 'john@example.com', location: 'New York' },
  { id: '2', name: 'Jane Smith', phoneNumber: '+1-555-0456', email: 'jane@example.com', location: 'Los Angeles' },
  { id: '3', name: 'Mike Johnson', phoneNumber: '+1-555-0789', email: 'mike@example.com', location: 'Chicago' },
]

// Mock data for time slots - replace with actual availability logic
const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
]

export default function ScheduleJob() {
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [showClientSelector, setShowClientSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedServices, setSelectedServices] = useState<any[]>([])
  const [showServiceSelector, setShowServiceSelector] = useState(false)
  const [jobData, setJobData] = useState({
    jobTitle: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    estimatedDuration: 0,
    location: '',
    specialInstructions: '',
    priority: 'medium',
    teamSize: 1,
    equipment: '',
    notes: ''
  })

  const handleClientSelect = (client: any) => {
    setSelectedClient(client)
    setShowClientSelector(false)
    // Auto-fill location if available
    if (client.location) {
      setJobData(prev => ({ ...prev, location: client.location }))
    }
  }

  const handleServiceToggle = (service: any) => {
    const isSelected = selectedServices.find(s => s.id === service.id)
    
    if (isSelected) {
      // Remove service
      const updatedServices = selectedServices.filter(s => s.id !== service.id)
      setSelectedServices(updatedServices)
      updateEstimatedDuration(updatedServices)
    } else {
      // Add service
      const newService = { ...service }
      const updatedServices = [...selectedServices, newService]
      setSelectedServices(updatedServices)
      updateEstimatedDuration(updatedServices)
    }
  }

  const updateEstimatedDuration = (services: any[]) => {
    const totalDuration = services.reduce((sum, service) => sum + service.duration, 0)
    setJobData(prev => ({ ...prev, estimatedDuration: totalDuration }))
  }

  const handleSubmit = () => {
    if (!selectedClient) {
      Alert.alert('Error', 'Please select a client')
      return
    }
    if (selectedServices.length === 0) {
      Alert.alert('Error', 'Please select at least one service')
      return
    }
    if (!jobData.jobTitle.trim()) {
      Alert.alert('Error', 'Please enter a job title')
      return
    }
    if (!jobData.location.trim()) {
      Alert.alert('Error', 'Please enter a location')
      return
    }

    // Here you would typically send the data to your backend
    console.log('Job scheduled:', { 
      client: selectedClient, 
      services: selectedServices, 
      ...jobData 
    })
    Alert.alert('Success', 'Job scheduled successfully!')
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
      }}
      onPress={() => handleClientSelect(item)}
    >
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>{item.name}</Text>
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>{item.phoneNumber}</Text>
      <Text style={{ fontSize: 14, color: '#666' }}>{item.email}</Text>
    </TouchableOpacity>
  )

  const renderServiceItem = ({ item }: { item: any }) => {
    const isSelected = selectedServices.find(s => s.id === item.id)
    return (
      <TouchableOpacity
        style={{
          backgroundColor: isSelected ? '#e3f2fd' : '#fff',
          padding: 16,
          marginBottom: 8,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: isSelected ? '#2196f3' : '#ddd',
        }}
        onPress={() => handleServiceToggle(item)}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>{item.name}</Text>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>{item.description}</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>
              Duration: {Math.floor(item.duration / 60)}h {item.duration % 60}m
            </Text>
          </View>
          {isSelected && (
            <View style={{
              backgroundColor: '#2196f3',
              width: 24,
              height: 24,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{ color: '#fff', fontSize: 16 }}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  if (showClientSelector) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <View style={{ backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() => setShowClientSelector(false)}
              style={{ marginRight: 16 }}
            >
              <Text style={{ color: '#007AFF', fontSize: 16 }}>← Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Select Client</Text>
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
            placeholder="Search clients..."
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
        />
      </View>
    )
  }

  if (showServiceSelector) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <View style={{ backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <TouchableOpacity
              onPress={() => setShowServiceSelector(false)}
              style={{ marginRight: 16 }}
            >
              <Text style={{ color: '#007AFF', fontSize: 16 }}>← Back</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Select Services</Text>
          </View>
        </View>

        <FlatList
          data={mockServices}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
        />
      </View>
    )
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
          Schedule Job
        </Text>

        {/* Client Selection */}

        {/* Job Details */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Job Details</Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Job Title *</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 6,
                padding: 10,
                fontSize: 16
              }}
              placeholder="Enter job title"
              value={jobData.jobTitle}
              onChangeText={(value) => setJobData(prev => ({ ...prev, jobTitle: value }))}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Location *</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 6,
                padding: 10,
                fontSize: 16
              }}
              placeholder="Enter job location"
              value={jobData.location}
              onChangeText={(value) => setJobData(prev => ({ ...prev, location: value }))}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Date</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 6,
                  padding: 10,
                  fontSize: 16
                }}
                value={jobData.scheduledDate}
                onChangeText={(value) => setJobData(prev => ({ ...prev, scheduledDate: value }))}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Start Time</Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 6,
                  padding: 10,
                  backgroundColor: '#fff'
                }}
                onPress={() => {
                  Alert.alert('Select Time', 'Choose start time:', timeSlots.map(time => ({
                    text: time,
                    onPress: () => setJobData(prev => ({ ...prev, startTime: time }))
                  })))
                }}
              >
                <Text style={{ fontSize: 16, color: jobData.startTime ? '#000' : '#999' }}>
                  {jobData.startTime || 'Select time'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Job Settings */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Job Settings</Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Priority</Text>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              {['low', 'medium', 'high'].map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={{
                    backgroundColor: jobData.priority === priority ? '#007AFF' : '#f0f0f0',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8
                  }}
                  onPress={() => setJobData(prev => ({ ...prev, priority }))}
                >
                  <Text style={{ 
                    color: jobData.priority === priority ? '#fff' : '#666',
                    textTransform: 'capitalize'
                  }}>
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Team Size</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#f0f0f0',
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 8
                }}
                onPress={() => setJobData(prev => ({ ...prev, teamSize: Math.max(1, prev.teamSize - 1) }))}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 16, marginHorizontal: 8 }}>{jobData.teamSize}</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#f0f0f0',
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 8
                }}
                onPress={() => setJobData(prev => ({ ...prev, teamSize: prev.teamSize + 1 }))}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Equipment Needed</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 6,
                padding: 10,
                fontSize: 16
              }}
              placeholder="Enter equipment requirements"
              value={jobData.equipment}
              onChangeText={(value) => setJobData(prev => ({ ...prev, equipment: value }))}
            />
          </View>
        </View>

        {/* Special Instructions & Notes */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Additional Information</Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Special Instructions</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 6,
                padding: 10,
                fontSize: 16,
                minHeight: 60,
                textAlignVertical: 'top'
              }}
              placeholder="Enter any special instructions"
              value={jobData.specialInstructions}
              onChangeText={(value) => setJobData(prev => ({ ...prev, specialInstructions: value }))}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Notes</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 6,
                padding: 10,
                fontSize: 16,
                minHeight: 60,
                textAlignVertical: 'top'
              }}
              placeholder="Enter any additional notes"
              value={jobData.notes}
              onChangeText={(value) => setJobData(prev => ({ ...prev, notes: value }))}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 20
          }}
          onPress={handleSubmit}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
            Schedule Job
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}