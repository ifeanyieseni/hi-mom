import React from 'react'
import { Text, View, ScrollView, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Patient } from '@/types/patients'

interface PersonalInfoTabProps {
  patient: Patient | null
}

export function PersonalInfoTab({ patient }: PersonalInfoTabProps) {
  if (!patient) {
    return (
      <Text className='text-gray-500 text-center'>No patient data found</Text>
    )
  }

  // Destructure patient data for Personal Info tab
  const {
    name,
    age,
    phoneNumber,
    address,
    gestationWeeks,
    dueDate,
    riskLevel,
    lastVisit,
    nextAppointment,
    notes,
    imageUrl,
  } = patient

  return (
    <ScrollView className='flex-1 px-4 pb-4'>
      <View className='bg-white rounded-lg p-6 mb-4 '>
        <View className='flex-row items-center mb-6 justify-center flex-1  '>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className='w-20 h-20 rounded-full mr-4'
            />
          ) : (
            <View className='w-20 h-20 rounded-full bg-gray-200 items-center justify-center mr-4'>
              <Ionicons name='person' size={28} color='#666' />
            </View>
          )}
          <View className='flex-1 text-center'>
            <Text className='text-2xl font-bold text-gray-800 mb-1'>
              {name}
            </Text>
            <Text className='text-gray-600 mb-1'>Age: {age} years</Text>
            <Text className='text-gray-600'>Phone: {phoneNumber}</Text>
          </View>
        </View>

        <View className='space-y-4'>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>Address:</Text>
            <Text className='text-gray-800 flex-1 text-right ml-4'>
              {address}
            </Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>Gestation:</Text>
            <Text className='text-gray-800'>{gestationWeeks} weeks</Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>Due Date:</Text>
            <Text className='text-gray-800'>{dueDate}</Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>Risk Level:</Text>
            <View
              className={`px-3 py-1 rounded-full ${
                riskLevel === 'high'
                  ? 'bg-red-100'
                  : riskLevel === 'medium'
                    ? 'bg-yellow-100'
                    : riskLevel === 'low'
                      ? 'bg-green-100'
                      : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  riskLevel === 'high'
                    ? 'text-red-700'
                    : riskLevel === 'medium'
                      ? 'text-yellow-700'
                      : riskLevel === 'low'
                        ? 'text-green-700'
                        : 'text-gray-700'
                }`}
              >
                {riskLevel.toUpperCase()}
              </Text>
            </View>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>Last Visit:</Text>
            <Text className='text-gray-800'>{lastVisit}</Text>
          </View>
          <View className='flex-row justify-between items-center py-2'>
            <Text className='text-gray-600 font-medium'>Next Appointment:</Text>
            <Text className='text-gray-800'>{nextAppointment}</Text>
          </View>
        </View>

        {notes && (
          <View className='mt-4 p-3 bg-blue-50 rounded-lg'>
            <Text className='text-blue-800 font-medium'>Notes:</Text>
            <Text className='text-blue-700 mt-1'>{notes}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
