import { View, Text, TouchableOpacity, ScrollView, Alert, Share, Linking } from 'react-native'
import React, { useState } from 'react'

// Mock invoice data - replace with actual data from your backend
const mockInvoice = {
  invoiceNumber: 'INV-2024-001',
  issueDate: '2024-01-15',
  dueDate: '2024-02-14',
  client: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-555-0123',
    address: '123 Main Street, New York, NY 10001'
  },
  services: [
    {
      id: '1',
      name: 'House Cleaning',
      description: 'Standard house cleaning service',
      quantity: 1,
      unitPrice: 150.00,
      total: 150.00
    },
    {
      id: '2',
      name: 'Deep Cleaning',
      description: 'Thorough deep cleaning service',
      quantity: 1,
      unitPrice: 250.00,
      total: 250.00
    },
    {
      id: '3',
      name: 'Window Cleaning',
      description: 'Professional window cleaning',
      quantity: 2,
      unitPrice: 80.00,
      total: 160.00
    }
  ],
  subtotal: 560.00,
  taxRate: 8.5,
  taxAmount: 47.60,
  total: 607.60,
  terms: 'Payment due within 30 days. 50% deposit required to begin work.',
  notes: 'Thank you for choosing our services. We appreciate your business!',
  company: {
    name: 'CleanPro Services',
    address: '456 Business Ave, Suite 100, New York, NY 10002',
    phone: '+1-555-9876',
    email: 'info@cleanpro.com',
    website: 'www.cleanpro.com'
  }
}

