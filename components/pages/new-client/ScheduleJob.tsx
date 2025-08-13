import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNewServiceStore } from '@/store/newServiceStore'

// Mock data for services - replace with actual data from your backend
const mockServices = [
  { id: '1', name: 'House Cleaning', duration: 120, description: 'Standard house cleaning service' },
  { id: '2', name: 'Deep Cleaning', duration: 240, description: 'Thorough deep cleaning service' },
  { id: '3', name: 'Window Cleaning', duration: 90, description: 'Professional window cleaning' },
  { id: '4', name: 'Carpet Cleaning', duration: 180, description: 'Deep carpet cleaning and stain removal' },
]

// Mock data for time slots - replace with actual availability logic
const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
]

export default function ScheduleJob() {
  const { 
    client, 
    quote, 
    job, 
    updateJob, 
    nextStep, 
    previousStep, 
    canProceedToNextStep 
  } = useNewServiceStore()

  const [showServiceSelector, setShowServiceSelector] = useState(false)
  const [selectedServices, setSelectedServices] = useState<any[]>([])

  // Initialize job data from quote services if available
  useEffect(() => {
    if (quote.services.length > 0 && !job.jobTitle) {
      const serviceNames = quote.services.map(s => s.name).join(', ')
      updateJob({ 
        jobTitle: `${serviceNames} for ${client?.name || 'Client'}`,
        location: client?.location || ''
      })
    }
  }, [quote.services, client])

  // Calculate estimated duration from selected services
  useEffect(() => {
    if (selectedServices.length > 0) {
      const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0)
      updateJob({ estimatedDuration: totalDuration })
    }
  }, [selectedServices])

  const handleServiceToggle = (service: any) => {
    const isSelected = selectedServices.find(s => s.id === service.id)
    
    if (isSelected) {
      // Remove service
      const updatedServices = selectedServices.filter(s => s.id !== service.id)
      setSelectedServices(updatedServices)
    } else {
      // Add service
      const newService = { ...service }
      const updatedServices = [...selectedServices, newService]
      setSelectedServices(updatedServices)
    }
  }

  const handleSubmit = () => {
    if (!client) {
      Alert.alert('Error', 'Please go back and select a client first')
      return
    }
    // if (selectedServices.length === 0) {
    //   Alert.alert('Error', 'Please select at least one service')
    //   return
    // }
    if (!job.jobTitle.trim()) {
      Alert.alert('Error', 'Please enter a job title')
      return
    }
    if (!job.location.trim()) {
      Alert.alert('Error', 'Please enter a location')
      return
    }

    // Proceed to next step
    nextStep()
  }

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

  if (!client) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          Please go back and select a client first
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center'
          }}
          onPress={previousStep}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Go Back to Client Selection
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (quote.services.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          Please go back and create a quote with services first
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#007AFF',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center'
          }}
          onPress={previousStep}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Go Back to Quote
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 16 }}>
        {/* Client Information */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Client</Text>
          <View style={{ backgroundColor: '#f8f9fa', padding: 12, borderRadius: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{client.name}</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>{client.phoneNumber}</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>{client.email}</Text>
            {client.location && (
              <Text style={{ fontSize: 14, color: '#666' }}>{client.location}</Text>
            )}
          </View>
        </View>

        {/* Quote Services Summary */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Services from Quote</Text>
          {quote.services.map((service, index) => (
            <View key={service.id} style={{
              borderBottomWidth: index === quote.services.length - 1 ? 0 : 1,
              borderBottomColor: '#eee',
              paddingBottom: index === quote.services.length - 1 ? 0 : 8,
              marginBottom: index === quote.services.length - 1 ? 0 : 8
            }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{service.name}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>
                {service.quantity} × ${service.basePrice.toFixed(2)} = ${service.total.toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={{ 
            borderTopWidth: 1, 
            borderTopColor: '#ddd', 
            paddingTop: 8, 
            marginTop: 8,
            alignItems: 'flex-end'
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#007AFF' }}>
              Total: ${quote.total.toFixed(2)}
            </Text>
          </View>
        </View>

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
              value={job.jobTitle}
              onChangeText={(value) => updateJob({ jobTitle: value })}
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
              value={job.location}
              onChangeText={(value) => updateJob({ location: value })}
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
                value={job.scheduledDate}
                onChangeText={(value) => updateJob({ scheduledDate: value })}
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
                    onPress: () => updateJob({ startTime: time })
                  })))
                }}
              >
                <Text style={{ fontSize: 16, color: job.startTime ? '#000' : '#999' }}>
                  {job.startTime || 'Select time'}
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
                    backgroundColor: job.priority === priority ? '#007AFF' : '#f0f0f0',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8
                  }}
                  onPress={() => updateJob({ priority: priority as 'low' | 'medium' | 'high' })}
                >
                  <Text style={{ 
                    color: job.priority === priority ? '#fff' : '#666',
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
                onPress={() => updateJob({ teamSize: Math.max(1, job.teamSize - 1) })}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 16, marginHorizontal: 8 }}>{job.teamSize}</Text>
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
                onPress={() => updateJob({ teamSize: job.teamSize + 1 })}
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
              value={job.equipment}
              onChangeText={(value) => updateJob({ equipment: value })}
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
              value={job.specialInstructions}
              onChangeText={(value) => updateJob({ specialInstructions: value })}
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
              value={job.notes}
              onChangeText={(value) => updateJob({ notes: value })}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#6c757d',
              padding: 16,
              borderRadius: 8,
              flex: 1,
              alignItems: 'center'
            }}
            onPress={previousStep}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: canProceedToNextStep() ? '#007AFF' : '#ccc',
              padding: 16,
              borderRadius: 8,
              flex: 1,
              alignItems: 'center'
            }}
            onPress={handleSubmit}
            disabled={!canProceedToNextStep()}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}