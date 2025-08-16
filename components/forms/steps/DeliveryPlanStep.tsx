import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useFormContext } from 'react-hook-form'
import { PatientForm } from '@/types/patients'
import { FormField } from '../components/FormField'
import { FormSelect } from '../components/FormSelect'
import { FormCheckbox } from '../components/FormCheckbox'

// Updated to match schema: 'Home' | 'Health Facility' | 'Other'
const DELIVERY_LOCATION_OPTIONS = [
  { label: 'Health Facility', value: 'Health Facility' },
  { label: 'Home', value: 'Home' },
  { label: 'Other', value: 'Other' },
]

export function DeliveryPlanStep() {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<PatientForm>()

  // Watch for conditional field display
  const plannedDeliveryPlace = watch('deliveryPlan.plannedDeliveryPlace')
  const hasRisks = watch('riskAssessment.identifiedRisks.hasRisks')
  const isReferred = watch('riskAssessment.referralToHigherFacility.isReferred')

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
            helperText='Choose the most appropriate delivery location based on risk assessment and accessibility'
          />

          {/* Show "Other" specification field only when "Other" is selected */}
          {plannedDeliveryPlace === 'Other' && (
            <FormField
              name='deliveryPlan.specifyIfOther'
              control={control}
              label='Specify Other Location *'
              placeholder='Please specify the other delivery location'
              error={errors.deliveryPlan?.specifyIfOther?.message}
              helperText='Provide details about the alternative delivery location'
            />
          )}

          {/* Show facility name field for Health Facility or Other */}
          {(plannedDeliveryPlace === 'Health Facility' ||
            plannedDeliveryPlace === 'Other') && (
            <FormField
              name='deliveryPlan.facilityNameIfKnown'
              control={control}
              label='Facility Name'
              placeholder='Enter name of the delivery facility'
              error={errors.deliveryPlan?.facilityNameIfKnown?.message}
              helperText='Name of the specific health facility where delivery is planned'
            />
          )}

          <FormCheckbox
            name='deliveryPlan.transportPlanForEmergencies'
            control={control}
            label='Emergency Transport Plan Available'
            error={errors.deliveryPlan?.transportPlanForEmergencies?.message}
            helperText='Confirm that there is a plan for emergency transportation to a health facility if complications arise'
          />
        </View>

        {/* Risk Assessment */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Risk Assessment
          </Text>

          <Text className='text-sm text-slate-600 mb-4'>
            Based on the patient's medical history, obstetric history, and
            current pregnancy status, assess any identified risks.
          </Text>

          <FormCheckbox
            name='riskAssessment.identifiedRisks.hasRisks'
            control={control}
            label='Identified Risk Factors Present'
            error={errors.riskAssessment?.identifiedRisks?.hasRisks?.message}
            helperText='Check if any risk factors have been identified during assessment'
          />

          {/* Show risk specification field only when risks are identified */}
          {hasRisks && (
            <FormField
              name='riskAssessment.identifiedRisks.specifyRisks'
              control={control}
              label='Specify Risk Factors *'
              placeholder='List the specific risk factors identified (e.g., hypertension, previous cesarean, age >35, etc.)'
              multiline
              numberOfLines={3}
              error={
                errors.riskAssessment?.identifiedRisks?.specifyRisks?.message
              }
              helperText='Detail all identified risk factors that may affect pregnancy or delivery'
            />
          )}

          <FormCheckbox
            name='riskAssessment.referralToHigherFacility.isReferred'
            control={control}
            label='Referral to Higher-Level Facility Required'
            error={
              errors.riskAssessment?.referralToHigherFacility?.isReferred
                ?.message
            }
            helperText='Check if patient needs referral to a facility with specialized care capabilities'
          />

          {/* Show referral reason field only when referral is needed */}
          {isReferred && (
            <FormField
              name='riskAssessment.referralToHigherFacility.reasonIfYes'
              control={control}
              label='Reason for Referral *'
              placeholder='Specify the medical reason requiring referral (e.g., high-risk pregnancy, complications, specialized care needed)'
              multiline
              numberOfLines={3}
              error={
                errors.riskAssessment?.referralToHigherFacility?.reasonIfYes
                  ?.message
              }
              helperText='Provide detailed medical justification for the referral to ensure appropriate care'
            />
          )}
        </View>

        {/* Recommendations Section */}
        <View className='bg-blue-50 border border-blue-200 p-4 rounded-lg'>
          <Text className='text-blue-800 font-medium mb-2'>
            📋 Delivery Planning Guidelines
          </Text>
          <Text className='text-blue-700 text-sm leading-5'>
            • <Text className='font-medium'>Health Facility:</Text> Recommended
            for all deliveries, especially first pregnancies or those with risk
            factors{'\n'}• <Text className='font-medium'>Home Delivery:</Text>{' '}
            Only for low-risk pregnancies with skilled birth attendant and
            emergency transport plan{'\n'}•{' '}
            <Text className='font-medium'>Emergency Plan:</Text> Always ensure
            transportation to health facility is available within 30 minutes
          </Text>
        </View>

        {/* Bottom spacing for navigation buttons */}
        <View className='h-20' />
      </View>
    </ScrollView>
  )
}
