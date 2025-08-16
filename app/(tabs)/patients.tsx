import { PatientCard } from '@/components/patients/PatientCard'
import { usePatientStore } from '@/store/patientStore'
import { router } from 'expo-router'
import { Search } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function PatientsScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRisk, setFilterRisk] = useState('ALL')
  const loadPatients = usePatientStore((state) => state.loadPatients)
  const patients = usePatientStore((state) => state.patients)
  const deletePatient = usePatientStore((state) => state.deletePatient)

  useEffect(() => {
    loadPatients()
  }, [])

  const filteredPatients = patients.filter((patient) => {
    const patientName = patient.name || ''
    const patientId = patient.id || ''

    const matchesSearch =
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patientId.includes(searchQuery)
    const matchesFilter =
      filterRisk === 'ALL' || patient.riskLevel?.toUpperCase() === filterRisk
    return matchesSearch && matchesFilter
  })

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'bg-red-500'
      case 'MEDIUM':
        return 'bg-yellow-500'
      case 'LOW':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Patient',
      'Are you sure you want to delete this patient? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => await deletePatient(id),
        },
      ]
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='bg-white px-6 py-6 shadow-sm'>
        <Text className='text-2xl font-bold text-gray-900'>Patients</Text>
        <Text className='text-base text-gray-600 mt-1'>
          {filteredPatients.length} patients registered
        </Text>
      </View>

      {/* Search and Filter */}
      <View className='bg-white px-6 py-4 border-b border-gray-100'>
        {/* Search Bar */}
        <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-3 mb-4'>
          <Search size={18} color='#6B7280' />
          <TextInput
            className='flex-1 ml-3 text-gray-800 text-base'
            placeholder='Search patients by name or ID...'
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor='#9CA3AF'
          />
        </View>

        {/* Risk Level Filters */}
        <View className='mb-2'>
          <Text className='text-sm font-medium text-gray-700 mb-3'>
            Filter by Risk Level
          </Text>
          <View className='flex-row flex-wrap gap-3'>
            {[
              { key: 'ALL', label: 'All Patients', color: '#6B7280' },
              { key: 'HIGH', label: 'High Risk', color: '#EF4444' },
              { key: 'MEDIUM', label: 'Medium Risk', color: '#F59E0B' },
              { key: 'LOW', label: 'Low Risk', color: '#10B981' },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setFilterRisk(filter.key)}
                className={`px-4 py-2 rounded-full border-2 ${
                  filterRisk === filter.key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
                style={{
                  borderColor:
                    filterRisk === filter.key ? '#3B82F6' : '#E5E7EB',
                }}
              >
                <View className='flex-row items-center'>
                  <View
                    className='w-3 h-3 rounded-full mr-2'
                    style={{ backgroundColor: filter.color }}
                  />
                  <Text
                    className={`font-medium text-xs ${
                      filterRisk === filter.key
                        ? 'text-blue-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {filter.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results Count */}
        <View className='mt-3 pt-3 border-t border-gray-100'>
          <Text className='text-sm text-gray-500'>
            Showing {filteredPatients.length} of {patients.length} patients
            {filterRisk !== 'ALL' && ` • ${filterRisk.toLowerCase()} risk`}
          </Text>
        </View>
      </View>

      {/* Patient List */}
      <ScrollView
        className='flex-1 px-4 pb-4'
        showsVerticalScrollIndicator={false}
      >
        {filteredPatients.map((patient, index) => (
          <PatientCard
            key={patient.id || `patient-${index}`}
            patient={patient}
            onPress={() => router.push(`/patient/${patient.id}`)}
            onDelete={handleDelete}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}
