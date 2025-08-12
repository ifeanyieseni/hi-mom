import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useFormContext } from 'react-hook-form'
import { PatientForm } from '@/types/patients'
import { FormField } from '../components/FormField'
import { FormSelect } from '../components/FormSelect'
import { FormCheckbox } from '../components/FormCheckbox'

const DELIVERY_LOCATION_OPTIONS = [
  { label: 'Primary Health Centre', value: 'Primary Health Centre' },
  { label: 'General Hospital', value: 'General Hospital' },
  { label: 'Teaching Hospital', value: 'Teaching Hospital' },
  { label: 'Private Hospital', value: 'Private Hospital' },
  { label: 'Home', value: 'Home' },
  {
    label: 'Traditional Birth Attendant',
    value: 'Traditional Birth Attendant',
  },
  { label: 'Other', value: 'Other' },
]

const TRANSPORT_OPTIONS = [
  { label: 'Personal Vehicle', value: 'Personal Vehicle' },
  { label: 'Public Transport', value: 'Public Transport' },
  { label: 'Ambulance', value: 'Ambulance' },
  { label: 'Community Transport', value: 'Community Transport' },
  { label: 'Walking', value: 'Walking' },
  { label: 'Other', value: 'Other' },
]

const RISK_LEVEL_OPTIONS = [
  { label: 'Low Risk', value: 'Low Risk' },
  { label: 'Moderate Risk', value: 'Moderate Risk' },
  { label: 'High Risk', value: 'High Risk' },
]

export function DeliveryPlanStep() {
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
        {/* Delivery Plan */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Delivery Plan
          </Text>

          <FormSelect
            name='deliveryPlan.plannedDeliveryPlace'
            control={control}
            label='Planned Delivery Location *'
            placeholder='Select planned delivery location'
            options={DELIVERY_LOCATION_OPTIONS}
            error={errors.deliveryPlan?.plannedDeliveryPlace?.message}
          />

          <FormField
            name='deliveryPlan.specifyIfOther'
            control={control}
            label='Specify if Other'
            placeholder='Please specify if other delivery location'
            error={errors.deliveryPlan?.specifyIfOther?.message}
          />

          <FormField
            name='deliveryPlan.facilityNameIfKnown'
            control={control}
            label='Delivery Facility Name'
            placeholder='Enter name of delivery facility'
            error={errors.deliveryPlan?.facilityNameIfKnown?.message}
          />

          <FormCheckbox
            name='deliveryPlan.transportPlanForEmergencies'
            control={control}
            label='Transport Plan for Emergencies Available'
            error={errors.deliveryPlan?.transportPlanForEmergencies?.message}
          />
        </View>

        {/* Risk Assessment */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Risk Assessment
          </Text>

          <Text className='text-base font-medium text-slate-700 mb-3'>
            Identified Risks
          </Text>

          <FormCheckbox
            name='riskAssessment.identifiedRisks.hasRisks'
            control={control}
            label='Has Identified Risks'
            error={errors.riskAssessment?.identifiedRisks?.hasRisks?.message}
          />

          <FormField
            name='riskAssessment.identifiedRisks.specifyRisks'
            control={control}
            label='Specify Risks'
            placeholder='Please specify the identified risks'
            multiline
            error={
              errors.riskAssessment?.identifiedRisks?.specifyRisks?.message
            }
          />

          <Text className='text-base font-medium text-slate-700 mb-3 mt-4'>
            Referral to Higher Facility
          </Text>

          <FormCheckbox
            name='riskAssessment.referralToHigherFacility.isReferred'
            control={control}
            label='Referral to Higher Facility Required'
            error={
              errors.riskAssessment?.referralToHigherFacility?.isReferred
                ?.message
            }
          />

          <FormField
            name='riskAssessment.referralToHigherFacility.reasonIfYes'
            control={control}
            label='Reason for Referral'
            placeholder='Please specify reason for referral'
            multiline
            error={
              errors.riskAssessment?.referralToHigherFacility?.reasonIfYes
                ?.message
            }
          />
        </View>



        {/* Bottom spacing for navigation buttons */}
        <View className='h-20' />
      </View>
    </ScrollView>
  )
}
