import React from 'react'
import { Text, View, ScrollView } from 'react-native'
import { Patient } from '@/types/patients'

interface MedicalHistoryTabProps {
  patient: Patient | null
}

export function MedicalHistoryTab({ patient }: MedicalHistoryTabProps) {
  if (!patient) {
    return (
      <Text className='text-gray-500 text-center'>No patient data found</Text>
    )
  }

  // Destructure patient data for Medical History tab with safe access
  const {
    medicalHistory = {},
    medications = [],
    bloodGroupRhesus = 'Not specified',
    totalPregnancies = 0,
    numberOfLiveBirths = 0,
    numberOfAbortions = 0,
    numberOfCesareanSections = 0,
    lastMenstrualPeriod,
    estimatedDateOfDelivery,
    plannedDeliveryPlace = 'Not specified',
  } = patient

  const {
    asthma = 'no',
    diabetes = 'no',
    hepatitisBStatus = 'Not tested',
    hivStatus = 'Not tested',
    hypertension = 'no',
    otherChronicIllness = 'no',
    otherChronicIllnessDetails = '',
    sickleCellDisease = 'no',
  } = medicalHistory

  return (
    <ScrollView className='flex-1 px-4 pb-4'>
      {/* Medical Conditions Section */}
      <View className='bg-white rounded-lg p-6 mb-4'>
        <Text className='text-lg font-bold text-gray-800 mb-4'>
          Medical Conditions
        </Text>
        <View className='space-y-3'>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>Blood Group:</Text>
            <Text className='text-gray-800'>{bloodGroupRhesus}</Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>HIV Status:</Text>
            <Text className='text-gray-800'>{hivStatus}</Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>Hepatitis B:</Text>
            <Text className='text-gray-800'>{hepatitisBStatus}</Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>Hypertension:</Text>
            <Text className='text-gray-800'>
              {hypertension === 'yes' ? 'Yes' : 'No'}
            </Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>Diabetes:</Text>
            <Text className='text-gray-800'>
              {diabetes === 'yes' ? 'Yes' : 'No'}
            </Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>Asthma:</Text>
            <Text className='text-gray-800'>
              {asthma === 'yes' ? 'Yes' : 'No'}
            </Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>
              Sickle Cell Disease:
            </Text>
            <Text className='text-gray-800'>
              {sickleCellDisease === 'yes' ? 'Yes' : 'No'}
            </Text>
          </View>
          {otherChronicIllness === 'yes' && otherChronicIllnessDetails && (
            <View className='flex-row justify-between items-center py-2'>
              <Text className='text-gray-600 font-medium'>
                Other Conditions:
              </Text>
              <Text className='text-gray-800 flex-1 text-right ml-4'>
                {otherChronicIllnessDetails}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Obstetric History Section */}
      <View className='bg-white rounded-lg p-6 mb-4'>
        <Text className='text-lg font-bold text-gray-800 mb-4'>
          Obstetric History
        </Text>
        <View className='space-y-3'>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>
              Total Pregnancies:
            </Text>
            <Text className='text-gray-800'>{totalPregnancies}</Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>Live Births:</Text>
            <Text className='text-gray-800'>{numberOfLiveBirths}</Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>Abortions:</Text>
            <Text className='text-gray-800'>{numberOfAbortions}</Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>C-Sections:</Text>
            <Text className='text-gray-800'>{numberOfCesareanSections}</Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>LMP:</Text>
            <Text className='text-gray-800'>
              {lastMenstrualPeriod
                ? new Date(lastMenstrualPeriod).toLocaleDateString()
                : 'Not specified'}
            </Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>EDD:</Text>
            <Text className='text-gray-800'>
              {estimatedDateOfDelivery
                ? new Date(estimatedDateOfDelivery).toLocaleDateString()
                : 'Not specified'}
            </Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>Planned Delivery:</Text>
            <Text className='text-gray-800'>{plannedDeliveryPlace}</Text>
          </View>
        </View>
      </View>

      {/* Current Medications */}
      {medications && medications.length > 0 && (
        <View className='bg-white rounded-lg p-6 mb-4'>
          <Text className='text-lg font-bold text-gray-800 mb-4'>
            Current Medications
          </Text>
          {medications.map((medication, index) => (
            <Text key={index} className='text-gray-800 py-1'>
              •{' '}
              {typeof medication === 'string'
                ? medication
                : medication.name || 'Unknown medication'}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  )
}
