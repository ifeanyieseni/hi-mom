import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'expo-router'
import { PatientForm, patientFormSchema } from '@/types/patients'
import { RiskAssessmentResponse } from '@/services/riskAssessment'
import { DemographicContactStep } from './steps/DemographicContactStep'
import { ObstetricHistoryStep } from './steps/ObstetricHistoryStep'
import { MedicalHistoryStep } from './steps/MedicalHistoryStep'
import { CurrentPregnancyStep } from './steps/CurrentPregnancyStep'
import { LaboratoryInvestigationsStep } from './steps/LaboratoryInvestigationsStep'
import { DeliveryPlanStep } from './steps/DeliveryPlanStep'
import { ReviewCompleteStep } from './steps/ReviewCompleteStep'
import { StepIndicator } from './components/StepIndicator'
import { useFormPersistence } from '../../hooks/useFormPersistence'

const TOTAL_STEPS = 7

const STEP_TITLES = [
  'Demographics & Contact',
  'Obstetric History',
  'Medical History',
  'Current Pregnancy',
  'Laboratory Tests',
  'Delivery & Risk Assessment',
  'Review & Complete',
]

export default function PatientOnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  const methods = useForm<PatientForm>({
    resolver: zodResolver(patientFormSchema),
    mode: 'onChange',
    defaultValues: {
      demographicAndContactInformation: {},
      obstetricHistory: {
        totalPregnancies: 0,
        numberOfLiveBirths: 0,
        numberOfPreviousDeliveries: '0',
        previousAbortions: { hasAbortions: false },
        previousStillbirths: false,
        previousCesareanSections: { hadCesarean: false },
        previousVacuumForcepsDelivery: false,
        previousAPHPPH: false,
        previousEclampsiaPreeclampsia: false,
        previousSymphysiotomyFistulaRepair: false,
        lastMenstrualPeriod: '',
        estimatedDateOfDelivery: '',
      },
      medicalHistory: {
        hypertension: false,
        diabetes: false,
        asthma: false,
        epilepsy: false,
        kidneyRenalDisease: false,
        sickleCellDisease: false,
        sickleCellTrait: false,
        tuberculosis: false,
        heartDisease: false,
        thyroidProblems: false,
        chronicAnaemia: false,
        bloodTransfusions: false,
        hivStatus: 'Unknown/Not Tested',
        hepatitisBStatus: 'Unknown/Not Tested',
        recentMalariaEpisodes: false,
      },
      currentPregnancyDetails: {
        currentGestationWeeks: 0,
      },
      laboratoryInvestigations: {
        hivTestResult: { result: 'Pending' },
        syphilisTestResult: { result: 'Pending' },
        hepatitisBTestResult: { result: 'Pending' },
        malariaTestResult: { result: 'N/A' },
        otherTests: '',
      },
      deliveryPlan: {
        plannedDeliveryPlace: 'Health Facility',
        transportPlanForEmergencies: false,
      },
      riskAssessment: {
        identifiedRisks: { hasRisks: false },
        referralToHigherFacility: { isReferred: false },
      },
      patientMetadata: {
        registrationDate: new Date().toISOString(),
        visitType: 'first',
        visitDate: new Date().toISOString(),
        riskLevel: 'unknown',
      },
    },
  })

  const { saveDraft, loadDraft, clearDraft, savePatient } =
    useFormPersistence('patient-onboarding')

  // Monitor currentStep changes
  useEffect(() => {
    console.log('=== currentStep changed ===')
    console.log('New currentStep value:', currentStep)
  }, [currentStep])

  const handleNext = async () => {
    console.log('=== handleNext called ===')
    console.log('Current step:', currentStep)
    console.log('Total steps:', TOTAL_STEPS)

    // Simple validation - just check if required fields are filled for current step
    let isValid = true
    let errorMessage = ''

    switch (currentStep) {
      case 0: // DemographicContactStep
        const demographic = methods.getValues(
          'demographicAndContactInformation'
        )

        // Check required fields for all users
        if (
          !demographic?.womanFullName ||
          !demographic?.age ||
          !demographic?.bloodType ||
          !demographic?.maritalStatus ||
          !demographic?.state ||
          !demographic?.lga ||
          !demographic?.villageAddress ||
          !demographic?.womanPhoneNumber ||
          !demographic?.womanEducationLevel ||
          !demographic?.emergencyContactName ||
          !demographic?.emergencyContactRelationship
        ) {
          isValid = false
          errorMessage =
            'Please fill in all required fields in the Demographics section.'
        }

        // Additional validation for married users - require husband name
        if (
          demographic?.maritalStatus === 'Married' &&
          !demographic?.husbandName
        ) {
          isValid = false
          errorMessage =
            'Husband name is required when marital status is Married.'
        }
        break
      case 1: // ObstetricHistoryStep
        const obstetric = methods.getValues('obstetricHistory')

        // Use proper numeric validation (check for undefined/null, not falsy values)
        if (
          obstetric?.totalPregnancies === undefined ||
          obstetric?.totalPregnancies === null ||
          obstetric?.numberOfLiveBirths === undefined ||
          obstetric?.numberOfLiveBirths === null ||
          !obstetric?.numberOfPreviousDeliveries ||
          !obstetric?.lastMenstrualPeriod ||
          !obstetric?.estimatedDateOfDelivery
        ) {
          isValid = false
          errorMessage =
            'Please fill in all required fields in the Obstetric History section.'
        }

        // Logical validation for first pregnancy
        if (
          obstetric?.totalPregnancies === 1 &&
          obstetric?.numberOfLiveBirths > 0
        ) {
          isValid = false
          errorMessage =
            'For first pregnancy, number of live births should be 0.'
        }

        // Logical validation: live births cannot exceed total pregnancies
        if (obstetric?.numberOfLiveBirths > obstetric?.totalPregnancies) {
          isValid = false
          errorMessage =
            'Number of live births cannot exceed total pregnancies.'
        }
        break
      case 2: // MedicalHistoryStep
        // Medical history fields have default values, so basic validation should pass
        // Only validate if there are specific business rules needed
        break
      case 3: // CurrentPregnancyStep
        const pregnancy = methods.getValues('currentPregnancyDetails')
        if (
          !pregnancy?.currentGestationWeeks ||
          pregnancy.currentGestationWeeks <= 0
        ) {
          isValid = false
          errorMessage = 'Please enter the current gestation weeks.'
        }
        break
      case 4: // LaboratoryInvestigationsStep
        // All fields have defaults, so this should always pass
        break
      case 5: // DeliveryPlanStep
        const delivery = methods.getValues('deliveryPlan')
        const riskAssessment = methods.getValues('riskAssessment')

        // Required field validation
        if (!delivery?.plannedDeliveryPlace) {
          isValid = false
          errorMessage = 'Please select a planned delivery place.'
        }

        // Conditional validation for "Other" delivery location
        if (
          delivery?.plannedDeliveryPlace === 'Other' &&
          !delivery?.specifyIfOther
        ) {
          isValid = false
          errorMessage = 'Please specify the other delivery location.'
        }

        // Conditional validation for risk specification
        if (
          riskAssessment?.identifiedRisks?.hasRisks &&
          !riskAssessment?.identifiedRisks?.specifyRisks
        ) {
          isValid = false
          errorMessage = 'Please specify the identified risk factors.'
        }

        // Conditional validation for referral reason
        if (
          riskAssessment?.referralToHigherFacility?.isReferred &&
          !riskAssessment?.referralToHigherFacility?.reasonIfYes
        ) {
          isValid = false
          errorMessage = 'Please specify the reason for referral.'
        }
        break
      case 6: // ReviewCompleteStep
        // No validation needed here, just proceed to submission
        break
    }

    console.log('Form validation result:', isValid)

    if (!isValid) {
      console.log('Validation error:', errorMessage)
      Alert.alert('Form Validation Error', errorMessage, [{ text: 'OK' }])
      return
    }

    if (isValid) {
      console.log('Form is valid, proceeding...')
      try {
        await saveDraft(methods.getValues())
        console.log('Draft saved successfully')
      } catch (error) {
        console.log('Error saving draft:', error)
      }

      if (currentStep < TOTAL_STEPS - 1) {
        const nextStep = currentStep + 1
        console.log('Navigating from step', currentStep, 'to step', nextStep)
        setCurrentStep(nextStep)
        console.log('setCurrentStep called with:', nextStep)
      } else {
        console.log('Already at last step, cannot proceed further')
      }
    }
  }

  const handlePrevious = async () => {
    console.log('=== handlePrevious called ===')
    console.log('Current step:', currentStep)
    try {
      await saveDraft(methods.getValues())
      console.log('Draft saved successfully')
    } catch (error) {
      console.log('Error saving draft:', error)
    }

    if (currentStep > 0) {
      const prevStep = currentStep - 1
      console.log('Navigating from step', currentStep, 'to step', prevStep)
      setCurrentStep(prevStep)
      console.log('setCurrentStep called with:', prevStep)
    } else {
      console.log('Already at first step, cannot go back')
    }
  }

  const handleSubmit = async (
    data: PatientForm
  ): Promise<{
    patientId: string
    riskAssessment: RiskAssessmentResponse
  }> => {
    try {
      // Save patient data and perform risk assessment
      const result = await savePatient(data)
      await clearDraft()

      // Return the result for the ReviewCompleteStep to handle
      return result
    } catch (error) {
      console.error('Failed to save patient data:', error)
      Alert.alert('Error', 'Failed to save patient data')
      throw error // Re-throw so ReviewCompleteStep can handle it
    }
  }

  const renderCurrentStep = () => {
    console.log('=== renderCurrentStep called ===')
    console.log('Current step value:', currentStep)

    switch (currentStep) {
      case 0:
        console.log('Rendering DemographicContactStep')
        return <DemographicContactStep />
      case 1:
        console.log('Rendering ObstetricHistoryStep')
        return <ObstetricHistoryStep />
      case 2:
        console.log('Rendering MedicalHistoryStep')
        return <MedicalHistoryStep />
      case 3:
        console.log('Rendering CurrentPregnancyStep')
        return <CurrentPregnancyStep />
      case 4:
        console.log('Rendering LaboratoryInvestigationsStep')
        return <LaboratoryInvestigationsStep />
      case 5:
        console.log('Rendering DeliveryPlanStep')
        return <DeliveryPlanStep />
      case 6:
        console.log('Rendering ReviewCompleteStep')
        return <ReviewCompleteStep onSubmit={handleSubmit} />
      default:
        console.log('Rendering default DemographicContactStep')
        return <DemographicContactStep />
    }
  }

  return (
    <FormProvider {...methods}>
      <View className='flex-1 bg-white'>
        {/* Header */}
        <View className='px-6 py-4 bg-slate-50 border-b border-slate-200'>
          <Text className='text-lg font-semibold text-slate-800'>
            {STEP_TITLES[currentStep]}
          </Text>
          <StepIndicator
            currentStep={currentStep + 1}
            totalSteps={TOTAL_STEPS}
          />
        </View>

        {/* Form Content */}
        <View className='flex-1'>{renderCurrentStep()}</View>

        {/* Navigation Buttons */}
        {currentStep < TOTAL_STEPS - 1 && (
          <View className='px-6 py-4 bg-white border-t border-slate-200 mb-12'>
            <View className='flex-row justify-between'>
              <TouchableOpacity
                onPress={handlePrevious}
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-lg ${
                  currentStep === 0 ? 'bg-slate-100' : 'bg-slate-200'
                }`}
              >
                <Text
                  className={`font-medium ${
                    currentStep === 0 ? 'text-slate-400' : 'text-slate-700'
                  }`}
                >
                  Previous
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                className='px-6 py-3 bg-indigo-600 rounded-lg'
              >
                <Text className='text-white font-medium'>
                  {currentStep === TOTAL_STEPS - 2 ? 'Review' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </FormProvider>
  )
}
