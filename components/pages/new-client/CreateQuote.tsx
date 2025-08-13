import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native'
import React, { useState } from 'react'

// Mock data for services - replace with actual data from your backend
const mockServices = [
  { id: '1', name: 'House Cleaning', basePrice: 150, description: 'Standard house cleaning service' },
  { id: '2', name: 'Deep Cleaning', basePrice: 250, description: 'Thorough deep cleaning service' },
  { id: '3', name: 'Window Cleaning', basePrice: 80, description: 'Professional window cleaning' },
  { id: '4', name: 'Carpet Cleaning', basePrice: 120, description: 'Deep carpet cleaning and stain removal' },
]

// Mock data for clients - replace with actual data from your backend
const mockClients = [
  { id: '1', name: 'John Doe', phoneNumber: '+1-555-0123', email: 'john@example.com', location: 'New York' },
  { id: '2', name: 'Jane Smith', phoneNumber: '+1-555-0456', email: 'jane@example.com', location: 'Los Angeles' },
  { id: '3', name: 'Mike Johnson', phoneNumber: '+1-555-0789', email: 'mike@example.com', location: 'Chicago' },
]

export default function CreateQuote() {
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [showClientSelector, setShowClientSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [quoteData, setQuoteData] = useState({
    quoteNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    services: [] as any[],
    subtotal: 0,
    taxRate: 8.5,
    taxAmount: 0,
    total: 0,
    terms: 'Payment due within 30 days. 50% deposit required to begin work.',
    notes: ''
  })

  const handleServiceAdd = (service: any) => {
    const existingService = quoteData.services.find(s => s.id === service.id)
    
    if (existingService) {
      // Update quantity
      const updatedServices = quoteData.services.map(s => 
        s.id === service.id 
          ? { ...s, quantity: s.quantity + 1, total: (s.quantity + 1) * s.basePrice }
          : s
      )
      updateQuoteTotals(updatedServices)
    } else {
      // Add new service
      const newService = {
        ...service,
        quantity: 1,
        total: service.basePrice
      }
      const updatedServices = [...quoteData.services, newService]
      updateQuoteTotals(updatedServices)
    }
  }

  const handleServiceQuantityChange = (serviceId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove service
      const updatedServices = quoteData.services.filter(s => s.id !== serviceId)
      updateQuoteTotals(updatedServices)
    } else {
      // Update quantity
      const updatedServices = quoteData.services.map(s => 
        s.id === serviceId 
          ? { ...s, quantity: newQuantity, total: newQuantity * s.basePrice }
          : s
      )
      updateQuoteTotals(updatedServices)
    }
  }

  const updateQuoteTotals = (services: any[]) => {
    const subtotal = services.reduce((sum, service) => sum + service.total, 0)
    const taxAmount = subtotal * (quoteData.taxRate / 100)
    const total = subtotal + taxAmount

    setQuoteData(prev => ({
      ...prev,
      services,
      subtotal,
      taxAmount,
      total
    }))
  }

  const handleClientSelect = (client: any) => {
    setSelectedClient(client)
    setShowClientSelector(false)
  }

  const handleSubmit = () => {
    if (!selectedClient) {
      Alert.alert('Error', 'Please select a client')
      return
    }
    if (quoteData.services.length === 0) {
      Alert.alert('Error', 'Please add at least one service')
      return
    }
    if (!quoteData.quoteNumber.trim()) {
      Alert.alert('Error', 'Please enter a quote number')
      return
    }

    // Here you would typically send the data to your backend
    console.log('Quote submitted:', { client: selectedClient, ...quoteData })
    Alert.alert('Success', 'Quote created successfully!')
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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
          Create Quote
        </Text>

        {/* Client Selection */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Client</Text>
          {selectedClient ? (
            <View style={{ backgroundColor: '#f8f9fa', padding: 12, borderRadius: 6 }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{selectedClient.name}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>{selectedClient.phoneNumber}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>{selectedClient.email}</Text>
              <TouchableOpacity
                onPress={() => setSelectedClient(null)}
                style={{ marginTop: 8 }}
              >
                <Text style={{ color: '#ff3b30', fontSize: 14 }}>Change Client</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                borderWidth: 2,
                borderColor: '#007AFF',
                borderStyle: 'dashed',
                borderRadius: 8,
                padding: 20,
                alignItems: 'center'
              }}
              onPress={() => setShowClientSelector(true)}
            >
              <Text style={{ color: '#007AFF', fontSize: 16 }}>Select Client</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quote Details */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Quote Details</Text>
          
          <View style={{ marginBottom: 12 }}>
            <Text style={{ marginBottom: 4, fontSize: 14, color: '#666' }}>Quote Number</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 6,
                padding: 10,
                fontSize: 16
              }}
              placeholder="Enter quote number"
              value={quoteData.quoteNumber}
              onChangeText={(value) => setQuoteData(prev => ({ ...prev, quoteNumber: value }))}
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
                value={quoteData.issueDate}
                onChangeText={(value) => setQuoteData(prev => ({ ...prev, issueDate: value }))}
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
                value={quoteData.expiryDate}
                onChangeText={(value) => setQuoteData(prev => ({ ...prev, expiryDate: value }))}
              />
            </View>
          </View>
        </View>

        {/* Services */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Services</Text>
          
          {quoteData.services.length === 0 ? (
            <Text style={{ color: '#999', textAlign: 'center', padding: 20 }}>
              No services added yet
            </Text>
          ) : (
            <FlatList
              data={quoteData.services}
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
            onPress={() => {
              // Show service selection modal or navigate to service selection
              Alert.alert('Add Service', 'Select a service to add:', mockServices.map(service => ({
                text: `${service.name} - $${service.basePrice}`,
                onPress: () => handleServiceAdd(service)
              })))
            }}
          >
            <Text style={{ color: '#007AFF', fontSize: 16 }}>+ Add Service</Text>
          </TouchableOpacity>
        </View>

        {/* Totals */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Summary</Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 16 }}>Subtotal</Text>
            <Text style={{ fontSize: 16 }}>${quoteData.subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 16 }}>Tax ({quoteData.taxRate}%)</Text>
            <Text style={{ fontSize: 16 }}>${quoteData.taxAmount.toFixed(2)}</Text>
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
              ${quoteData.total.toFixed(2)}
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
              value={quoteData.terms}
              onChangeText={(value) => setQuoteData(prev => ({ ...prev, terms: value }))}
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
              value={quoteData.notes}
              onChangeText={(value) => setQuoteData(prev => ({ ...prev, notes: value }))}
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
            Create Quote
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}