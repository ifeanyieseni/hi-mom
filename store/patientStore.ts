import { Patient } from '@/types/patients'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'

// Re-export Patient type for convenience
export type { Patient } from '@/types/patients'

interface PatientState {
  patients: any[]
  addPatient: (patient: Patient) => Promise<void>
  updatePatient: (patient: Patient) => Promise<void>
  deletePatient: (id: string) => Promise<void>
  loadPatients: () => Promise<void>
  findPatientByPhone: (phoneNumber: string) => Patient | undefined
  clearPatients: () => Promise<void>
}

const PATIENTS_KEY = 'patients'

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  addPatient: async (patient) => {
    try {
      const patients = [...get().patients, patient]
      set({ patients })
      await AsyncStorage.setItem(PATIENTS_KEY, JSON.stringify(patients))
    } catch (error) {
      console.error('Error saving patient to AsyncStorage:', error)
      // Still update the state even if AsyncStorage fails
      const patients = [...get().patients, patient]
      set({ patients })
    }
  },
  updatePatient: async (updatedPatient) => {
    try {
      const patients = get().patients.map((p) =>
        p.id === updatedPatient.id ? updatedPatient : p
      )
      set({ patients })
      await AsyncStorage.setItem(PATIENTS_KEY, JSON.stringify(patients))
    } catch (error) {
      console.error('Error updating patient in AsyncStorage:', error)
      // Still update the state even if AsyncStorage fails
      const patients = get().patients.map((p) =>
        p.id === updatedPatient.id ? updatedPatient : p
      )
      set({ patients })
    }
  },
  deletePatient: async (id) => {
    try {
      const patients = get().patients.filter((p) => p.id !== id)
      set({ patients })
      await AsyncStorage.setItem(PATIENTS_KEY, JSON.stringify(patients))
    } catch (error) {
      console.error('Error deleting patient from AsyncStorage:', error)
      // Still update the state even if AsyncStorage fails
      const patients = get().patients.filter((p) => p.id !== id)
      set({ patients })
    }
  },
  loadPatients: async () => {
    try {
      const data = await AsyncStorage.getItem(PATIENTS_KEY)
      if (data) {
        set({ patients: JSON.parse(data) })
      } else {
        set({ patients: [] })
      }
    } catch (error) {
      console.error('Error loading patients from AsyncStorage:', error)
      // Start with empty array if AsyncStorage fails
      set({ patients: [] })
    }
  },
  findPatientByPhone: (phoneNumber: string) => {
    const patients = get().patients
    return patients.find((patient) => patient.phoneNumber === phoneNumber)
  },
  clearPatients: async () => {
    try {
      await AsyncStorage.removeItem(PATIENTS_KEY)
      set({ patients: [] })
    } catch (error) {
      console.error('Error clearing patients:', error)
      // Still clear the state even if AsyncStorage fails
      set({ patients: [] })
    }
  },
}))
