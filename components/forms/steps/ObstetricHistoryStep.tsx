import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useFormContext } from 'react-hook-form'
import { PatientForm } from '@/types/patients'
import { FormField } from '../components/FormField'
import { FormSelect } from '../components/FormSelect'
import { FormCheckbox } from '../components/FormCheckbox'
import { FormDatePicker } from '../components/FormDatePicker'

const PREVIOUS_DELIVERIES_OPTIONS = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3+', value: '3+' },
]

export function ObstetricHistoryStep() {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<PatientForm>()

  // Watch for conditional fields
  const previousAbortions = watch(
    'obstetricHistory.previousAbortions.hasAbortions'
  )
  const previousCesarean = watch(
    'obstetricHistory.previousCesareanSections.hadCesarean'
  )

  return (
    <ScrollView
      className='flex-1 px-6 py-4'
      showsVerticalScrollIndicator={false}
    >
      <View className='space-y-6'>
        {/* Pregnancy Overview */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Pregnancy History
          </Text>

          <FormField
            name='obstetricHistory.totalPregnancies'
            control={control}
            label='Total Number of Pregnancies (including current)'
            placeholder='Enter total pregnancies'
            keyboardType='numeric'
            error={errors.obstetricHistory?.totalPregnancies?.message}
          />

          <FormField
            name='obstetricHistory.numberOfLiveBirths'
            control={control}
            label='Number of Live Births'
            placeholder='Enter number of live births'
            keyboardType='numeric'
            error={errors.obstetricHistory?.numberOfLiveBirths?.message}
          />

          <FormSelect
            name='obstetricHistory.numberOfPreviousDeliveries'
            control={control}
            label='Number of Previous Deliveries'
            placeholder='Select number of deliveries'
            options={PREVIOUS_DELIVERIES_OPTIONS}
            error={errors.obstetricHistory?.numberOfPreviousDeliveries?.message}
          />
        </View>

        {/* Previous Complications */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Previous Pregnancy Complications
          </Text>

          {/* Previous Abortions */}
          <FormCheckbox
            name='obstetricHistory.previousAbortions.hasAbortions'
            control={control}
            label='Previous Abortions/Miscarriages'
            error={
              errors.obstetricHistory?.previousAbortions?.hasAbortions?.message
            }
          />

          {previousAbortions && (
            <FormField
              name='obstetricHistory.previousAbortions.countIfYes'
              control={control}
              label='Number of Abortions/Miscarriages'
              placeholder='Enter number'
              keyboardType='numeric'
              error={
                errors.obstetricHistory?.previousAbortions?.countIfYes?.message
              }
            />
          )}

          <FormCheckbox
            name='obstetricHistory.previousStillbirths'
            control={control}
            label='Previous Stillbirths'
            error={errors.obstetricHistory?.previousStillbirths?.message}
          />

          {/* Previous Cesarean Sections */}
          <FormCheckbox
            name='obstetricHistory.previousCesareanSections.hadCesarean'
            control={control}
            label='Previous Cesarean Sections'
            error={
              errors.obstetricHistory?.previousCesareanSections?.hadCesarean
                ?.message
            }
          />

          {previousCesarean && (
            <FormField
              name='obstetricHistory.previousCesareanSections.countIfYes'
              control={control}
              label='Number of Cesarean Sections'
              placeholder='Enter number'
              keyboardType='numeric'
              error={
                errors.obstetricHistory?.previousCesareanSections?.countIfYes
                  ?.message
              }
            />
          )}

          <FormCheckbox
            name='obstetricHistory.previousVacuumForcepsDelivery'
            control={control}
            label='Previous Vacuum/Forceps Delivery'
            error={
              errors.obstetricHistory?.previousVacuumForcepsDelivery?.message
            }
          />

          <FormCheckbox
            name='obstetricHistory.previousAPHPPH'
            control={control}
            label='Previous Antepartum/Postpartum Hemorrhage (APH/PPH)'
            error={errors.obstetricHistory?.previousAPHPPH?.message}
          />

          <FormCheckbox
            name='obstetricHistory.previousEclampsiaPreeclampsia'
            control={control}
            label='Previous Eclampsia/Preeclampsia'
            error={
              errors.obstetricHistory?.previousEclampsiaPreeclampsia?.message
            }
          />

          <FormCheckbox
            name='obstetricHistory.previousSymphysiotomyFistulaRepair'
            control={control}
            label='Previous Symphysiotomy/Fistula Repair'
            error={
              errors.obstetricHistory?.previousSymphysiotomyFistulaRepair
                ?.message
            }
          />
        </View>

        {/* Important Dates */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Important Dates
          </Text>

          <FormDatePicker
            name='obstetricHistory.lastMenstrualPeriod'
            control={control}
            label='Last Menstrual Period (LMP) *'
            placeholder='Select LMP date'
            error={errors.obstetricHistory?.lastMenstrualPeriod?.message}
          />

          <FormDatePicker
            name='obstetricHistory.estimatedDateOfDelivery'
            control={control}
            label='Estimated Date of Delivery (EDD) *'
            placeholder='Select EDD'
            error={errors.obstetricHistory?.estimatedDateOfDelivery?.message}
          />
        </View>

        {/* Previous Birth Details */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Previous Birth Details
          </Text>

          <FormField
            name='obstetricHistory.lastBirthWeightKg'
            control={control}
            label='Last Birth Weight (kg)'
            placeholder='Enter weight in kg (e.g., 3.2)'
            keyboardType='decimal-pad'
            error={errors.obstetricHistory?.lastBirthWeightKg?.message}
          />

          <FormField
            name='obstetricHistory.intervalSinceLastDeliveryYears'
            control={control}
            label='Years Since Last Delivery'
            placeholder='Enter years (e.g., 2.5)'
            keyboardType='decimal-pad'
            error={
              errors.obstetricHistory?.intervalSinceLastDeliveryYears?.message
            }
          />
        </View>

        {/* Bottom spacing for navigation buttons */}
        <View className='h-20' />
      </View>
    </ScrollView>
  )
}
