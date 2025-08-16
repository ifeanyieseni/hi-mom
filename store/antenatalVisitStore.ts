import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'

export interface AntenatalVisitData {
  id: string
  patientId: string
  visitDate: string
  visitType: 'first' | 'follow-up'

  // I. Demographic and Contact Information
  womanFullName: string
  age: string
  villageAddress: string
  womanPhoneNumber: string
  husbandName: string
  husbandPhoneNumber: string
  womanOccupation: string
  husbandOccupation: string
  womanEducationLevel: string
  husbandEducationLevel: string
  maritalStatus: string
  emergencyContactName: string
  emergencyContactRelationship: string

  // II. Obstetric History
  totalPregnancies: string
  numberOfLiveBirths: string
  previousDeliveries: string
  previousAbortions: string
  numberOfAbortions: string
  previousStillbirths: string
  previousCesareanSections: string
  numberOfCesareanSections: string
  previousVacuumForcepsDelivery: string
  previousAPHPPH: string
  previousEclampsiaPreeclampsia: string
  previousSymphysiotomyFistulaRepair: string
  lastMenstrualPeriod: string
  estimatedDateOfDelivery: string
  birthWeightOfLastChild: string
  intervalSinceLastDelivery: string

  // III. Medical History
  hypertension: string
  diabetes: string
  asthma: string
  epilepsy: string
  kidneyRenalDisease: string
  sickleCellDisease: string
  sickleCellTrait: string
  tuberculosis: string
  heartDisease: string
  thyroidProblems: string
  chronicAnaemia: string
  bloodTransfusions: string
  hivStatus: string
  hepatitisBStatus: string
  recentMalaria: string
  otherChronicIllness: string
  otherChronicIllnessDetails: string

  // V. Laboratory Investigations
  bloodGroupRhesus: string
  haemoglobinLevel: string
  hivTestResult: string
  hivTestDate: string
  syphilisTestResult: string
  syphilisTestDate: string
  hepatitisBTestResult: string
  hepatitisBTestDate: string
  malariaTestResult: string
  malariaTestDate: string

  // VI. Delivery Plan
  plannedDeliveryPlace: string
  healthFacilityName: string
  otherDeliveryPlace: string
  transportPlanForEmergencies: string

  // VII. Risk Assessment
  identifiedRisks: string
  specifiedRisks: string
  referralToHigherLevel: string
  referralReason: string

  // Current Pregnancy Details (for tracking)
  currentGestationWeeks: string
  bloodPressure: string
  weight: string
  fundalHeight: string
  fetalHeartRate: string
  fetalMovement: string
  urineTest: string
  notes: string

  createdAt: string
  updatedAt: string
}

interface AntenatalVisitStore {
  visits: AntenatalVisitData[]
  currentVisit: AntenatalVisitData | null
  isLoading: boolean

  // Actions
  addVisit: (
    visit: Omit<AntenatalVisitData, 'id' | 'createdAt' | 'updatedAt'>
  ) => void
  updateVisit: (id: string, updates: Partial<AntenatalVisitData>) => void
  deleteVisit: (id: string) => void
  getVisitsByPatient: (patientId: string) => AntenatalVisitData[]
  cleanupOrphanedVisits: (existingPatientIds: string[]) => void
  getVisitById: (id: string) => AntenatalVisitData | undefined
  setCurrentVisit: (visit: AntenatalVisitData | null) => void
  clearVisits: () => Promise<void>

  loadVisits: () => Promise<void>
  removeDuplicateVisits: () => void
}

