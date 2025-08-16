import React from 'react'
import { View, Text } from 'react-native'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <View className='mt-3'>
      {/* Progress Bar */}
      <View className='flex-row items-center mb-2'>
        <View className='flex-1 h-2 bg-slate-200 rounded-full overflow-hidden'>
          <View
            className='h-full bg-indigo-600 rounded-full transition-all duration-300'
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </View>
      </View>

      {/* Step Counter */}
      <Text className='text-sm text-slate-600 text-right'>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  )
}
