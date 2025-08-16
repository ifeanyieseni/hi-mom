import { z } from 'zod'

export type RiskLevel = 'high' | 'medium' | 'low' | 'unknown'

export interface Vitals {
  bloodPressure: string
  temperature: number
  heartRate: number
  respirationRate: number
  oxygenSaturation: number
}

export interface Medication {
  name: string
  dosage: string
  frequency: string
  startDate?: string
}

export interface Surgery {
  type: string
  date: string
}

export interface VitalSigns extends Vitals {
  weight: number
  height: number
  bmi: number
}

export interface Patient {
  id: string
  name: string
  age: number
  phoneNumber: string
  address: string
  gestationWeeks: number
  dueDate: string
  riskLevel: RiskLevel
  nextAppointment: string
  lastVisit: string
  notes?: string
  imageUrl?: string
  vitals?: Vitals
  conditions?: string[]
  medications?: Medication[]

  // Additional fields needed for follow-up visits
  husbandName?: string
  husbandPhoneNumber?: string
  occupation?: string
  educationLevel?: string
  maritalStatus?: string
  emergencyContactName?: string
  emergencyContactRelationship?: string

  // Obstetric history essentials
  totalPregnancies?: number
  numberOfLiveBirths?: number
  previousDeliveries?: string
  previousAbortions?: string
  numberOfAbortions?: number
  previousStillbirths?: string
  previousCesareanSections?: string
  numberOfCesareanSections?: number
  lastMenstrualPeriod?: string
  estimatedDateOfDelivery?: string

  // Medical history essentials
  medicalHistory?: {
    hypertension?: string
    diabetes?: string
    asthma?: string
    epilepsy?: string
    kidneyRenalDisease?: string
    sickleCellDisease?: string
    sickleCellTrait?: string
    tuberculosis?: string
    heartDisease?: string
    thyroidProblems?: string
    chronicAnaemia?: string
    bloodTransfusions?: string
    hivStatus?: string
    hepatitisBStatus?: string
    recentMalaria?: string
    otherChronicIllness?: string
    otherChronicIllnessDetails?: string
  }

  // Laboratory essentials
  bloodGroupRhesus?: string

  // Delivery plan essentials
  plannedDeliveryPlace?: string
  healthFacilityName?: string
}

export interface PatientForm {
  demographicAndContactInformation: {
    womanFullName: string
    age: number
    villageAddress: string
    state: string
    lga: string
    bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
    womanPhoneNumber: string
    husbandName?: string
    husbandPhoneNumber?: string
    womanOccupation?: string
    husbandOccupation?: string
    womanEducationLevel:
      | 'No formal education'
      | 'Primary school'
      | 'Secondary school'
      | 'Tertiary education'
      | 'Postgraduate'
    husbandEducationLevel?:
      | 'No formal education'
      | 'Primary school'
      | 'Secondary school'
      | 'Tertiary education'
      | 'Postgraduate'
    maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed'
    emergencyContactName: string
    emergencyContactRelationship: string
  }

  obstetricHistory: {
    totalPregnancies: number
    numberOfLiveBirths: number
    numberOfPreviousDeliveries: '0' | '1' | '2' | '3+'
    previousAbortions: {
      hasAbortions: boolean
      countIfYes?: number
    }
    previousStillbirths: boolean
    previousCesareanSections: {
      hadCesarean: boolean
      countIfYes?: number
    }
    previousVacuumForcepsDelivery: boolean
    previousAPHPPH: boolean
    previousEclampsiaPreeclampsia: boolean
    previousSymphysiotomyFistulaRepair: boolean
    lastMenstrualPeriod: string
    estimatedDateOfDelivery: string
    lastBirthWeightKg?: number
    intervalSinceLastDeliveryYears?: number
  }

  medicalHistory: {
    hypertension: boolean
    diabetes: boolean
    asthma: boolean
    epilepsy: boolean
    kidneyRenalDisease: boolean
    sickleCellDisease: boolean
    sickleCellTrait: boolean
    tuberculosis: boolean
    heartDisease: boolean
    thyroidProblems: boolean
    chronicAnaemia: boolean
    bloodTransfusions: boolean
    hivStatus: 'Positive' | 'Negative' | 'Unknown/Not Tested'
    hepatitisBStatus: 'Positive' | 'Negative' | 'Unknown/Not Tested'
    recentMalariaEpisodes: boolean
    otherChronicIllnessOrMedications?: string
  }