export const useAntenatalVisitStore = create<AntenatalVisitStore>(
  (set, get) => ({
    visits: [],
    currentVisit: null,
    isLoading: false,

    addVisit: (visitData) => {
      const newVisit: AntenatalVisitData = {
        ...visitData,
        id: `visit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Check for duplicate visits before adding
      const existingVisit = get().visits.find(
        (visit) =>
          visit.patientId === newVisit.patientId &&
          visit.visitDate === newVisit.visitDate &&
          visit.visitType === newVisit.visitType &&
          visit.womanFullName === newVisit.womanFullName
      )

      if (existingVisit) {
        console.warn(
          `Duplicate visit found for ${newVisit.womanFullName} on ${newVisit.visitDate}, skipping`
        )
        return
      }

      set((state) => ({
        visits: [...state.visits, newVisit],
        currentVisit: newVisit,
      }))

      // Save to AsyncStorage
      try {
        const updatedVisits = [...get().visits, newVisit]
        AsyncStorage.setItem(
          'antenatal-visits-storage',
          JSON.stringify(updatedVisits)
        )
      } catch (error) {
        console.error('Error saving visit to AsyncStorage:', error)
      }
    },
    updateVisit: (id, updates) => {
      set((state) => ({
        visits: state.visits.map((visit) =>
          visit.id === id
            ? { ...visit, ...updates, updatedAt: new Date().toISOString() }
            : visit
        ),
        currentVisit:
          state.currentVisit?.id === id
            ? {
                ...state.currentVisit,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : state.currentVisit,
      }))

      // Save to AsyncStorage
      try {
        const updatedVisits = get().visits.map((visit) =>
          visit.id === id
            ? { ...visit, ...updates, updatedAt: new Date().toISOString() }
            : visit
        )
        AsyncStorage.setItem(
          'antenatal-visits-storage',
          JSON.stringify(updatedVisits)
        )
      } catch (error) {
        console.error('Error updating visit in AsyncStorage:', error)
      }
    },

    deleteVisit: (id) => {
      set((state) => ({
        visits: state.visits.filter((visit) => visit.id !== id),
        currentVisit: state.currentVisit?.id === id ? null : state.currentVisit,
      }))

      // Save to AsyncStorage
      try {
        const updatedVisits = get().visits.filter((visit) => visit.id !== id)
        AsyncStorage.setItem(
          'antenatal-visits-storage',
          JSON.stringify(updatedVisits)
        )
      } catch (error) {
        console.error('Error deleting visit from AsyncStorage:', error)
      }
    },

    getVisitsByPatient: (patientId) => {
      return get().visits.filter((visit) => visit.patientId === patientId)
    },

    // Clean up orphaned visits (visits that reference non-existent patients)
    cleanupOrphanedVisits: (existingPatientIds: string[]) => {
      const currentVisits = get().visits
      const orphanedVisits = currentVisits.filter(
        (visit) =>
          visit.patientId && !existingPatientIds.includes(visit.patientId)
      )

      if (orphanedVisits.length > 0) {
        console.warn(
          `Found ${orphanedVisits.length} orphaned visits, removing them`
        )
        const validVisits = currentVisits.filter(
          (visit) =>
            !visit.patientId || existingPatientIds.includes(visit.patientId)
        )
        set({ visits: validVisits })

        // Update AsyncStorage
        try {
          AsyncStorage.setItem(
            'antenatal-visits-storage',
            JSON.stringify(validVisits)
          )
        } catch (error) {
          console.error('Error saving cleaned visits to AsyncStorage:', error)
        }
      }
    },

    getVisitById: (id) => {
      return get().visits.find((visit) => visit.id === id)
    },

    setCurrentVisit: (visit) => {
      set({ currentVisit: visit })
    },

    clearVisits: async () => {
      try {
        await AsyncStorage.removeItem('antenatal-visits-storage')
        set({ visits: [], currentVisit: null })
      } catch (error) {
        console.error('Error clearing visits from AsyncStorage:', error)
        // Still clear the state even if AsyncStorage fails
        set({ visits: [], currentVisit: null })
      }
    },

    loadVisits: async () => {
      try {
        const data = await AsyncStorage.getItem('antenatal-visits-storage')
        if (data) {
          const visits = JSON.parse(data)
          set({ visits })
          console.log('Loaded visits from AsyncStorage:', visits.length)

          // Remove duplicates after loading
          get().removeDuplicateVisits()
        } else {
          console.log(
            'No visits found in AsyncStorage, starting with empty array'
          )
          set({ visits: [] })
        }
      } catch (error) {
        console.error('Error loading visits from AsyncStorage:', error)
        // Fallback to empty array if loading fails
        set({ visits: [] })
      }
    },

    removeDuplicateVisits: () => {
      const currentVisits = get().visits
      const uniqueVisits = currentVisits.reduce((acc, visit) => {
        // Check for duplicates based on patientId, visitDate, and visitType
        const isDuplicate = acc.some(
          (existingVisit) =>
            existingVisit.patientId === visit.patientId &&
            existingVisit.visitDate === visit.visitDate &&
            existingVisit.visitType === visit.visitType &&
            existingVisit.womanFullName === visit.womanFullName
        )

        if (!isDuplicate) {
          acc.push(visit)
        } else {
          console.warn(
            `Removing duplicate visit for ${visit.womanFullName} on ${visit.visitDate}`
          )
        }

        return acc
      }, [] as AntenatalVisitData[])

      if (uniqueVisits.length !== currentVisits.length) {
        console.log(
          `Removed ${currentVisits.length - uniqueVisits.length} duplicate visits`
        )
        set({ visits: uniqueVisits })

        // Update AsyncStorage
        try {
          AsyncStorage.setItem(
            'antenatal-visits-storage',
            JSON.stringify(uniqueVisits)
          )
        } catch (error) {
          console.error('Error saving cleaned visits to AsyncStorage:', error)
        }
      }
    },
  })
)
