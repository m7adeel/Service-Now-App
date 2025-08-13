import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNewServiceStore } from '@/store/newServiceStore'

// Mock data for services - replace with actual data from your backend
const mockServices = [
  { id: '1', name: 'House Cleaning', basePrice: 150, description: 'Standard house cleaning service', duration: 120 },
  { id: '2', name: 'Deep Cleaning', basePrice: 250, description: 'Thorough deep cleaning service', duration: 240 },
  { id: '3', name: 'Window Cleaning', basePrice: 80, description: 'Professional window cleaning', duration: 90 },
  { id: '4', name: 'Carpet Cleaning', basePrice: 120, description: 'Deep carpet cleaning and stain removal', duration: 180 },
]

export default function CreateQuote() {
  const { 
    client, 
    quote, 
    updateQuote, 
    addServiceToQuote, 
    removeServiceFromQuote, 
    updateServiceQuantity,
    nextStep,
    previousStep,
    canProceedToNextStep
  } = useNewServiceStore()

  const [showServiceSelector, setShowServiceSelector] = useState(false)

  // Auto-populate quote with client location if available
  useEffect(() => {
    if (client && client.location && !quote.notes.includes(client.location)) {
      updateQuote({ 
        notes: `Location: ${client.location}\n${quote.notes}`.trim()
      })
    }
  }, [client])

  const handleServiceAdd = (service: any) => {
    const serviceItem = {
      ...service,
      quantity: 1,
      total: service.basePrice
    }
    addServiceToQuote(serviceItem)
    setShowServiceSelector(false)
  }

  const handleServiceQuantityChange = (serviceId: string, newQuantity: number) => {
    updateServiceQuantity(serviceId, newQuantity)
  }

  const handleSubmit = () => {
    if (!client) {
      Alert.alert('Error', 'Please go back and select a client first')
      return
    }
    if (quote.services.length === 0) {
      Alert.alert('Error', 'Please add at least one service')
      return
    }
    if (!quote.quoteNumber.trim()) {
      Alert.alert('Error', 'Please enter a quote number')
      return
    }

    // Proceed to next step
    nextStep()
  }

  const renderServiceItem = ({ item }: { item: any }) => (
    <View style={{
      backgroundColor: '#fff',
      padding: 16,
      marginBottom: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.name}</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#007AFF' }}>
          ${item.total.toFixed(2)}
        </Text>
      </View>
      <Text style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>{item.description}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 14, color: '#666' }}>
          ${item.basePrice.toFixed(2)} × {item.quantity}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
            onPress={() => handleServiceQuantityChange(item.id, item.quantity - 1)}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>-</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 16, marginHorizontal: 8 }}>{item.quantity}</Text>
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
            onPress={() => handleServiceQuantityChange(item.id, item.quantity + 1)}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

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
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                padding: 16,
                marginBottom: 8,
                marginHorizontal: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ddd',
              }}
              onPress={() => handleServiceAdd(item)}
            >
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 4 }}>{item.name}</Text>
              <Text style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>{item.description}</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#007AFF' }}>
                ${item.basePrice.toFixed(2)}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
          Create Quote
        </Text>

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

        {/* Quote Details */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Quote Details</Text>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Quote Number *</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 6,
                padding: 10,
                fontSize: 16
              }}
              placeholder="Enter quote number"
              value={quote.quoteNumber}
              onChangeText={(value) => updateQuote({ quoteNumber: value })}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Issue Date</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 6,
                  padding: 10,
                  fontSize: 16
                }}
                value={quote.issueDate}
                onChangeText={(value) => updateQuote({ issueDate: value })}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Expiry Date</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 6,
                  padding: 10,
                  fontSize: 16
                }}
                value={quote.expiryDate}
                onChangeText={(value) => updateQuote({ expiryDate: value })}
              />
            </View>
          </View>
        </View>

        {/* Services */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Services</Text>
          
          {quote.services.length === 0 ? (
            <Text style={{ color: '#999', textAlign: 'center', padding: 20 }}>
              No services added yet
            </Text>
          ) : (
            <FlatList
              data={quote.services}
              renderItem={renderServiceItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}

          <TouchableOpacity
            style={{
              borderWidth: 2,
              borderColor: '#007AFF',
              borderStyle: 'dashed',
              borderRadius: 8,
              padding: 16,
              alignItems: 'center',
              marginTop: 16
            }}
            onPress={() => setShowServiceSelector(true)}
          >
            <Text style={{ color: '#007AFF', fontSize: 16 }}>+ Add Service</Text>
          </TouchableOpacity>
        </View>

        {/* Totals */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Summary</Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 16 }}>Subtotal</Text>
            <Text style={{ fontSize: 16 }}>${quote.subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 16 }}>Tax ({quote.taxRate}%)</Text>
            <Text style={{ fontSize: 16 }}>${quote.taxAmount.toFixed(2)}</Text>
          </View>
          
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            borderTopWidth: 1, 
            borderTopColor: '#ddd',
            paddingTop: 8,
            marginTop: 8
          }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>Total</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#007AFF' }}>
              ${quote.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Terms and Notes */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Terms & Notes</Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Terms & Conditions</Text>
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
              placeholder="Enter terms and conditions"
              value={quote.terms}
              onChangeText={(value) => updateQuote({ terms: value })}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Additional Notes</Text>
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
              value={quote.notes}
              onChangeText={(value) => updateQuote({ notes: value })}
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