  currentPregnancyDetails: {
    currentGestationWeeks: number
    bloodPressure?: string
    weight?: number
    fundalHeight?: number
    fetalHeartRate?: number
    fetalMovement?: 'Good' | 'Reduced' | 'Absent'
    urineTest?: string
    notes?: string
  }

  laboratoryInvestigations: {
    bloodGroupAndRhesus?: string
    haemoglobinLevel?: number
    packedCellVolume?: number
    hivTestResult: {
      result: 'Positive' | 'Negative' | 'Pending'
      dateTested?: string
    }
    syphilisTestResult: {
      result: 'Positive' | 'Negative' | 'Pending'
      dateTested?: string
    }
    hepatitisBTestResult: {
      result: 'Positive' | 'Negative' | 'Pending'
      dateTested?: string
    }
    malariaTestResult: {
      result: 'Positive' | 'Negative' | 'N/A'
      dateTested?: string
    }
    otherTests?: string
  }

  deliveryPlan: {
    plannedDeliveryPlace: 'Home' | 'Health Facility' | 'Other'
    specifyIfOther?: string
    facilityNameIfKnown?: string
    transportPlanForEmergencies: boolean
  }

  riskAssessment: {
    identifiedRisks: {
      hasRisks: boolean
      specifyRisks?: string
    }
    referralToHigherFacility: {
      isReferred: boolean
      reasonIfYes?: string
    }
  }

  patientMetadata: {
    patientId?: string
    registrationDate: string
    visitType: 'first' | 'follow-up'
    visitDate: string
    riskLevel: RiskLevel
    nextAppointment?: string
    imageUrl?: string
    archived?: boolean
  }

  additionalFields?: {
    presentation?: 'cephalic' | 'breech' | 'transverse'
    edema?: 'none' | 'mild' | 'moderate' | 'severe'
    urineTests?: {
      protein: '+' | '++' | '+++' | '-'
      glucose: '+' | '++' | '+++' | '-'
    }
    complaints?: string[]
    interventions?: string[]
  }
}

