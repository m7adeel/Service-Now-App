import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect } from 'react'

import StepIndicator from 'react-native-step-indicator';
import Swiper from 'react-native-swiper';

import CreateQuote from '@/components/pages/new-client/CreateQuote'
import NewClient from '@/components/pages/new-client/NewClient'
import ScheduleJob from '@/components/pages/new-client/ScheduleJob'
import SendInvoice from '@/components/pages/new-client/SendInvoice'
import { useNewServiceStore } from '@/store/newServiceStore'

const PAGES = [
    {
        id: 1,
        name: 'Add Client',
        page: NewClient,
        label: 'Select Client'
    },
    {
        id: 2,
        name: 'Quote',
        page: CreateQuote,
        label: 'Add a Quote'
    },
    {
        id: 3,
        name: 'Schedule',
        page: ScheduleJob,
        label: 'Schedule Job'
    },
    {
        id: 4,
        name: 'Invoice',
        page: SendInvoice,
        label: 'Finalize'
    }
]

export default function CreateService() {
    const { 
        currentStep, 
        setCurrentStep, 
        canProceedToNextStep,
        resetAll 
    } = useNewServiceStore()

    const onStepPress = (position: number) => {
        // Only allow navigation to completed steps or the next available step
        if (position <= currentStep || (position === currentStep + 1 && canProceedToNextStep())) {
            setCurrentStep(position);
        } else {
            Alert.alert(
                'Step Locked',
                'Please complete the current step before proceeding to this one.',
                [{ text: 'OK' }]
            );
        }
    };

    const renderViewPagerPage = (data: any) => {
        return (
          <View key={data.id} className='flex flex-1'>
            <data.page />
          </View>
        );
      };

    const handleReset = () => {
        Alert.alert(
            'Reset Service Creation',
            'Are you sure you want to reset all progress? This will clear all entered data.',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Reset', 
                    style: 'destructive',
                    onPress: () => {
                        resetAll()
                        setCurrentStep(0)
                    }
                }
            ]
        )
    }

    return (
        <SafeAreaView className='flex-1 bg-white'>
            {/* Header with Reset Button */}
            <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#eee'
            }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333' }}>
                    {PAGES[currentStep].label}
                </Text>
                <TouchableOpacity
                    onPress={handleReset}
                    style={{
                        backgroundColor: '#dc3545',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 6
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                        Reset
                    </Text>
                </TouchableOpacity>
            </View>

            <StepIndicator
                customStyles={customStyles}
                currentPosition={currentStep}
                onPress={onStepPress}
                labels={PAGES.map(item => item.name)}
                stepCount={PAGES.length}
            />
            
            <Swiper
                loop={false}
                index={currentStep}
                onIndexChanged={setCurrentStep}
                showsPagination={false}
                scrollEnabled={false} // Disable manual swiping to enforce step-by-step flow
            >
                {PAGES.map((page) => renderViewPagerPage(page))}
            </Swiper>
        </SafeAreaView>
    )
}

const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013'
}