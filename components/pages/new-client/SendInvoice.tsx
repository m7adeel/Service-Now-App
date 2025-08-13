import { View, Text, TouchableOpacity, ScrollView, Alert, Share, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNewServiceStore } from '@/store/newServiceStore'

export default function SendInvoice() {
  const { 
    client, 
    quote, 
    job, 
    invoice, 
    updateInvoice, 
    previousStep, 
    nextStep,
    resetAll 
  } = useNewServiceStore()

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // Initialize invoice data from quote and job data
  useEffect(() => {
    if (quote.services.length > 0 && !invoice.services.length) {
      updateInvoice({
        services: quote.services,
        subtotal: quote.subtotal,
        taxRate: quote.taxRate,
        taxAmount: quote.taxAmount,
        total: quote.total,
        terms: quote.terms,
        notes: quote.notes
      })
    }
  }, [quote])

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
        title: `Invoice ${invoice.invoiceNumber}`,
        message: `Invoice ${invoice.invoiceNumber} for ${client?.name || 'Client'} - Total: $${invoice.total.toFixed(2)}`,
        url: `https://yourapp.com/invoices/${invoice.invoiceNumber}`, // Replace with actual URL
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
      const message = `Invoice ${invoice.invoiceNumber} for ${client?.name || 'Client'}\n\nTotal Amount: $${invoice.total.toFixed(2)}\nDue Date: ${invoice.dueDate}\n\nView invoice: https://yourapp.com/invoices/${invoice.invoiceNumber}`
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
      const subject = `Invoice ${invoice.invoiceNumber} - ${client?.name || 'Client'}`
      const body = `Dear ${client?.name || 'Client'},\n\nPlease find attached invoice ${invoice.invoiceNumber}.\n\nTotal Amount: $${invoice.total.toFixed(2)}\nDue Date: ${invoice.dueDate}\n\nThank you for your business!\n\nBest regards,\nYour Company Name`
      
      const mailtoUrl = `mailto:${client?.email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      
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
      const message = `Invoice ${invoice.invoiceNumber} for ${client?.name || 'Client'}. Total: $${invoice.total.toFixed(2)}. Due: ${invoice.dueDate}. View: https://yourapp.com/invoices/${invoice.invoiceNumber}`
      const smsUrl = `sms:${client?.phoneNumber || ''}?body=${encodeURIComponent(message)}`
      
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

  const handleComplete = () => {
    Alert.alert(
      'Service Complete!',
      'All steps have been completed successfully. Would you like to start a new service?',
      [
        {
          text: 'Start New Service',
          onPress: () => {
            resetAll()
            // Navigate back to first step
          }
        },
        {
          text: 'Stay Here',
          style: 'cancel'
        }
      ]
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

  if (!job.jobTitle) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          Please go back and schedule the job first
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
            Go Back to Job Schedule
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
          Invoice Details
        </Text>

        {/* Service Summary */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Service Summary</Text>
          <View style={{ backgroundColor: '#f8f9fa', padding: 12, borderRadius: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>Job: {job.jobTitle}</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>Date: {job.scheduledDate} at {job.startTime}</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>Location: {job.location}</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>Priority: {job.priority}</Text>
          </View>
        </View>

        {/* Invoice Header */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#007AFF' }}>
                Your Company Name
              </Text>
              <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                Your Company Address
              </Text>
              <Text style={{ fontSize: 14, color: '#666' }}>
                Your Phone • Your Email
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                INVOICE
              </Text>
              <Text style={{ fontSize: 16, color: '#666', marginTop: 4 }}>
                #{invoice.invoiceNumber || 'INV-2024-001'}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Bill To:</Text>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{client.name}</Text>
              {client.location && (
                <Text style={{ fontSize: 14, color: '#666' }}>{client.location}</Text>
              )}
              <Text style={{ fontSize: 14, color: '#666' }}>{client.email}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>{client.phoneNumber}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 14, color: '#666' }}>Issue Date:</Text>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>{invoice.issueDate}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 14, color: '#666' }}>Due Date:</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#ff3b30' }}>{invoice.dueDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Services */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>Services</Text>
          
          {invoice.services.map((service, index) => (
            <View key={service.id} style={{
              borderBottomWidth: index === invoice.services.length - 1 ? 0 : 1,
              borderBottomColor: '#eee',
              paddingBottom: index === invoice.services.length - 1 ? 0 : 12,
              marginBottom: index === invoice.services.length - 1 ? 0 : 12
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
                  {service.quantity} × ${service.basePrice.toFixed(2)}
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
              <Text style={{ fontSize: 16 }}>${invoice.subtotal.toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 200, marginBottom: 8 }}>
              <Text style={{ fontSize: 16 }}>Tax ({invoice.taxRate}%):</Text>
              <Text style={{ fontSize: 16 }}>${invoice.taxAmount.toFixed(2)}</Text>
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
                ${invoice.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Terms and Notes */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Terms & Conditions</Text>
            <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>{invoice.terms}</Text>
          </View>
          
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Notes</Text>
            <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>{invoice.notes}</Text>
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
              alignItems: 'center',
              marginBottom: 12
            }}
            onPress={handleSMSShare}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Send SMS</Text>
          </TouchableOpacity>
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
              backgroundColor: '#28a745',
              padding: 16,
              borderRadius: 8,
              flex: 1,
              alignItems: 'center'
            }}
            onPress={nextStep}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Finalize
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}