import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { usePatientStore, Patient } from '@/store/patientStore'
import {
  useAntenatalVisitStore,
  AntenatalVisitData,
} from '@/store/antenatalVisitStore'
import { SimpleFormField } from '../components/SimpleFormField'

interface FollowUpVisitFormProps {
  patientId: string
}

interface FollowUpFormData {
  currentGestationWeeks: string
  bloodPressure: string
  weight: string
  fundalHeight: string
  fetalHeartRate: string
  fetalMovement: string
  urineTest: string
  complaints: string
  physicalExamination: string
  recommendations: string
  notes: string
  // Additional follow-up specific fields
  haemoglobinLevel: string
  malariaTestResult: string
  identifiedRisks: string
  referralToHigherLevel: string
  referralReason: string
}

export default function FollowUpVisitForm({
  patientId,
}: FollowUpVisitFormProps) {
  const router = useRouter()
  const { patients } = usePatientStore()
  const { addVisit } = useAntenatalVisitStore()

  const [patient, setPatient] = useState<Patient | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FollowUpFormData>({
    currentGestationWeeks: '',
    bloodPressure: '',
    weight: '',
    fundalHeight: '',
    fetalHeartRate: '',
    fetalMovement: '',
    urineTest: '',
    complaints: '',
    physicalExamination: '',
    recommendations: '',
    notes: '',
    haemoglobinLevel: '',
    malariaTestResult: '',
    identifiedRisks: '',
    referralToHigherLevel: 'no',
    referralReason: '',
  })

  useEffect(() => {
    if (patientId && patients.length > 0) {
      const foundPatient = patients.find((p) => p.id === patientId)
      setPatient(foundPatient || null)
    }
  }, [patientId, patients])

  const handleInputChange = (
    field: keyof FollowUpFormData,
    value: string
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    const requiredFields = [
      'currentGestationWeeks',
      'bloodPressure',
      'weight',
      'fundalHeight',
      'fetalHeartRate',
    ]

    for (const field of requiredFields) {
      if (!formData[field as keyof FollowUpFormData]) {
        Alert.alert(
          'Validation Error',
          `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`
        )
        return false
      }
    }

    return true
  }

  const handleSubmit = async (): Promise<void> => {
    if (!patient) {
      Alert.alert('Error', 'Patient not found')
      return
    }

    if (!validateForm()) {
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
        husbandName: patient.husbandName || '',
        husbandPhoneNumber: patient.husbandPhoneNumber || '',
        womanOccupation: patient.occupation || '',
        husbandOccupation: '',
        womanEducationLevel: patient.educationLevel || '',
        husbandEducationLevel: '',
        maritalStatus: patient.maritalStatus || '',
        emergencyContactName: patient.emergencyContactName || '',
        emergencyContactRelationship:
          patient.emergencyContactRelationship || '',

        // Obstetric History - use existing patient data or empty
        totalPregnancies: patient.totalPregnancies?.toString() || '',
        numberOfLiveBirths: patient.numberOfLiveBirths?.toString() || '',
        previousDeliveries: patient.previousDeliveries || '',
        previousAbortions: patient.previousAbortions || '',
        numberOfAbortions: patient.numberOfAbortions?.toString() || '',
        previousStillbirths: patient.previousStillbirths || '',
        previousCesareanSections: patient.previousCesareanSections || '',
        numberOfCesareanSections:
          patient.numberOfCesareanSections?.toString() || '',
        previousVacuumForcepsDelivery: '',
        previousAPHPPH: '',
        previousEclampsiaPreeclampsia: '',
        previousSymphysiotomyFistulaRepair: '',
        lastMenstrualPeriod: patient.lastMenstrualPeriod || '',
        estimatedDateOfDelivery: patient.estimatedDateOfDelivery || '',
        birthWeightOfLastChild: '',
        intervalSinceLastDelivery: '',

        // Medical History - use existing patient data
        hypertension: patient.medicalHistory?.hypertension || '',
        diabetes: patient.medicalHistory?.diabetes || '',
        asthma: patient.medicalHistory?.asthma || '',
        epilepsy: patient.medicalHistory?.epilepsy || '',
        kidneyRenalDisease: patient.medicalHistory?.kidneyRenalDisease || '',
        sickleCellDisease: patient.medicalHistory?.sickleCellDisease || '',
        sickleCellTrait: patient.medicalHistory?.sickleCellTrait || '',
        tuberculosis: patient.medicalHistory?.tuberculosis || '',
        heartDisease: patient.medicalHistory?.heartDisease || '',
        thyroidProblems: patient.medicalHistory?.thyroidProblems || '',
        chronicAnaemia: patient.medicalHistory?.chronicAnaemia || '',
        bloodTransfusions: patient.medicalHistory?.bloodTransfusions || '',
        hivStatus: patient.medicalHistory?.hivStatus || '',
        hepatitisBStatus: patient.medicalHistory?.hepatitisBStatus || '',
        recentMalaria: patient.medicalHistory?.recentMalaria || '',
        otherChronicIllness: patient.medicalHistory?.otherChronicIllness || '',
        otherChronicIllnessDetails:
          patient.medicalHistory?.otherChronicIllnessDetails || '',

        // Laboratory Investigations - updated in follow-up
        bloodGroupRhesus: patient.bloodGroupRhesus || '',
        haemoglobinLevel: formData.haemoglobinLevel,
        hivTestResult: '',
        hivTestDate: '',
        syphilisTestResult: '',
        syphilisTestDate: '',
        hepatitisBTestResult: '',
        hepatitisBTestDate: '',
        malariaTestResult: formData.malariaTestResult,
        malariaTestDate: formData.malariaTestResult
          ? new Date().toISOString().split('T')[0]
          : '',

        // Delivery Plan - use existing patient data
        plannedDeliveryPlace: patient.plannedDeliveryPlace || '',
        healthFacilityName: patient.healthFacilityName || '',
        otherDeliveryPlace: '',
        transportPlanForEmergencies: '',

        // Risk Assessment - updated in follow-up
        identifiedRisks: formData.identifiedRisks,
        specifiedRisks: '',
        referralToHigherLevel: formData.referralToHigherLevel,
        referralReason: formData.referralReason,

        // Current Pregnancy Details - main focus of follow-up
        currentGestationWeeks: formData.currentGestationWeeks,
        bloodPressure: formData.bloodPressure,
        weight: formData.weight,
        fundalHeight: formData.fundalHeight,
        fetalHeartRate: formData.fetalHeartRate,
        fetalMovement: formData.fetalMovement,
        urineTest: formData.urineTest,
        notes: `Complaints: ${formData.complaints}\n\nPhysical Examination: ${formData.physicalExamination}\n\nRecommendations: ${formData.recommendations}\n\nNotes: ${formData.notes}`,
      }

      // Add visit to store
      addVisit(followUpVisitData)

      Alert.alert('Success', 'Follow-up visit recorded successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to patient details
            router.replace(`/patient/${patient.id}`)
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
      <SafeAreaView className='flex-1 bg-gray-100'>
        <View className='flex-1 items-center justify-center px-6'>
          <Text className='text-lg font-semibold text-gray-800 mb-2'>
            Patient Not Found
          </Text>
          <Text className='text-gray-600 text-center'>
            The selected patient could not be found.
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-100'>
      {/* Header */}
      <View className='bg-white px-4 py-4 border-b border-gray-200'>
        <View className='flex-row items-center justify-between'>
          <TouchableOpacity
            onPress={() => router.back()}
            className='flex-row items-center'
          >
            <Ionicons name='arrow-back' size={24} color='#374151' />
            <Text className='text-gray-700 font-medium ml-2'>Back</Text>
          </TouchableOpacity>
          <Text className='text-lg font-semibold text-gray-800'>
            Follow-up Visit
          </Text>
          <View style={{ width: 60 }} />
        </View>
        <Text className='text-gray-600 mt-2'>Patient: {patient.name}</Text>
      </View>

      <ScrollView
        className='flex-1 px-4 py-6'
        showsVerticalScrollIndicator={false}
      >
        <View className='space-y-6'>
          {/* Current Pregnancy Assessment */}
          <View className='bg-white rounded-lg p-4'>
            <Text className='text-lg font-semibold text-gray-800 mb-4'>
              Current Pregnancy Assessment
            </Text>

            <View className='space-y-4'>
              <SimpleFormField
                label='Current Gestation (weeks)'
                value={formData.currentGestationWeeks}
                onChangeText={(value: string) =>
                  handleInputChange('currentGestationWeeks', value)
                }
                placeholder='e.g., 28'
                keyboardType='numeric'
                required
              />

              <SimpleFormField
                label='Blood Pressure'
                value={formData.bloodPressure}
                onChangeText={(value: string) =>
                  handleInputChange('bloodPressure', value)
                }
                placeholder='e.g., 120/80'
                required
              />

              <SimpleFormField
                label='Weight (kg)'
                value={formData.weight}
                onChangeText={(value: string) =>
                  handleInputChange('weight', value)
                }
                placeholder='e.g., 65'
                keyboardType='numeric'
                required
              />

              <SimpleFormField
                label='Fundal Height (cm)'
                value={formData.fundalHeight}
                onChangeText={(value: string) =>
                  handleInputChange('fundalHeight', value)
                }
                placeholder='e.g., 28'
                keyboardType='numeric'
                required
              />

              <SimpleFormField
                label='Fetal Heart Rate (bpm)'
                value={formData.fetalHeartRate}
                onChangeText={(value: string) =>
                  handleInputChange('fetalHeartRate', value)
                }
                placeholder='e.g., 140'
                keyboardType='numeric'
                required
              />

              <SimpleFormField
                label='Fetal Movement'
                value={formData.fetalMovement}
                onChangeText={(value: string) =>
                  handleInputChange('fetalMovement', value)
                }
                placeholder='e.g., Good, Active'
              />

              <SimpleFormField
                label='Urine Test'
                value={formData.urineTest}
                onChangeText={(value: string) =>
                  handleInputChange('urineTest', value)
                }
                placeholder='e.g., Normal, Protein +1'
              />
            </View>
          </View>

          {/* Clinical Assessment */}
          <View className='bg-white rounded-lg p-4'>
            <Text className='text-lg font-semibold text-gray-800 mb-4'>
              Clinical Assessment
            </Text>

            <View className='space-y-4'>
              <SimpleFormField
                label='Complaints'
                value={formData.complaints}
                onChangeText={(value: string) =>
                  handleInputChange('complaints', value)
                }
                placeholder='Any complaints or concerns...'
                multiline
                numberOfLines={3}
              />

              <SimpleFormField
                label='Physical Examination'
                value={formData.physicalExamination}
                onChangeText={(value: string) =>
                  handleInputChange('physicalExamination', value)
                }
                placeholder='Physical examination findings...'
                multiline
                numberOfLines={3}
              />

              <SimpleFormField
                label='Haemoglobin Level (g/dL)'
                value={formData.haemoglobinLevel}
                onChangeText={(value: string) =>
                  handleInputChange('haemoglobinLevel', value)
                }
                placeholder='e.g., 11.5'
                keyboardType='numeric'
              />

              <SimpleFormField
                label='Malaria Test Result'
                value={formData.malariaTestResult}
                onChangeText={(value: string) =>
                  handleInputChange('malariaTestResult', value)
                }
                placeholder='e.g., Negative, Positive'
              />
            </View>
          </View>

          {/* Risk Assessment & Recommendations */}
          <View className='bg-white rounded-lg p-4'>
            <Text className='text-lg font-semibold text-gray-800 mb-4'>
              Risk Assessment & Recommendations
            </Text>

            <View className='space-y-4'>
              <SimpleFormField
                label='Identified Risks'
                value={formData.identifiedRisks}
                onChangeText={(value: string) =>
                  handleInputChange('identifiedRisks', value)
                }
                placeholder='Any identified risk factors...'
                multiline
                numberOfLines={2}
              />

              <SimpleFormField
                label='Referral to Higher Level'
                value={formData.referralToHigherLevel}
                onChangeText={(value: string) =>
                  handleInputChange('referralToHigherLevel', value)
                }
                placeholder='Yes or No'
              />

              {formData.referralToHigherLevel.toLowerCase() === 'yes' && (
                <SimpleFormField
                  label='Referral Reason'
                  value={formData.referralReason}
                  onChangeText={(value: string) =>
                    handleInputChange('referralReason', value)
                  }
                  placeholder='Reason for referral...'
                  multiline
                  numberOfLines={2}
                />
              )}

              <SimpleFormField
                label='Recommendations'
                value={formData.recommendations}
                onChangeText={(value: string) =>
                  handleInputChange('recommendations', value)
                }
                placeholder='Recommendations and next steps...'
                multiline
                numberOfLines={3}
              />

              <SimpleFormField
                label='Additional Notes'
                value={formData.notes}
                onChangeText={(value: string) =>
                  handleInputChange('notes', value)
                }
                placeholder='Additional notes...'
                multiline
                numberOfLines={3}
              />
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
