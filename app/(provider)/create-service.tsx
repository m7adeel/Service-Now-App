import { View, Text, SafeAreaView } from 'react-native'
import React, { useState } from 'react'

import StepIndicator from 'react-native-step-indicator';
import Swiper from 'react-native-swiper';

import CreateQuote from '@/components/pages/new-client/CreateQuote'
import NewClient from '@/components/pages/new-client/NewClient'
import ScheduleJob from '@/components/pages/new-client/ScheduleJob'
import SendInvoice from '@/components/pages/new-client/SendInvoice'

const PAGES = [
    {
        id: 1,
        name: 'Add Client',
        page: NewClient
    },
    {
        id: 2,
        name: 'Quote',
        page: CreateQuote
    },
    {
        id: 3,
        name: 'Schedule',
        page: ScheduleJob
    },
    {
        id: 4,
        name: 'Invoice',
        page: SendInvoice
    },
]

export default function CreateService() {
    const [currentStep, setCurrentStep] = useState(0)

    const onStepPress = (position: number) => {
        setCurrentStep(position);
    };

    const renderViewPagerPage = (data: any) => {
        return (
          <View key={data.id} className='flex flex-1'>
            <data.page />
          </View>
        );
      };

    return (
        <SafeAreaView className='flex-1 bg-white'>
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
                onIndexChanged={onStepPress}
                showsPagination={false}
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