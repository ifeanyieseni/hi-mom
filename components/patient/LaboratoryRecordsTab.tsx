import React from 'react'
import { Text, View, ScrollView } from 'react-native'
import { Patient } from '@/types/patients'
import { AntenatalVisitData } from '@/store/antenatalVisitStore'

interface LaboratoryRecordsTabProps {
  patient: Patient | null
  visits: AntenatalVisitData[]
}

export function LaboratoryRecordsTab({
  patient,
  visits,
}: LaboratoryRecordsTabProps) {
  if (!patient) {
    return (
      <Text className='text-gray-500 text-center'>No patient data found</Text>
    )
  }

  // Destructure patient data for Laboratory Records tab with safe access
  const { bloodGroupRhesus = 'Not specified', medicalHistory = {} } = patient

  const { hivStatus = 'Not tested', hepatitisBStatus = 'Not tested' } =
    medicalHistory

  // For now, we'll show basic lab info from patient data
  // Visit-specific lab results would need to be added to AntenatalVisitData interface
  const hasBasicLabInfo =
    bloodGroupRhesus !== 'Not specified' ||
    hivStatus !== 'Not tested' ||
    hepatitisBStatus !== 'Not tested'

  return (
    <ScrollView className='flex-1 px-4 pb-4'>
      {/* Basic Lab Information */}
      <View className='bg-white rounded-lg p-6 mb-4'>
        <Text className='text-lg font-bold text-gray-800 mb-4'>
          Basic Laboratory Information
        </Text>
        <View className='space-y-3'>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>
              Blood Group & Rhesus:
            </Text>
            <Text className='text-gray-800 font-semibold'>
              {bloodGroupRhesus}
            </Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>HIV Status:</Text>
            <View
              className={`px-3 py-1 rounded-full ${
                hivStatus === 'Positive'
                  ? 'bg-red-100'
                  : hivStatus === 'Negative'
                    ? 'bg-green-100'
                    : 'bg-yellow-100'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  hivStatus === 'Positive'
                    ? 'text-red-700'
                    : hivStatus === 'Negative'
                      ? 'text-green-700'
                      : 'text-yellow-700'
                }`}
              >
                {hivStatus.toUpperCase()}
              </Text>
            </View>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>
              Hepatitis B Status:
            </Text>
            <View
              className={`px-3 py-1 rounded-full ${
                hepatitisBStatus === 'Positive'
                  ? 'bg-red-100'
                  : hepatitisBStatus === 'Negative'
                    ? 'bg-green-100'
                    : 'bg-yellow-100'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  hepatitisBStatus === 'Positive'
                    ? 'text-red-700'
                    : hepatitisBStatus === 'Negative'
                      ? 'text-green-700'
                      : 'text-yellow-700'
                }`}
              >
                {hepatitisBStatus.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Additional Lab Results Section */}
      {visits.length > 0 ? (
        <View className='bg-white rounded-lg p-6 mb-4'>
          <Text className='text-lg font-bold text-gray-800 mb-4'>
            Visit Laboratory Records
          </Text>
          <Text className='text-gray-500 text-center'>
            Lab results from {visits.length} visit
            {visits.length > 1 ? 's' : ''}
          </Text>
          <Text className='text-gray-400 text-center text-sm mt-2'>
            Detailed lab investigations will be displayed here when available
          </Text>
        </View>
      ) : (
        <View className='bg-white rounded-lg p-6 mb-4'>
          <Text className='text-gray-500 text-center'>
            No visit records found
          </Text>
          <Text className='text-gray-400 text-center text-sm mt-2'>
            Lab results will appear here after antenatal visits are completed
          </Text>
        </View>
      )}
    </ScrollView>
  )
}
