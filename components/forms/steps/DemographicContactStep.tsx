import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useFormContext } from 'react-hook-form'
import { PatientForm } from '@/types/patients'
import { FormField } from '../components/FormField'
import { FormSelect } from '../components/FormSelect'
import { nigerianStates } from '@/data/nigerianStates'

const BLOOD_TYPE_OPTIONS = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
]

const EDUCATION_LEVELS = [
  { label: 'No formal education', value: 'No formal education' },
  { label: 'Primary school', value: 'Primary school' },
  { label: 'Secondary school', value: 'Secondary school' },
  { label: 'Tertiary education', value: 'Tertiary education' },
  { label: 'Postgraduate', value: 'Postgraduate' },
]

const MARITAL_STATUS_OPTIONS = [
  { label: 'Single', value: 'Single' },
  { label: 'Married', value: 'Married' },
  { label: 'Divorced', value: 'Divorced' },
  { label: 'Widowed', value: 'Widowed' },
]

export function DemographicContactStep() {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<PatientForm>()

  // Watch for state changes to update LGA options
  const selectedState = watch('demographicAndContactInformation.state')

  // Get LGA options based on selected state
  const getLGAOptions = () => {
    if (!selectedState) return []
    const state = nigerianStates.find((s) => s.name === selectedState)
    return state ? state.lgas.map((lga) => ({ label: lga, value: lga })) : []
  }

  // Handle state change to reset LGA
  const handleStateChange = (stateName: string) => {
    setValue('demographicAndContactInformation.state', stateName)
    setValue('demographicAndContactInformation.lga', '') // Reset LGA when state changes
  }

  return (
    <ScrollView
      className='flex-1 px-6 py-4'
      showsVerticalScrollIndicator={false}
    >
      <View className='space-y-6'>
        {/* Personal Information */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Personal Information
          </Text>

          <FormField
            name='demographicAndContactInformation.womanFullName'
            control={control}
            label='Full Name *'
            placeholder='Enter full name'
            error={
              errors.demographicAndContactInformation?.womanFullName?.message
            }
          />

          <FormField
            name='demographicAndContactInformation.age'
            control={control}
            label='Age *'
            placeholder='Enter age'
            keyboardType='numeric'
            error={errors.demographicAndContactInformation?.age?.message}
          />

          <FormSelect
            name='demographicAndContactInformation.bloodType'
            control={control}
            label='Blood Type *'
            placeholder='Select blood type'
            options={BLOOD_TYPE_OPTIONS}
            error={errors.demographicAndContactInformation?.bloodType?.message}
          />

          <FormSelect
            name='demographicAndContactInformation.maritalStatus'
            control={control}
            label='Marital Status *'
            placeholder='Select marital status'
            options={MARITAL_STATUS_OPTIONS}
            error={
              errors.demographicAndContactInformation?.maritalStatus?.message
            }
          />
        </View>

        {/* Address Information */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Address Information
          </Text>

          <FormSelect
            name='demographicAndContactInformation.state'
            control={control}
            label='State *'
            placeholder='Select state'
            options={nigerianStates.map((state) => ({
              label: state.name,
              value: state.name,
            }))}
            error={errors.demographicAndContactInformation?.state?.message}
            onValueChange={handleStateChange}
          />

          <FormSelect
            name='demographicAndContactInformation.lga'
            control={control}
            label='Local Government Area (LGA) *'
            placeholder={selectedState ? 'Select LGA' : 'Select state first'}
            options={getLGAOptions()}
            error={errors.demographicAndContactInformation?.lga?.message}
            disabled={!selectedState}
          />

          <FormField
            name='demographicAndContactInformation.villageAddress'
            control={control}
            label='Village/Address *'
            placeholder='Enter village or address'
            error={
              errors.demographicAndContactInformation?.villageAddress?.message
            }
          />
        </View>

        {/* Contact Information */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Contact Information
          </Text>

          <FormField
            name='demographicAndContactInformation.womanPhoneNumber'
            control={control}
            label='Phone Number *'
            placeholder='Enter phone number'
            keyboardType='phone-pad'
            error={
              errors.demographicAndContactInformation?.womanPhoneNumber?.message
            }
          />
        </View>

        {/* Occupation & Education */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Occupation & Education
          </Text>

          <FormField
            name='demographicAndContactInformation.womanOccupation'
            control={control}
            label='Your Occupation'
            placeholder='Enter occupation'
            error={
              errors.demographicAndContactInformation?.womanOccupation?.message
            }
          />

          <FormSelect
            name='demographicAndContactInformation.womanEducationLevel'
            control={control}
            label='Your Education Level *'
            placeholder='Select education level'
            options={EDUCATION_LEVELS}
            error={
              errors.demographicAndContactInformation?.womanEducationLevel
                ?.message
            }
          />
        </View>

        {/* Husband Information */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Husband/Partner Information
          </Text>

          <FormField
            name='demographicAndContactInformation.husbandName'
            control={control}
            label='Husband/Partner Name'
            placeholder='Enter husband/partner name'
            error={
              errors.demographicAndContactInformation?.husbandName?.message
            }
          />

          <FormField
            name='demographicAndContactInformation.husbandPhoneNumber'
            control={control}
            label='Husband/Partner Phone'
            placeholder='Enter phone number'
            keyboardType='phone-pad'
            error={
              errors.demographicAndContactInformation?.husbandPhoneNumber
                ?.message
            }
          />

          <FormField
            name='demographicAndContactInformation.husbandOccupation'
            control={control}
            label='Husband/Partner Occupation'
            placeholder='Enter occupation'
            error={
              errors.demographicAndContactInformation?.husbandOccupation
                ?.message
            }
          />

          <FormSelect
            name='demographicAndContactInformation.husbandEducationLevel'
            control={control}
            label='Husband/Partner Education Level'
            placeholder='Select education level'
            options={EDUCATION_LEVELS}
            error={
              errors.demographicAndContactInformation?.husbandEducationLevel
                ?.message
            }
          />
        </View>

        {/* Emergency Contact */}
        <View>
          <Text className='text-lg font-semibold text-slate-800 mb-4'>
            Emergency Contact
          </Text>

          <FormField
            name='demographicAndContactInformation.emergencyContactName'
            control={control}
            label='Emergency Contact Name *'
            placeholder='Enter emergency contact name'
            error={
              errors.demographicAndContactInformation?.emergencyContactName
                ?.message
            }
          />

          <FormField
            name='demographicAndContactInformation.emergencyContactRelationship'
            control={control}
            label='Relationship *'
            placeholder='e.g., Mother, Sister, Friend'
            error={
              errors.demographicAndContactInformation
                ?.emergencyContactRelationship?.message
            }
          />
        </View>

        {/* Bottom spacing for navigation buttons */}
        <View className='h-20' />
      </View>
    </ScrollView>
  )
}
