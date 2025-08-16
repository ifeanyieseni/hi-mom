import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useFormContext } from 'react-hook-form'
import { PatientForm } from '@/types/patients'
import { FormCheckbox } from '../components/FormCheckbox'
import { FormSelect } from '../components/FormSelect'
import { FormField } from '../components/FormField'

const HIV_STATUS_OPTIONS = [
  { label: 'Positive', value: 'Positive' },
  { label: 'Negative', value: 'Negative' },
  { label: 'Unknown/Not Tested', value: 'Unknown/Not Tested' },
]

const HEPATITIS_STATUS_OPTIONS = [
  { label: 'Positive', value: 'Positive' },
  { label: 'Negative', value: 'Negative' },
  { label: 'Unknown/Not Tested', value: 'Unknown/Not Tested' },
]

export function MedicalHistoryStep() {
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
        {/* Chronic Conditions */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Chronic Medical Conditions
          </Text>

          <FormCheckbox
            name='medicalHistory.hypertension'
            control={control}
            label='Hypertension (High Blood Pressure)'
            error={errors.medicalHistory?.hypertension?.message}
          />

          <FormCheckbox
            name='medicalHistory.diabetes'
            control={control}
            label='Diabetes'
            error={errors.medicalHistory?.diabetes?.message}
          />

          <FormCheckbox
            name='medicalHistory.asthma'
            control={control}
            label='Asthma'
            error={errors.medicalHistory?.asthma?.message}
          />

          <FormCheckbox
            name='medicalHistory.epilepsy'
            control={control}
            label='Epilepsy'
            error={errors.medicalHistory?.epilepsy?.message}
          />

          <FormCheckbox
            name='medicalHistory.kidneyRenalDisease'
            control={control}
            label='Kidney/Renal Disease'
            error={errors.medicalHistory?.kidneyRenalDisease?.message}
          />

          <FormCheckbox
            name='medicalHistory.heartDisease'
            control={control}
            label='Heart Disease'
            error={errors.medicalHistory?.heartDisease?.message}
          />

          <FormCheckbox
            name='medicalHistory.thyroidProblems'
            control={control}
            label='Thyroid Problems'
            error={errors.medicalHistory?.thyroidProblems?.message}
          />

          <FormCheckbox
            name='medicalHistory.tuberculosis'
            control={control}
            label='Tuberculosis (TB)'
            error={errors.medicalHistory?.tuberculosis?.message}
          />
        </View>

        {/* Blood-Related Conditions */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Blood-Related Conditions
          </Text>

          <FormCheckbox
            name='medicalHistory.sickleCellDisease'
            control={control}
            label='Sickle Cell Disease'
            error={errors.medicalHistory?.sickleCellDisease?.message}
          />

          <FormCheckbox
            name='medicalHistory.sickleCellTrait'
            control={control}
            label='Sickle Cell Trait'
            error={errors.medicalHistory?.sickleCellTrait?.message}
          />

          <FormCheckbox
            name='medicalHistory.chronicAnaemia'
            control={control}
            label='Chronic Anaemia'
            error={errors.medicalHistory?.chronicAnaemia?.message}
          />

          <FormCheckbox
            name='medicalHistory.bloodTransfusions'
            control={control}
            label='Previous Blood Transfusions'
            error={errors.medicalHistory?.bloodTransfusions?.message}
          />
        </View>

        {/* Infectious Disease Status */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Infectious Disease Status
          </Text>

          <FormSelect
            name='medicalHistory.hivStatus'
            control={control}
            label='HIV Status *'
            placeholder='Select HIV status'
            options={HIV_STATUS_OPTIONS}
            error={errors.medicalHistory?.hivStatus?.message}
          />

          <FormSelect
            name='medicalHistory.hepatitisBStatus'
            control={control}
            label='Hepatitis B Status *'
            placeholder='Select Hepatitis B status'
            options={HEPATITIS_STATUS_OPTIONS}
            error={errors.medicalHistory?.hepatitisBStatus?.message}
          />

          <FormCheckbox
            name='medicalHistory.recentMalariaEpisodes'
            control={control}
            label='Recent Malaria Episodes (within 6 months)'
            error={errors.medicalHistory?.recentMalariaEpisodes?.message}
          />
        </View>

        {/* Other Medical Information */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Other Medical Information
          </Text>

          <FormField
            name='medicalHistory.otherChronicIllnessOrMedications'
            control={control}
            label='Other Chronic Illnesses or Medications'
            placeholder='Please specify any other conditions or medications...'
            multiline
            numberOfLines={3}
            error={
              errors.medicalHistory?.otherChronicIllnessOrMedications?.message
            }
          />
        </View>

        {/* Bottom spacing for navigation buttons */}
        <View className='h-20' />
      </View>
    </ScrollView>
  )
}
