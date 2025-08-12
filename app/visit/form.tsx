import React from 'react'
import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import PatientOnboardingForm from '@/components/forms/PatientOnboardingForm'
import FollowUpVisitForm from '@/components/forms/visit/FollowUpVisitForm'

export default function Form() {
  const { type, patientId } = useLocalSearchParams<{
    type: 'first' | 'follow-up'
    patientId?: string
  }>()

  // Handle invalid or missing type parameter
  if (!type || (type !== 'first' && type !== 'follow-up')) {
    return (
      <View className='flex-1 items-center justify-center px-6'>
        <Text className='text-lg font-semibold text-slate-800 mb-2'>
          Invalid Visit Type
        </Text>
        <Text className='text-slate-600 text-center'>
          Please select a valid visit type from the previous screen.
        </Text>
      </View>
    )
  }

  // For follow-up visits, ensure we have a patient ID
  if (type === 'follow-up' && !patientId) {
    return (
      <View className='flex-1 items-center justify-center px-6'>
        <Text className='text-lg font-semibold text-slate-800 mb-2'>
          Patient Required
        </Text>
        <Text className='text-slate-600 text-center'>
          Please select a patient for the follow-up visit.
        </Text>
      </View>
    )
  }

  // Render appropriate form based on visit type
  switch (type) {
    case 'first':
      return <PatientOnboardingForm />

    case 'follow-up':
      return <FollowUpVisitForm patientId={patientId!} />

    default:
      return (
        <View className='flex-1 items-center justify-center'>
          <Text className='text-lg text-slate-600'>Loading...</Text>
        </View>
      )
  }
}
