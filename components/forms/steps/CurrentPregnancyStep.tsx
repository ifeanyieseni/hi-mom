import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useFormContext } from 'react-hook-form'
import { PatientForm } from '@/types/patients'
import { FormField } from '../components/FormField'
import { FormSelect } from '../components/FormSelect'

const FETAL_MOVEMENT_OPTIONS = [
  { label: 'Good', value: 'Good' },
  { label: 'Reduced', value: 'Reduced' },
  { label: 'Absent', value: 'Absent' },
]

export function CurrentPregnancyStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext<PatientForm>()

  return (
    <ScrollView
      className='flex-1 px-6 py-4'
      showsVerticalScrollIndicator={false}
    >
      <View className='space-y-6'>
        {/* Current Pregnancy Status */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Current Pregnancy Status
          </Text>

          <FormField
            name='currentPregnancyDetails.currentGestationWeeks'
            control={control}
            label='Current Gestation (weeks) *'
            placeholder='Enter weeks (e.g., 20)'
            keyboardType='numeric'
            error={
              errors.currentPregnancyDetails?.currentGestationWeeks?.message
            }
          />
        </View>

        {/* Vital Signs */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Vital Signs & Measurements
          </Text>

          <FormField
            name='currentPregnancyDetails.bloodPressure'
            control={control}
            label='Blood Pressure'
            placeholder='Enter BP (e.g., 120/80)'
            error={errors.currentPregnancyDetails?.bloodPressure?.message}
          />

          <FormField
            name='currentPregnancyDetails.weight'
            control={control}
            label='Current Weight (kg)'
            placeholder='Enter weight in kg (e.g., 65.5)'
            keyboardType='decimal-pad'
            error={errors.currentPregnancyDetails?.weight?.message}
          />

          <FormField
            name='currentPregnancyDetails.fundalHeight'
            control={control}
            label='Fundal Height (cm)'
            placeholder='Enter fundal height in cm (e.g., 20)'
            keyboardType='decimal-pad'
            error={errors.currentPregnancyDetails?.fundalHeight?.message}
          />
        </View>

        {/* Fetal Assessment */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Fetal Assessment
          </Text>

          <FormField
            name='currentPregnancyDetails.fetalHeartRate'
            control={control}
            label='Fetal Heart Rate (bpm)'
            placeholder='Enter heart rate (e.g., 140)'
            keyboardType='numeric'
            error={errors.currentPregnancyDetails?.fetalHeartRate?.message}
          />

          <FormSelect
            name='currentPregnancyDetails.fetalMovement'
            control={control}
            label='Fetal Movement'
            placeholder='Select fetal movement status'
            options={FETAL_MOVEMENT_OPTIONS}
            error={errors.currentPregnancyDetails?.fetalMovement?.message}
          />
        </View>

        {/* Laboratory Tests */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Basic Tests
          </Text>

          <FormField
            name='currentPregnancyDetails.urineTest'
            control={control}
            label='Urine Test Results'
            placeholder='Enter urine test results (e.g., Protein +, Glucose -)'
            error={errors.currentPregnancyDetails?.urineTest?.message}
          />
        </View>

        {/* Clinical Notes */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Clinical Notes
          </Text>

          <FormField
            name='currentPregnancyDetails.notes'
            control={control}
            label='Additional Notes'
            placeholder='Enter any additional observations, symptoms, or concerns...'
            multiline
            numberOfLines={4}
            error={errors.currentPregnancyDetails?.notes?.message}
          />
        </View>

        {/* Bottom spacing for navigation buttons */}
        <View className='h-20' />
      </View>
    </ScrollView>
  )
}
