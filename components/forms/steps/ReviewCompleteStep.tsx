import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { useFormContext } from 'react-hook-form'
import { useRouter } from 'expo-router'
import { PatientForm } from '@/types/patients'
import { RiskAssessmentModal } from '@/components/modals/RiskAssessmentModal'
import { RiskAssessmentResponse } from '@/services/riskAssessment'

interface ReviewCompleteStepProps {
  onSubmit: (data: PatientForm) => Promise<{
    patientId: string
    riskAssessment: RiskAssessmentResponse
  }>
}

export function ReviewCompleteStep({ onSubmit }: ReviewCompleteStepProps) {
  const { getValues } = useFormContext<PatientForm>()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRiskAssessment, setShowRiskAssessment] = useState(false)
  const [riskAssessmentData, setRiskAssessmentData] =
    useState<RiskAssessmentResponse | null>(null)
  const [patientName, setPatientName] = useState('')
  const [createdPatientId, setCreatedPatientId] = useState<string | null>(null)

  const formData = getValues()

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Submit form and get risk assessment
      const result = await onSubmit(formData)

      // Store risk assessment data, patient name, and patient ID
      setRiskAssessmentData(result.riskAssessment)
      setPatientName(formData.demographicAndContactInformation.womanFullName)
      setCreatedPatientId(result.patientId)

      // Show risk assessment modal
      setShowRiskAssessment(true)
    } catch (error) {
      console.error('Form submission error:', error)
      // Handle error (show alert, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRiskAssessmentClose = () => {
    setShowRiskAssessment(false)

    // Navigate to the created patient's care page
    if (createdPatientId) {
      router.push(`/patient/${createdPatientId}`)
    } else {
      // Fallback: navigate to patients list if no patient ID
      router.push('/patients')
    }
  }

  return (
    <>
      <ScrollView
        className='flex-1 px-6 pb-4'
        showsVerticalScrollIndicator={false}
      >
        <View className='space-y-4'>
          {/* Demographics Summary */}
          <View className='bg-slate-50 p-4 rounded-lg'>
            <Text className='text-lg font-semibold text-slate-800 mb-3'>
              Personal Information
            </Text>
            <View className='space-y-2'>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Name:</Text>{' '}
                {formData.demographicAndContactInformation?.womanFullName}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Age:</Text>{' '}
                {formData.demographicAndContactInformation?.age} years
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Phone:</Text>{' '}
                {formData.demographicAndContactInformation?.womanPhoneNumber}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Marital Status:</Text>{' '}
                {formData.demographicAndContactInformation?.maritalStatus}
              </Text>
            </View>
          </View>

          {/* Obstetric History Summary */}
          <View className='bg-slate-50 p-4 rounded-lg'>
            <Text className='text-lg font-semibold text-slate-800 mb-3'>
              Obstetric History
            </Text>
            <View className='space-y-2'>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Gravida:</Text>{' '}
                {formData.obstetricHistory?.totalPregnancies || 'Not specified'}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Para:</Text>{' '}
                {formData.obstetricHistory?.numberOfLiveBirths ||
                  'Not specified'}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>LMP:</Text>{' '}
                {formatDate(formData.obstetricHistory?.lastMenstrualPeriod)}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>EDD:</Text>{' '}
                {formatDate(formData.obstetricHistory?.estimatedDateOfDelivery)}
              </Text>
            </View>
          </View>

          {/* Medical History Summary */}
          <View className='bg-slate-50 p-4 rounded-lg'>
            <Text className='text-lg font-semibold text-slate-800 mb-3'>
              Medical History
            </Text>
            <View className='space-y-2'>
              <Text className='text-slate-700'>
                <Text className='font-medium'>HIV Status:</Text>{' '}
                {formData.medicalHistory?.hivStatus || 'Unknown/Not Tested'}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Hepatitis B:</Text>{' '}
                {formData.medicalHistory?.hepatitisBStatus ||
                  'Unknown/Not Tested'}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Hypertension:</Text>{' '}
                {formData.medicalHistory?.hypertension ? 'Yes' : 'No'}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Diabetes:</Text>{' '}
                {formData.medicalHistory?.diabetes ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>

          {/* Current Pregnancy Summary */}
          <View className='bg-slate-50 p-4 rounded-lg'>
            <Text className='text-lg font-semibold text-slate-800 mb-3'>
              Current Pregnancy
            </Text>
            <View className='space-y-2'>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Gestation:</Text>{' '}
                {formData.currentPregnancyDetails?.currentGestationWeeks || 0}{' '}
                weeks
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Blood Pressure:</Text>{' '}
                {formData.currentPregnancyDetails?.bloodPressure ||
                  'Not recorded'}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Weight:</Text>{' '}
                {formData.currentPregnancyDetails?.weight
                  ? `${formData.currentPregnancyDetails.weight} kg`
                  : 'Not recorded'}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Fetal Heart Rate:</Text>{' '}
                {formData.currentPregnancyDetails?.fetalHeartRate
                  ? `${formData.currentPregnancyDetails.fetalHeartRate} bpm`
                  : 'Not recorded'}
              </Text>
            </View>
          </View>

          {/* Laboratory Results Summary */}
          <View className='bg-slate-50 p-4 rounded-lg'>
            <Text className='text-lg font-semibold text-slate-800 mb-3'>
              Laboratory Results
            </Text>
            <View className='space-y-2'>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Blood Group:</Text>{' '}
                {formData.laboratoryInvestigations?.bloodGroupAndRhesus ||
                  'Not tested'}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Haemoglobin:</Text>{' '}
                {formData.laboratoryInvestigations?.haemoglobinLevel
                  ? `${formData.laboratoryInvestigations.haemoglobinLevel} g/dL`
                  : 'Not tested'}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>HIV Test:</Text>{' '}
                {formData.laboratoryInvestigations?.hivTestResult?.result ||
                  'Not done'}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Syphilis Test:</Text>{' '}
                {formData.laboratoryInvestigations?.syphilisTestResult
                  ?.result || 'Not done'}
              </Text>
            </View>
          </View>

          {/* Delivery Plan Summary */}
          <View className='bg-slate-50 p-4 rounded-lg'>
            <Text className='text-lg font-semibold text-slate-800 mb-3'>
              Delivery Plan
            </Text>
            <View className='space-y-2'>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Planned Location:</Text>{' '}
                {formData.deliveryPlan?.plannedDeliveryPlace || 'Not specified'}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Facility:</Text>{' '}
                {formData.deliveryPlan?.facilityNameIfKnown || 'Not specified'}
              </Text>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Transport Plan:</Text>{' '}
                {formData.deliveryPlan?.transportPlanForEmergencies
                  ? 'Yes'
                  : 'No'}
              </Text>
            </View>
          </View>

          {/* Risk Assessment Summary */}
          <View className='bg-slate-50 p-4 rounded-lg'>
            <Text className='text-lg font-semibold text-slate-800 mb-3'>
              Risk Assessment
            </Text>
            <View className='space-y-2'>
              <Text className='text-slate-700'>
                <Text className='font-medium'>Risk Level:</Text>{' '}
                {formData.patientMetadata?.riskLevel || 'Not assessed'}
              </Text>
              {formData.riskAssessment?.identifiedRisks?.hasRisks && (
                <Text className='text-slate-700'>
                  <Text className='font-medium'>Identified Risks:</Text>{' '}
                  {formData.riskAssessment.identifiedRisks.specifyRisks ||
                    'Yes'}
                </Text>
              )}
            </View>
          </View>

          {/* Completion Notice */}
          <View className='bg-blue-50 border border-blue-200 p-4 rounded-lg'>
            <Text className='text-blue-800 font-medium text-center'>
              Please review all information above carefully before submitting.
            </Text>
            <Text className='text-blue-700 text-sm text-center mt-2'>
              Once submitted, this will create a new patient record and schedule
              their first antenatal visit.
            </Text>
          </View>

          {/* Submit Button */}
          <View className='py-6 mb-16'>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`p-4 rounded-lg ${
                isSubmitting ? 'bg-gray-400' : 'bg-indigo-600'
              }`}
            >
              <Text className='text-white font-semibold text-center text-lg'>
                {isSubmitting
                  ? 'Processing & Analyzing...'
                  : 'Complete Registration'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Risk Assessment Modal */}
      <RiskAssessmentModal
        visible={showRiskAssessment}
        onClose={handleRiskAssessmentClose}
        riskAssessment={riskAssessmentData}
        patientName={patientName}
      />
    </>
  )
}
