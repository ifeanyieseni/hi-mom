import { useCallback, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PatientForm } from '@/types/patients'
import { usePatientStore } from '@/store/patientStore'
import { useAntenatalVisitStore } from '@/store/antenatalVisitStore'
import {
  assessPatientRisk,
  RiskAssessmentResponse,
} from '@/services/riskAssessment'

interface UseFormPersistenceReturn {
  saveDraft: (data: Partial<PatientForm>) => Promise<void>
  loadDraft: () => Promise<Partial<PatientForm> | null>
  clearDraft: () => Promise<void>
  hasDraft: () => Promise<boolean>
  savePatient: (data: PatientForm) => Promise<{
    patientId: string
    riskAssessment: RiskAssessmentResponse
  }>
}

export function useFormPersistence(formId: string): UseFormPersistenceReturn {
  const { addPatient, findPatientByPhone } = usePatientStore()
  const { addVisit } = useAntenatalVisitStore()

  const getDraftKey = useCallback(() => `form_draft_${formId}`, [formId])

  // Draft management using AsyncStorage
  const saveDraft = useCallback(
    async (data: Partial<PatientForm>) => {
      try {
        const draftKey = getDraftKey()
        const draftData = {
          data,
          timestamp: new Date().toISOString(),
          formId,
        }
        await AsyncStorage.setItem(draftKey, JSON.stringify(draftData))
        console.log('Draft saved successfully')
      } catch (error) {
        console.error('Failed to save form draft:', error)
      }
    },
    [getDraftKey, formId]
  )

  const loadDraft =
    useCallback(async (): Promise<Partial<PatientForm> | null> => {
      try {
        const draftKey = getDraftKey()
        const draftString = await AsyncStorage.getItem(draftKey)
        if (draftString) {
          const draftData = JSON.parse(draftString)
          console.log('Draft loaded successfully')
          return draftData.data
        }
        return null
      } catch (error) {
        console.error('Failed to load form draft:', error)
        return null
      }
    }, [getDraftKey])

  const clearDraft = useCallback(async () => {
    try {
      const draftKey = getDraftKey()
      await AsyncStorage.removeItem(draftKey)
      console.log('Draft cleared successfully')
    } catch (error) {
      console.error('Failed to clear form draft:', error)
    }
  }, [getDraftKey])

  const hasDraft = useCallback(async (): Promise<boolean> => {
    try {
      const draftKey = getDraftKey()
      const draftString = await AsyncStorage.getItem(draftKey)
      return draftString !== null
    } catch (error) {
      console.error('Failed to check for form draft:', error)
      return false
    }
  }, [getDraftKey])

  // Patient saving using Zustand stores with AI risk assessment
  const savePatient = useCallback(
    async (
      data: PatientForm
    ): Promise<{
      patientId: string
      riskAssessment: RiskAssessmentResponse
    }> => {
      try {
        // Check for duplicate patient by phone number
        const existingPatient = findPatientByPhone(
          data.demographicAndContactInformation.womanPhoneNumber
        )
        if (existingPatient) {
          throw new Error('Patient with this phone number already exists')
        }

        // 1. PERFORM AI RISK ASSESSMENT FIRST
        console.log('Performing AI risk assessment...')
        const riskAssessment = await assessPatientRisk(data)
        console.log('Risk assessment completed:', riskAssessment)

        // Generate patient ID
        const patientId = `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        // 2. CREATE PATIENT RECORD WITH AI-GENERATED RISK LEVEL
        const patient = {
          id: patientId,
          name: data.demographicAndContactInformation.womanFullName,
          age: data.demographicAndContactInformation.age,
          phoneNumber: data.demographicAndContactInformation.womanPhoneNumber,
          address: `${data.demographicAndContactInformation.villageAddress}, ${data.demographicAndContactInformation.lga}, ${data.demographicAndContactInformation.state}`,
          gestationWeeks:
            data.currentPregnancyDetails.currentGestationWeeks || 0,
          dueDate: data.obstetricHistory.estimatedDateOfDelivery,
          riskLevel: riskAssessment.riskLevel, // Use AI-generated risk level
          nextAppointment: data.patientMetadata.nextAppointment || '',
          lastVisit: data.patientMetadata.visitDate,
          notes: data.currentPregnancyDetails.notes || '',
          imageUrl: data.patientMetadata.imageUrl || '',
          conditions: [], // Will be populated from medical history
          medications: [], // Will be populated from additional fields

          // Additional fields for follow-up visits
          husbandName: data.demographicAndContactInformation.husbandName,
          husbandPhoneNumber:
            data.demographicAndContactInformation.husbandPhoneNumber,
          occupation: data.demographicAndContactInformation.womanOccupation,
          educationLevel:
            data.demographicAndContactInformation.womanEducationLevel,
          maritalStatus: data.demographicAndContactInformation.maritalStatus,
          emergencyContactName:
            data.demographicAndContactInformation.emergencyContactName,
          emergencyContactRelationship:
            data.demographicAndContactInformation.emergencyContactRelationship,

          // Obstetric history essentials
          totalPregnancies: data.obstetricHistory.totalPregnancies,
          numberOfLiveBirths: data.obstetricHistory.numberOfLiveBirths,
          previousDeliveries: data.obstetricHistory.numberOfPreviousDeliveries,
          previousAbortions: data.obstetricHistory.previousAbortions
            .hasAbortions
            ? 'yes'
            : 'no',
          numberOfAbortions:
            data.obstetricHistory.previousAbortions.countIfYes || 0,
          previousStillbirths: data.obstetricHistory.previousStillbirths
            ? 'yes'
            : 'no',
          previousCesareanSections: data.obstetricHistory
            .previousCesareanSections.hadCesarean
            ? 'yes'
            : 'no',
          numberOfCesareanSections:
            data.obstetricHistory.previousCesareanSections.countIfYes || 0,
          lastMenstrualPeriod: data.obstetricHistory.lastMenstrualPeriod,
          estimatedDateOfDelivery:
            data.obstetricHistory.estimatedDateOfDelivery,

          // Medical history essentials
          medicalHistory: {
            hypertension: data.medicalHistory.hypertension ? 'yes' : 'no',
            diabetes: data.medicalHistory.diabetes ? 'yes' : 'no',
            asthma: data.medicalHistory.asthma ? 'yes' : 'no',
            epilepsy: data.medicalHistory.epilepsy ? 'yes' : 'no',
            kidneyRenalDisease: data.medicalHistory.kidneyRenalDisease
              ? 'yes'
              : 'no',
            sickleCellDisease: data.medicalHistory.sickleCellDisease
              ? 'yes'
              : 'no',
            sickleCellTrait: data.medicalHistory.sickleCellTrait ? 'yes' : 'no',
            tuberculosis: data.medicalHistory.tuberculosis ? 'yes' : 'no',
            heartDisease: data.medicalHistory.heartDisease ? 'yes' : 'no',
            thyroidProblems: data.medicalHistory.thyroidProblems ? 'yes' : 'no',
            chronicAnaemia: data.medicalHistory.chronicAnaemia ? 'yes' : 'no',
            bloodTransfusions: data.medicalHistory.bloodTransfusions
              ? 'yes'
              : 'no',
            hivStatus: data.medicalHistory.hivStatus,
            hepatitisBStatus: data.medicalHistory.hepatitisBStatus,
            recentMalaria: data.medicalHistory.recentMalariaEpisodes
              ? 'yes'
              : 'no',
            otherChronicIllness: data.medicalHistory
              .otherChronicIllnessOrMedications
              ? 'yes'
              : 'no',
            otherChronicIllnessDetails:
              data.medicalHistory.otherChronicIllnessOrMedications || '',
          },

          // Laboratory essentials
          bloodGroupRhesus: data.laboratoryInvestigations.bloodGroupAndRhesus,

          // Delivery plan essentials
          plannedDeliveryPlace: data.deliveryPlan.plannedDeliveryPlace,
          healthFacilityName: data.deliveryPlan.facilityNameIfKnown,
        }

        // Add patient to store (which handles AsyncStorage persistence)
        await addPatient(patient)

        // 3. CREATE ANTENATAL VISIT RECORD
        const visitData = {
          patientId,
          visitDate: data.patientMetadata.visitDate,
          visitType: data.patientMetadata.visitType,

          // Map form data to visit store format
          womanFullName: data.demographicAndContactInformation.womanFullName,
          age: data.demographicAndContactInformation.age.toString(),
          villageAddress: data.demographicAndContactInformation.villageAddress,
          womanPhoneNumber:
            data.demographicAndContactInformation.womanPhoneNumber,
          husbandName: data.demographicAndContactInformation.husbandName || '',
          husbandPhoneNumber:
            data.demographicAndContactInformation.husbandPhoneNumber || '',
          womanOccupation:
            data.demographicAndContactInformation.womanOccupation || '',
          husbandOccupation:
            data.demographicAndContactInformation.husbandOccupation || '',
          womanEducationLevel:
            data.demographicAndContactInformation.womanEducationLevel || '',
          husbandEducationLevel:
            data.demographicAndContactInformation.husbandEducationLevel || '',
          maritalStatus:
            data.demographicAndContactInformation.maritalStatus || '',
          emergencyContactName:
            data.demographicAndContactInformation.emergencyContactName,
          emergencyContactRelationship:
            data.demographicAndContactInformation.emergencyContactRelationship,

          // Obstetric history
          totalPregnancies:
            data.obstetricHistory.totalPregnancies?.toString() || '0',
          numberOfLiveBirths:
            data.obstetricHistory.numberOfLiveBirths?.toString() || '0',
          previousDeliveries:
            data.obstetricHistory.numberOfPreviousDeliveries || '0',
          previousAbortions: data.obstetricHistory.previousAbortions
            ?.hasAbortions
            ? 'Yes'
            : 'No',
          numberOfAbortions:
            data.obstetricHistory.previousAbortions?.countIfYes?.toString() ||
            '0',
          previousStillbirths: data.obstetricHistory.previousStillbirths
            ? 'Yes'
            : 'No',
          previousCesareanSections: data.obstetricHistory
            .previousCesareanSections?.hadCesarean
            ? 'Yes'
            : 'No',
          numberOfCesareanSections:
            data.obstetricHistory.previousCesareanSections?.countIfYes?.toString() ||
            '0',
          previousVacuumForcepsDelivery: data.obstetricHistory
            .previousVacuumForcepsDelivery
            ? 'Yes'
            : 'No',
          previousAPHPPH: data.obstetricHistory.previousAPHPPH ? 'Yes' : 'No',
          previousEclampsiaPreeclampsia: data.obstetricHistory
            .previousEclampsiaPreeclampsia
            ? 'Yes'
            : 'No',
          previousSymphysiotomyFistulaRepair: data.obstetricHistory
            .previousSymphysiotomyFistulaRepair
            ? 'Yes'
            : 'No',
          lastMenstrualPeriod: data.obstetricHistory.lastMenstrualPeriod,
          estimatedDateOfDelivery:
            data.obstetricHistory.estimatedDateOfDelivery,
          birthWeightOfLastChild:
            data.obstetricHistory.lastBirthWeightKg?.toString() || '',
          intervalSinceLastDelivery:
            data.obstetricHistory.intervalSinceLastDeliveryYears?.toString() ||
            '',

          // Medical history
          hypertension: data.medicalHistory.hypertension ? 'Yes' : 'No',
          diabetes: data.medicalHistory.diabetes ? 'Yes' : 'No',
          asthma: data.medicalHistory.asthma ? 'Yes' : 'No',
          epilepsy: data.medicalHistory.epilepsy ? 'Yes' : 'No',
          kidneyRenalDisease: data.medicalHistory.kidneyRenalDisease
            ? 'Yes'
            : 'No',
          sickleCellDisease: data.medicalHistory.sickleCellDisease
            ? 'Yes'
            : 'No',
          sickleCellTrait: data.medicalHistory.sickleCellTrait ? 'Yes' : 'No',
          tuberculosis: data.medicalHistory.tuberculosis ? 'Yes' : 'No',
          heartDisease: data.medicalHistory.heartDisease ? 'Yes' : 'No',
          thyroidProblems: data.medicalHistory.thyroidProblems ? 'Yes' : 'No',
          chronicAnaemia: data.medicalHistory.chronicAnaemia ? 'Yes' : 'No',
          bloodTransfusions: data.medicalHistory.bloodTransfusions
            ? 'Yes'
            : 'No',
          hivStatus: data.medicalHistory.hivStatus || 'Unknown/Not Tested',
          hepatitisBStatus:
            data.medicalHistory.hepatitisBStatus || 'Unknown/Not Tested',
          recentMalaria: data.medicalHistory.recentMalariaEpisodes
            ? 'Yes'
            : 'No',
          otherChronicIllness: data.medicalHistory
            .otherChronicIllnessOrMedications
            ? 'Yes'
            : 'No',
          otherChronicIllnessDetails:
            data.medicalHistory.otherChronicIllnessOrMedications || '',

          // Current pregnancy details
          currentGestationWeeks:
            data.currentPregnancyDetails.currentGestationWeeks?.toString() ||
            '0',
          bloodPressure: data.currentPregnancyDetails.bloodPressure || '',
          weight: data.currentPregnancyDetails.weight?.toString() || '',
          fundalHeight:
            data.currentPregnancyDetails.fundalHeight?.toString() || '',
          fetalHeartRate:
            data.currentPregnancyDetails.fetalHeartRate?.toString() || '',
          fetalMovement: data.currentPregnancyDetails.fetalMovement || 'Good',
          urineTest: data.currentPregnancyDetails.urineTest || '',
          notes: data.currentPregnancyDetails.notes || '',

          // Laboratory investigations
          bloodGroupRhesus:
            data.laboratoryInvestigations.bloodGroupAndRhesus || '',
          haemoglobinLevel:
            data.laboratoryInvestigations.haemoglobinLevel?.toString() || '',
          hivTestResult:
            data.laboratoryInvestigations.hivTestResult?.result || 'Pending',
          hivTestDate:
            data.laboratoryInvestigations.hivTestResult?.dateTested || '',
          syphilisTestResult:
            data.laboratoryInvestigations.syphilisTestResult?.result ||
            'Pending',
          syphilisTestDate:
            data.laboratoryInvestigations.syphilisTestResult?.dateTested || '',
          hepatitisBTestResult:
            data.laboratoryInvestigations.hepatitisBTestResult?.result ||
            'Pending',
          hepatitisBTestDate:
            data.laboratoryInvestigations.hepatitisBTestResult?.dateTested ||
            '',
          malariaTestResult:
            data.laboratoryInvestigations.malariaTestResult?.result ||
            'Pending',
          malariaTestDate:
            data.laboratoryInvestigations.malariaTestResult?.dateTested || '',

          // Delivery plan
          plannedDeliveryPlace:
            data.deliveryPlan.plannedDeliveryPlace || 'Health Facility',
          healthFacilityName: data.deliveryPlan.facilityNameIfKnown || '',
          otherDeliveryPlace: data.deliveryPlan.specifyIfOther || '',
          transportPlanForEmergencies: data.deliveryPlan
            .transportPlanForEmergencies
            ? 'Yes'
            : 'No',

          // Risk assessment
          identifiedRisks: data.riskAssessment.identifiedRisks?.hasRisks
            ? 'Yes'
            : 'No',
          specifiedRisks:
            data.riskAssessment.identifiedRisks?.specifyRisks || '',
          referralToHigherLevel: data.riskAssessment.referralToHigherFacility
            ?.isReferred
            ? 'Yes'
            : 'No',
          referralReason:
            data.riskAssessment.referralToHigherFacility?.reasonIfYes || '',

          // Health education topics (default to false for all topics)
          healthEducationTopics: {
            nutritionDuringPregnancy: false,
            dangerSignsInPregnancy: false,
            birthPreparedness: false,
            exclusiveBreastfeeding: false,
            familyPlanning: false,
            postnatalCare: false,
            infantCare: false,
            malariaPrevention: false,
            hivPreventionPMTCT: false,
            other: false,
            otherDetails: '',
          },

          // Additional required fields for the visit store
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Add visit to store (which handles AsyncStorage persistence)
        addVisit(visitData)

        // Clear the draft after successful save
        await clearDraft()

        console.log('Patient and visit saved successfully:', {
          patientId,
          riskLevel: riskAssessment.riskLevel,
          triggersCount: riskAssessment.triggers.length,
        })

        // Return both patient ID and risk assessment for UI display
        return { patientId, riskAssessment }
      } catch (error) {
        console.error('Failed to save patient:', error)
        throw error
      }
    },
    [addPatient, addVisit, findPatientByPhone, clearDraft]
  )

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
    savePatient,
  }
}
