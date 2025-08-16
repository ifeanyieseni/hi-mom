import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useFormContext } from 'react-hook-form'
import { PatientForm } from '@/types/patients'
import { FormField } from '../components/FormField'
import { FormSelect } from '../components/FormSelect'
import { FormDatePicker } from '../components/FormDatePicker'

const TEST_RESULT_OPTIONS = [
  { label: 'Positive', value: 'Positive' },
  { label: 'Negative', value: 'Negative' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Not Done', value: 'Not Done' },
]

const BLOOD_GROUP_OPTIONS = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
  { label: 'Unknown', value: 'Unknown' },
]

const MALARIA_TEST_OPTIONS = [
  { label: 'Positive', value: 'Positive' },
  { label: 'Negative', value: 'Negative' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Not Done', value: 'Not Done' },
]

export function LaboratoryInvestigationsStep() {
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
        {/* Blood Tests */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Blood Tests
          </Text>

          <FormSelect
            name='laboratoryInvestigations.bloodGroupAndRhesus'
            control={control}
            label='Blood Group *'
            placeholder='Select blood group'
            options={BLOOD_GROUP_OPTIONS}
            error={
              errors.laboratoryInvestigations?.bloodGroupAndRhesus?.message
            }
          />

          <FormField
            name='laboratoryInvestigations.haemoglobinLevel'
            control={control}
            label='Haemoglobin Level (g/dL)'
            placeholder='Enter haemoglobin level'
            keyboardType='numeric'
            error={errors.laboratoryInvestigations?.haemoglobinLevel?.message}
          />

          <FormField
            name='laboratoryInvestigations.packedCellVolume'
            control={control}
            label='Packed Cell Volume (PCV) %'
            placeholder='Enter PCV percentage (e.g., 35)'
            keyboardType='decimal-pad'
            error={errors.laboratoryInvestigations?.packedCellVolume?.message}
          />
        </View>

        {/* Infectious Disease Screening */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Infectious Disease Screening
          </Text>

          <FormSelect
            name='laboratoryInvestigations.hivTestResult.result'
            control={control}
            label='HIV Test Result *'
            placeholder='Select HIV test result'
            options={TEST_RESULT_OPTIONS}
            error={
              errors.laboratoryInvestigations?.hivTestResult?.result?.message
            }
          />

          <FormDatePicker
            name='laboratoryInvestigations.hivTestResult.dateTested'
            control={control}
            label='HIV Test Date'
            error={
              errors.laboratoryInvestigations?.hivTestResult?.dateTested
                ?.message
            }
          />

          <FormSelect
            name='laboratoryInvestigations.syphilisTestResult.result'
            control={control}
            label='Syphilis Test Result *'
            placeholder='Select syphilis test result'
            options={TEST_RESULT_OPTIONS}
            error={
              errors.laboratoryInvestigations?.syphilisTestResult?.result
                ?.message
            }
          />

          <FormDatePicker
            name='laboratoryInvestigations.syphilisTestResult.dateTested'
            control={control}
            label='Syphilis Test Date'
            error={
              errors.laboratoryInvestigations?.syphilisTestResult?.dateTested
                ?.message
            }
          />

          <FormSelect
            name='laboratoryInvestigations.hepatitisBTestResult.result'
            control={control}
            label='Hepatitis B Test Result *'
            placeholder='Select hepatitis B test result'
            options={TEST_RESULT_OPTIONS}
            error={
              errors.laboratoryInvestigations?.hepatitisBTestResult?.result
                ?.message
            }
          />

          <FormDatePicker
            name='laboratoryInvestigations.hepatitisBTestResult.dateTested'
            control={control}
            label='Hepatitis B Test Date'
            error={
              errors.laboratoryInvestigations?.hepatitisBTestResult?.dateTested
                ?.message
            }
          />
        </View>

        {/* Malaria Testing */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Malaria Testing
          </Text>

          <FormSelect
            name='laboratoryInvestigations.malariaTestResult.result'
            control={control}
            label='Malaria Test Result *'
            placeholder='Select malaria test result'
            options={MALARIA_TEST_OPTIONS}
            error={
              errors.laboratoryInvestigations?.malariaTestResult?.result
                ?.message
            }
          />

          <FormDatePicker
            name='laboratoryInvestigations.malariaTestResult.dateTested'
            control={control}
            label='Malaria Test Date'
            error={
              errors.laboratoryInvestigations?.malariaTestResult?.dateTested
                ?.message
            }
          />
        </View>

        {/* Additional Laboratory Tests */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Additional Tests
          </Text>

          <FormField
            name='laboratoryInvestigations.otherTests'
            control={control}
            label='Other Laboratory Tests'
            placeholder='Enter details of any other tests performed...'
            multiline
            numberOfLines={3}
            error={errors.laboratoryInvestigations?.otherTests?.message}
          />
        </View>

        {/* Bottom spacing for navigation buttons */}
        <View className='h-20' />
      </View>
    </ScrollView>
  )
}
