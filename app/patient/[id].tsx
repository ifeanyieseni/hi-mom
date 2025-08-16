import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabSwitcher } from '@/components/Tabs'
import { usePatientStore } from '@/store/patientStore'
import {
  useAntenatalVisitStore,
  AntenatalVisitData,
} from '@/store/antenatalVisitStore'
import { Patient, PatientForm } from '@/types/patients'
import { loadFormData } from '@/lib/formStorage'
import { PersonalInfoTab } from '@/components/patient/PersonalInfoTab'
import { MedicalHistoryTab } from '@/components/patient/MedicalHistoryTab'
import { LaboratoryRecordsTab } from '@/components/patient/LaboratoryRecordsTab'
import { VisitRecordsTab } from '@/components/patient/VisitRecordsTab'

type TabType =
  | 'Personal Info'
  | 'Medical History'
  | 'Laboratory Records'
  | 'Visit Records'

export default function PatientProfileScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('Personal Info')
  const [patient, setPatient] = useState<Patient | null>(null)
  const [patientForm, setPatientForm] = useState<any>(null)
  const [visits, setVisits] = useState<AntenatalVisitData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { patients, loadPatients } = usePatientStore()
  const {
    visits: allVisits,
    getVisitsByPatient,
    loadVisits,
  } = useAntenatalVisitStore()

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        setIsLoading(true)

        // Load store data first
        await Promise.all([loadPatients(), loadVisits()])

        // Load patient form data if available
        if (id) {
          try {
            const formData = await loadFormData()
            if (formData && isMounted) {
              setPatientForm(formData)
            }
          } catch (error) {
            console.error('Error loading patient form data:', error)
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false
    }
  }, [id, loadPatients, loadVisits])

  useEffect(() => {
    if (id && patients.length > 0 && !isLoading) {
      const foundPatient = patients.find((p) => p.id === id)
      setPatient(foundPatient || null)
    }
  }, [id, patients, isLoading])

  useEffect(() => {
    if (id && allVisits.length > 0 && !isLoading) {
      const patientVisits = getVisitsByPatient(id as string)
      setVisits(patientVisits)
    }
  }, [id, allVisits, isLoading])

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='flex-1 justify-center items-center'>
          <Text className='text-gray-500'>Loading patient data...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const tabs: TabType[] = [
    'Personal Info',
    'Medical History',
    'Laboratory Records',
    'Visit Records',
  ]

  if (!patient) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='flex-1 items-center justify-center'>
          <Ionicons name='person-outline' size={64} color='#ccc' />
          <Text className='text-gray-500 text-center mt-4'>
            Patient not found
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='bg-white px-4 py-4 border-b border-gray-200'>
        <View className='flex-row items-center'>
          <TouchableOpacity onPress={() => router.back()} className='mr-3'>
            <Ionicons name='arrow-back' size={24} color='#333' />
          </TouchableOpacity>
          <Text className='text-xl font-bold text-gray-800'>
            Patient Profile
          </Text>
        </View>
      </View>

      <TabSwitcher
        tabs={tabs}
        onChange={(tab) => setActiveTab(tab as TabType)}
        initialTab='Personal Info'
        className='bg-white'
      />

      <View className='flex-1 pt-6'>
        {activeTab === 'Personal Info' && <PersonalInfoTab patient={patient} />}
        {activeTab === 'Medical History' && (
          <MedicalHistoryTab patient={patient} />
        )}
        {activeTab === 'Laboratory Records' && (
          <LaboratoryRecordsTab patient={patient} visits={visits} />
        )}
        {activeTab === 'Visit Records' && (
          <VisitRecordsTab visits={visits} patientId={id as string} />
        )}
      </View>

      {/* Action Buttons */}
      <View className='bg-white px-4 py-4 border-t border-gray-200'>
        <View className='flex-row space-x-3'>
          <TouchableOpacity
            onPress={() => router.push(`/visit/${patient.id}/follow-up`)}
            className='flex-1 bg-blue-600 py-3 rounded-lg flex-row items-center justify-center'
          >
            <Ionicons name='add-circle-outline' size={20} color='white' />
            <Text className='text-white font-semibold ml-2'>
              Schedule Follow-up Visit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
