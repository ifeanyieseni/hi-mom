import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { usePatientStore, Patient } from '@/store/patientStore'
import {
  useAntenatalVisitStore,
  AntenatalVisitData,
} from '@/store/antenatalVisitStore'

export default function FollowUpVisit() {
  const { id } = useLocalSearchParams() // Patient ID
  const router = useRouter()
  const { patients } = usePatientStore()
  const { addVisit } = useAntenatalVisitStore()

  const [patient, setPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState({
    currentGestationWeeks: '',
    bloodPressure: '',
    weight: '',
    fundalHeight: '',
    fetalHeartRate: '',
    fetalMovement: '',
    urineTest: '',
    notes: '',
    // Additional follow-up specific fields
    complaints: '',
    physicalExamination: '',
    recommendations: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id && patients.length > 0) {
      const foundPatient = patients.find((p) => p.id === id)
      setPatient(foundPatient || null)
    }
  }, [id, patients])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    if (!patient) {
      Alert.alert('Error', 'Patient not found')
      return
    }

    // Basic validation
    if (
      !formData.currentGestationWeeks ||
      !formData.bloodPressure ||
      !formData.weight
    ) {
      Alert.alert('Error', 'Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Create follow-up visit data
      const followUpVisitData: Omit<
        AntenatalVisitData,
        'id' | 'createdAt' | 'updatedAt'
      > = {
        patientId: patient.id,
        visitDate: new Date().toISOString(),
        visitType: 'follow-up',

        // Copy patient basic info
        womanFullName: patient.name,
        age: patient.age.toString(),
        villageAddress: patient.address,
        womanPhoneNumber: patient.phoneNumber,
        husbandName: '',
        husbandPhoneNumber: '',
        womanOccupation: '',
        husbandOccupation: '',
        womanEducationLevel: '',
        husbandEducationLevel: '',
        maritalStatus: '',
        emergencyContactName: '',
        emergencyContactRelationship: '',

        // Obstetric History - can be empty for follow-up
        totalPregnancies: '',
        numberOfLiveBirths: '',
        previousDeliveries: '',
        previousAbortions: '',
        numberOfAbortions: '',
        previousStillbirths: '',
        previousCesareanSections: '',
        numberOfCesareanSections: '',
        previousVacuumForcepsDelivery: '',
        previousAPHPPH: '',
        previousEclampsiaPreeclampsia: '',
        previousSymphysiotomyFistulaRepair: '',
        lastMenstrualPeriod: '',
        estimatedDateOfDelivery: '',
        birthWeightOfLastChild: '',
        intervalSinceLastDelivery: '',

        // Medical History - can be empty for follow-up
        hypertension: '',
        diabetes: '',
        asthma: '',
        epilepsy: '',
        kidneyRenalDisease: '',
        sickleCellDisease: '',
        sickleCellTrait: '',
        tuberculosis: '',
        heartDisease: '',
        thyroidProblems: '',
        chronicAnaemia: '',
        bloodTransfusions: '',
        hivStatus: '',
        hepatitisBStatus: '',
        recentMalaria: '',
        otherChronicIllness: '',
        otherChronicIllnessDetails: '',

        // Laboratory Investigations - can be updated in follow-up
        bloodGroupRhesus: '',
        haemoglobinLevel: '',
        hivTestResult: '',
        hivTestDate: '',
        syphilisTestResult: '',
        syphilisTestDate: '',
        hepatitisBTestResult: '',
        hepatitisBTestDate: '',
        malariaTestResult: '',
        malariaTestDate: '',

        // Delivery Plan
        plannedDeliveryPlace: '',
        healthFacilityName: '',
        otherDeliveryPlace: '',
        transportPlanForEmergencies: '',

        // Risk Assessment
        identifiedRisks: '',
        specifiedRisks: '',
        referralToHigherLevel: '',
        referralReason: '',

        // Current visit data - main focus for follow-up
        currentGestationWeeks: formData.currentGestationWeeks,
        bloodPressure: formData.bloodPressure,
        weight: formData.weight,
        fundalHeight: formData.fundalHeight,
        fetalHeartRate: formData.fetalHeartRate,
        fetalMovement: formData.fetalMovement,
        urineTest: formData.urineTest,
        notes: formData.notes,
      }

      // Add the visit to the store
      addVisit(followUpVisitData)

      Alert.alert('Success', 'Follow-up visit recorded successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to patient profile
            router.push(`/patient/${patient.id}`)
          },
        },
      ])
    } catch (error) {
      console.error('Error saving follow-up visit:', error)
      Alert.alert('Error', 'Failed to save follow-up visit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!patient) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='flex-1 items-center justify-center'>
          <Text className='text-gray-500'>Patient not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      {/* Header */}
      <View className='bg-white px-4 py-4 border-b border-gray-200'>
        <View className='flex-row items-center'>
          <TouchableOpacity onPress={() => router.back()} className='mr-3'>
            <Ionicons name='arrow-back' size={24} color='#333' />
          </TouchableOpacity>
          <View className='flex-1'>
            <Text className='text-xl font-bold text-gray-800'>
              Follow-up Visit
            </Text>
            <Text className='text-gray-600'>{patient.name}</Text>
          </View>
        </View>
      </View>

      <ScrollView className='flex-1 px-4 py-6'>
        <View className='space-y-6'>
          {/* Current Pregnancy Status */}
          <View className='bg-white rounded-lg p-4'>
            <Text className='text-lg font-semibold text-gray-800 mb-4'>
              Current Pregnancy Status
            </Text>

            <View className='space-y-4'>
              <View>
                <Text className='text-gray-700 font-medium mb-2'>
                  Gestation Weeks *
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-2 text-gray-800'
                  value={formData.currentGestationWeeks}
                  onChangeText={(value) =>
                    handleInputChange('currentGestationWeeks', value)
                  }
                  placeholder='e.g., 32'
                  keyboardType='numeric'
                />
              </View>

              <View>
                <Text className='text-gray-700 font-medium mb-2'>
                  Blood Pressure *
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-2 text-gray-800'
                  value={formData.bloodPressure}
                  onChangeText={(value) =>
                    handleInputChange('bloodPressure', value)
                  }
                  placeholder='e.g., 120/80'
                />
              </View>

              <View>
                <Text className='text-gray-700 font-medium mb-2'>Weight *</Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-2 text-gray-800'
                  value={formData.weight}
                  onChangeText={(value) => handleInputChange('weight', value)}
                  placeholder='e.g., 65kg'
                />
              </View>

              <View>
                <Text className='text-gray-700 font-medium mb-2'>
                  Fundal Height
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-2 text-gray-800'
                  value={formData.fundalHeight}
                  onChangeText={(value) =>
                    handleInputChange('fundalHeight', value)
                  }
                  placeholder='e.g., 30cm'
                />
              </View>

              <View>
                <Text className='text-gray-700 font-medium mb-2'>
                  Fetal Heart Rate
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-2 text-gray-800'
                  value={formData.fetalHeartRate}
                  onChangeText={(value) =>
                    handleInputChange('fetalHeartRate', value)
                  }
                  placeholder='e.g., 140 bpm'
                  keyboardType='numeric'
                />
              </View>

              <View>
                <Text className='text-gray-700 font-medium mb-2'>
                  Fetal Movement
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-2 text-gray-800'
                  value={formData.fetalMovement}
                  onChangeText={(value) =>
                    handleInputChange('fetalMovement', value)
                  }
                  placeholder='e.g., Good, Active'
                />
              </View>

              <View>
                <Text className='text-gray-700 font-medium mb-2'>
                  Urine Test
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-2 text-gray-800'
                  value={formData.urineTest}
                  onChangeText={(value) =>
                    handleInputChange('urineTest', value)
                  }
                  placeholder='e.g., Normal, Protein +1'
                />
              </View>
            </View>
          </View>

          {/* Additional Follow-up Information */}
          <View className='bg-white rounded-lg p-4'>
            <Text className='text-lg font-semibold text-gray-800 mb-4'>
              Additional Information
            </Text>

            <View className='space-y-4'>
              <View>
                <Text className='text-gray-700 font-medium mb-2'>
                  Complaints
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-2 text-gray-800 h-20'
                  value={formData.complaints}
                  onChangeText={(value) =>
                    handleInputChange('complaints', value)
                  }
                  placeholder='Any complaints or concerns...'
                  multiline
                  textAlignVertical='top'
                />
              </View>

              <View>
                <Text className='text-gray-700 font-medium mb-2'>
                  Physical Examination
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-2 text-gray-800 h-20'
                  value={formData.physicalExamination}
                  onChangeText={(value) =>
                    handleInputChange('physicalExamination', value)
                  }
                  placeholder='Physical examination findings...'
                  multiline
                  textAlignVertical='top'
                />
              </View>

              <View>
                <Text className='text-gray-700 font-medium mb-2'>
                  Recommendations
                </Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-2 text-gray-800 h-20'
                  value={formData.recommendations}
                  onChangeText={(value) =>
                    handleInputChange('recommendations', value)
                  }
                  placeholder='Recommendations and next steps...'
                  multiline
                  textAlignVertical='top'
                />
              </View>

              <View>
                <Text className='text-gray-700 font-medium mb-2'>Notes</Text>
                <TextInput
                  className='border border-gray-300 rounded-lg px-3 py-2 text-gray-800 h-20'
                  value={formData.notes}
                  onChangeText={(value) => handleInputChange('notes', value)}
                  placeholder='Additional notes...'
                  multiline
                  textAlignVertical='top'
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className='bg-white px-4 py-4 border-t border-gray-200'>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          className={`py-4 rounded-lg ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600'}`}
        >
          <Text className='text-white text-center font-semibold text-lg'>
            {isSubmitting ? 'Saving...' : 'Save Follow-up Visit'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
