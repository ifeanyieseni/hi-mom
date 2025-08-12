/* eslint-disable react-hooks/exhaustive-deps */
import ReusableTextInput from '@/components/ui/ReusableTextInput'
import { usePatientStore } from '@/store/patientStore'
import { Patient } from '@/types/patients'
import { Stack, useRouter, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'

const PatientSearchScreen = () => {
  const router = useRouter()
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>()
  const loadPatients = usePatientStore((state) => state.loadPatients)
  const patients = usePatientStore((state) => state.patients)
  const [searchQuery, setSearchQuery] = useState('')

  console.log('patients',patients)
  useEffect(() => {
    loadPatients()
  }, [])

  const filteredPatients = patients.filter((patient) => {
    const [firstName, ...rest] = patient.name.split(' ')
    const lastName = rest.join(' ')
    return (
      firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.address &&
        patient.address.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  const handleSelectPatient = (patientId: string) => {
    // Check if this is for a follow-up visit from the new unified flow
    if (returnTo === 'followUpVisit') {
      // Navigate to the unified form system for follow-up visits
      router.push(`/visit/form?type=follow-up&patientId=${patientId}`)
    } else {
      // Default behavior - go to the old follow-up form (for backward compatibility)
      router.push(`/visit/${patientId}/follow-up`)
    }
  }

  const renderItem = ({ item }: { item: Patient }) => {
    let riskColor = 'text-gray-500'
    if (item.riskLevel === 'high') riskColor = 'text-risk-high'
    else if (item.riskLevel === 'medium') riskColor = 'text-risk-medium'
    else if (item.riskLevel === 'low') riskColor = 'text-risk-low'

    return (
      <TouchableOpacity
        className='bg-white shadow rounded-xl mb-4 flex-row items-center justify-between px-5 py-4 border border-primary-100'
        onPress={() => handleSelectPatient(item.id)}
      >
        <View>
          <Text className='font-semibold text-gray-900 text-base'>
            {item.name}
          </Text>
          <Text className='text-sm text-gray-600 mt-1'>
            Village: {item.address?.split(',')[0]}
          </Text>
          <Text className='text-xs text-gray-500 mt-1'>
            Age: {item.age || 'N/A'}
          </Text>
          <Text className='text-xs text-gray-500 mt-1'>
            Phone: {item.phoneNumber || 'N/A'}
          </Text>
          <Text className={`text-xs mt-1 font-semibold ${riskColor}`}>
            Risk Level:{' '}
            {item.riskLevel
              ? item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1)
              : 'N/A'}
          </Text>
        </View>
        <View className='items-end'>
          <Text className='text-xs text-gray-400'>
            Last Visit: {item.lastVisit || 'N/A'}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title:
            returnTo === 'followUpVisit'
              ? 'Select Patient for Follow-up'
              : 'Select Patient',
        }}
      />
      <View className='flex-1 p-4 bg-gray-50'>
        <View className='bg-white rounded-2xl p-2 mb-4 flex-row items-center shadow-sm border border-gray-100'>
          <ReusableTextInput
            style={{ flex: 1, marginLeft: 8, backgroundColor: 'white' }}
            placeholder='Search by first name, last name, or village...'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <FlatList
          data={filteredPatients}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          className='w-full'
          ListEmptyComponent={
            <Text className='text-center text-gray-500 mt-10'>
              No patients found.
            </Text>
          }
        />
      </View>
    </>
  )
}

export default PatientSearchScreen