export default function SendInvoice() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would typically generate and download the actual PDF
      // For now, we'll show a success message
      Alert.alert(
        'PDF Generated', 
        'Invoice PDF has been generated successfully!',
        [
          { text: 'View PDF', onPress: () => console.log('View PDF') },
          { text: 'OK', style: 'default' }
        ]
      )
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleShareInvoice = async () => {
    setIsSharing(true)
    
    try {
      const shareOptions = {
        title: `Invoice ${mockInvoice.invoiceNumber}`,
        message: `Invoice ${mockInvoice.invoiceNumber} for ${mockInvoice.client.name} - Total: $${mockInvoice.total.toFixed(2)}`,
        url: `https://yourapp.com/invoices/${mockInvoice.invoiceNumber}`, // Replace with actual URL
      }
      
      const result = await Share.share(shareOptions)
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType)
        } else {
          console.log('Shared successfully')
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share invoice. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }

  const handleWhatsAppShare = async () => {
    try {
      const message = `Invoice ${mockInvoice.invoiceNumber} for ${mockInvoice.client.name}\n\nTotal Amount: $${mockInvoice.total.toFixed(2)}\nDue Date: ${mockInvoice.dueDate}\n\nView invoice: https://yourapp.com/invoices/${mockInvoice.invoiceNumber}`
      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`
      
      const canOpen = await Linking.canOpenURL(whatsappUrl)
      if (canOpen) {
        await Linking.openURL(whatsappUrl)
      } else {
        Alert.alert('WhatsApp not available', 'Please install WhatsApp or use another sharing method.')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open WhatsApp. Please try again.')
    }
  }

  const handleEmailShare = async () => {
    try {
      const subject = `Invoice ${mockInvoice.invoiceNumber} - ${mockInvoice.client.name}`
      const body = `Dear ${mockInvoice.client.name},\n\nPlease find attached invoice ${mockInvoice.invoiceNumber}.\n\nTotal Amount: $${mockInvoice.total.toFixed(2)}\nDue Date: ${mockInvoice.dueDate}\n\nThank you for your business!\n\nBest regards,\n${mockInvoice.company.name}`
      
      const mailtoUrl = `mailto:${mockInvoice.client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      
      const canOpen = await Linking.canOpenURL(mailtoUrl)
      if (canOpen) {
        await Linking.openURL(mailtoUrl)
      } else {
        Alert.alert('Email not available', 'Please set up an email app or use another sharing method.')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open email. Please try again.')
    }
  }

  const handleSMSShare = async () => {
    try {
      const message = `Invoice ${mockInvoice.invoiceNumber} for ${mockInvoice.client.name}. Total: $${mockInvoice.total.toFixed(2)}. Due: ${mockInvoice.dueDate}. View: https://yourapp.com/invoices/${mockInvoice.invoiceNumber}`
      const smsUrl = `sms:${mockInvoice.client.phone}?body=${encodeURIComponent(message)}`
      
      const canOpen = await Linking.canOpenURL(smsUrl)
      if (canOpen) {
        await Linking.openURL(smsUrl)
      } else {
        Alert.alert('SMS not available', 'Please set up SMS or use another sharing method.')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open SMS. Please try again.')
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
          Invoice Details
        </Text>

        {/* Invoice Header */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#007AFF' }}>
                {mockInvoice.company.name}
              </Text>
              <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                {mockInvoice.company.address}
              </Text>
              <Text style={{ fontSize: 14, color: '#666' }}>
                {mockInvoice.company.phone} • {mockInvoice.company.email}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                INVOICE
              </Text>
              <Text style={{ fontSize: 16, color: '#666', marginTop: 4 }}>
                #{mockInvoice.invoiceNumber}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Bill To:</Text>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{mockInvoice.client.name}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>{mockInvoice.client.address}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>{mockInvoice.client.email}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>{mockInvoice.client.phone}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 14, color: '#666' }}>Issue Date:</Text>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>{mockInvoice.issueDate}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 14, color: '#666' }}>Due Date:</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#ff3b30' }}>{mockInvoice.dueDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Services */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>Services</Text>
          
          {mockInvoice.services.map((service, index) => (
            <View key={service.id} style={{
              borderBottomWidth: index === mockInvoice.services.length - 1 ? 0 : 1,
              borderBottomColor: '#eee',
              paddingBottom: index === mockInvoice.services.length - 1 ? 0 : 12,
              marginBottom: index === mockInvoice.services.length - 1 ? 0 : 12
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>{service.name}</Text>
                  <Text style={{ fontSize: 14, color: '#666' }}>{service.description}</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>
                  ${service.total.toFixed(2)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#666' }}>
                  {service.quantity} × ${service.unitPrice.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 200, marginBottom: 8 }}>
              <Text style={{ fontSize: 16 }}>Subtotal:</Text>
              <Text style={{ fontSize: 16 }}>${mockInvoice.subtotal.toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 200, marginBottom: 8 }}>
              <Text style={{ fontSize: 16 }}>Tax ({mockInvoice.taxRate}%):</Text>
              <Text style={{ fontSize: 16 }}>${mockInvoice.taxAmount.toFixed(2)}</Text>
            </View>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              width: 200,
              borderTopWidth: 1,
              borderTopColor: '#ddd',
              paddingTop: 8
            }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total:</Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#007AFF' }}>
                ${mockInvoice.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Terms and Notes */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Terms & Conditions</Text>
            <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>{mockInvoice.terms}</Text>
          </View>
          
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Notes</Text>
            <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>{mockInvoice.notes}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ marginBottom: 20 }}>
          {/* Primary Actions */}
          <TouchableOpacity
            style={{
              backgroundColor: '#007AFF',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 12
            }}
            onPress={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
              {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#34C759',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 12
            }}
            onPress={handleShareInvoice}
            disabled={isSharing}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
              {isSharing ? 'Sharing...' : 'Share Invoice'}
            </Text>
          </TouchableOpacity>

          {/* Social Sharing Options */}
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, textAlign: 'center' }}>
            Share via:
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#25D366',
                padding: 12,
                borderRadius: 8,
                flex: 1,
                marginRight: 8,
                alignItems: 'center'
              }}
              onPress={handleWhatsAppShare}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#007AFF',
                padding: 12,
                borderRadius: 8,
                flex: 1,
                marginLeft: 8,
                alignItems: 'center'
              }}
              onPress={handleEmailShare}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Email</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: '#8E8E93',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center'
            }}
            onPress={handleSMSShare}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Send SMS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}