export const patientFormSchema = z.object({
  demographicAndContactInformation: z.object({
    womanFullName: z.string().min(1, 'Full name is required'),
    age: z
      .number()
      .min(12, 'Age must be at least 12')
      .max(60, 'Age must be less than 60'),
    villageAddress: z.string().min(1, 'Address is required'),
    state: z.string().min(1, 'State is required'),
    lga: z.string().min(1, 'LGA is required'),
    bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    womanPhoneNumber: z.string().min(10, 'Valid phone number is required'),
    husbandName: z.string().optional(),
    husbandPhoneNumber: z.string().optional(),
    womanOccupation: z.string().optional(),
    husbandOccupation: z.string().optional(),
    womanEducationLevel: z.enum([
      'No formal education',
      'Primary school',
      'Secondary school',
      'Tertiary education',
      'Postgraduate',
    ]),
    husbandEducationLevel: z
      .enum([
        'No formal education',
        'Primary school',
        'Secondary school',
        'Tertiary education',
        'Postgraduate',
      ])
      .optional(),
    maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
    emergencyContactName: z
      .string()
      .min(1, 'Emergency contact name is required'),
    emergencyContactRelationship: z
      .string()
      .min(1, 'Emergency contact relationship is required'),
  }),

  obstetricHistory: z.object({
    totalPregnancies: z.number().min(0),
    numberOfLiveBirths: z.number().min(0),
    numberOfPreviousDeliveries: z.enum(['0', '1', '2', '3+']),
    previousAbortions: z.object({
      hasAbortions: z.boolean(),
      countIfYes: z.number().optional(),
    }),
    previousStillbirths: z.boolean(),
    previousCesareanSections: z.object({
      hadCesarean: z.boolean(),
      countIfYes: z.number().optional(),
    }),
    previousVacuumForcepsDelivery: z.boolean(),
    previousAPHPPH: z.boolean(),
    previousEclampsiaPreeclampsia: z.boolean(),
    previousSymphysiotomyFistulaRepair: z.boolean(),
    lastMenstrualPeriod: z.string().min(1, 'Last menstrual period is required'),
    estimatedDateOfDelivery: z
      .string()
      .min(1, 'Estimated delivery date is required'),
    lastBirthWeightKg: z.number().optional(),
    intervalSinceLastDeliveryYears: z.number().optional(),
  }),

  medicalHistory: z.object({
    hypertension: z.boolean(),
    diabetes: z.boolean(),
    asthma: z.boolean(),
    epilepsy: z.boolean(),
    kidneyRenalDisease: z.boolean(),
    sickleCellDisease: z.boolean(),
    sickleCellTrait: z.boolean(),
    tuberculosis: z.boolean(),
    heartDisease: z.boolean(),
    thyroidProblems: z.boolean(),
    chronicAnaemia: z.boolean(),
    bloodTransfusions: z.boolean(),
    hivStatus: z.enum(['Positive', 'Negative', 'Unknown/Not Tested']),
    hepatitisBStatus: z.enum(['Positive', 'Negative', 'Unknown/Not Tested']),
    recentMalariaEpisodes: z.boolean(),
    otherChronicIllnessOrMedications: z.string().optional(),
  }),

  currentPregnancyDetails: z.object({
    currentGestationWeeks: z.number().min(1).max(42),
    bloodPressure: z.string().optional(),
    weight: z.number().optional(),
    fundalHeight: z.number().optional(),
    fetalHeartRate: z.number().optional(),
    fetalMovement: z.enum(['Good', 'Reduced', 'Absent']).optional(),
    urineTest: z.string().optional(),
    notes: z.string().optional(),
  }),

  laboratoryInvestigations: z.object({
    bloodGroupAndRhesus: z.string().optional(),
    haemoglobinLevel: z.number().optional(),
    packedCellVolume: z.number().optional(),
    hivTestResult: z.object({
      result: z.enum(['Positive', 'Negative', 'Pending']),
      dateTested: z.string().optional(),
    }),
    syphilisTestResult: z.object({
      result: z.enum(['Positive', 'Negative', 'Pending']),
      dateTested: z.string().optional(),
    }),
    hepatitisBTestResult: z.object({
      result: z.enum(['Positive', 'Negative', 'Pending']),
      dateTested: z.string().optional(),
    }),
    malariaTestResult: z.object({
      result: z.enum(['Positive', 'Negative', 'N/A']),
      dateTested: z.string().optional(),
    }),
    otherTests: z.string().optional(),
  }),

  deliveryPlan: z.object({
    plannedDeliveryPlace: z.enum(['Home', 'Health Facility', 'Other']),
    specifyIfOther: z.string().optional(),
    facilityNameIfKnown: z.string().optional(),
    transportPlanForEmergencies: z.boolean(),
  }),

  riskAssessment: z.object({
    identifiedRisks: z.object({
      hasRisks: z.boolean(),
      specifyRisks: z.string().optional(),
    }),
    referralToHigherFacility: z.object({
      isReferred: z.boolean(),
      reasonIfYes: z.string().optional(),
    }),
  }),

  patientMetadata: z.object({
    patientId: z.string().optional(),
    registrationDate: z.string(),
    visitType: z.enum(['first', 'follow-up']),
    visitDate: z.string(),
    riskLevel: z.enum(['high', 'medium', 'low', 'unknown']),
    nextAppointment: z.string().optional(),
    imageUrl: z.string().optional(),
    archived: z.boolean().optional(),
  }),

  additionalFields: z
    .object({
      presentation: z.enum(['cephalic', 'breech', 'transverse']).optional(),
      edema: z.enum(['none', 'mild', 'moderate', 'severe']).optional(),
      urineTests: z
        .object({
          protein: z.enum(['+', '++', '+++', '-']),
          glucose: z.enum(['+', '++', '+++', '-']),
        })
        .optional(),
      complaints: z.array(z.string()).optional(),
      interventions: z.array(z.string()).optional(),
    })
    .optional(),
})
