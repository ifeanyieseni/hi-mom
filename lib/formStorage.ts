import { PatientForm } from '@/types/patients'
import AsyncStorage from '@react-native-async-storage/async-storage'

const FORM_STORAGE_KEY = 'patient_registration_form_data'
const PENDING_PATIENTS_KEY = 'pending_patients'

/**
 * Save form data to local storage
 */
export const saveFormData = async (
  formData: PatientForm
): Promise<void> => {
  try {
    await AsyncStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData))
  } catch (error) {
    console.error('Error saving form data:', error)
  }
}

/**
 * Load form data from local storage
 */
export const loadFormData =
  async (): Promise<PatientForm | null> => {
    try {
      const data = await AsyncStorage.getItem(FORM_STORAGE_KEY)
      if (data) {
        return JSON.parse(data)
      }
      return null
    } catch (error) {
      console.error('Error loading form data:', error)
      return null
    }
  }

/**
 * Clear form data from local storage
 */
export const clearFormData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FORM_STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing form data:', error)
  }
}

/**
 * Save pending patient to local storage
 */
export const savePendingPatient = async (patient: any): Promise<void> => {
  try {
    const pendingPatientsStr = await AsyncStorage.getItem(PENDING_PATIENTS_KEY)
    const pendingPatients = pendingPatientsStr
      ? JSON.parse(pendingPatientsStr)
      : []
    pendingPatients.push({
      patient,
      timestamp: new Date().toISOString(),
    })
    await AsyncStorage.setItem(
      PENDING_PATIENTS_KEY,
      JSON.stringify(pendingPatients)
    )
  } catch (error) {
    console.error('Error saving pending patient:', error)
  }
}

/**
 * Get all pending patients from local storage
 */
export const getPendingPatients = async (): Promise<
  Array<{ patient: any; timestamp: string }>
> => {
  try {
    const pendingPatientsStr = await AsyncStorage.getItem(PENDING_PATIENTS_KEY)
    return pendingPatientsStr ? JSON.parse(pendingPatientsStr) : []
  } catch (error) {
    console.error('Error getting pending patients:', error)
    return []
  }
}

/**
 * Remove a pending patient from local storage
 */
export const removePendingPatient = async (
  patientId: string
): Promise<void> => {
  try {
    const pendingPatientsStr = await AsyncStorage.getItem(PENDING_PATIENTS_KEY)
    if (pendingPatientsStr) {
      const pendingPatients = JSON.parse(pendingPatientsStr)
      const updatedPendingPatients = pendingPatients.filter(
        (item: { patient: any }) => item.patient.id !== patientId
      )
      await AsyncStorage.setItem(
        PENDING_PATIENTS_KEY,
        JSON.stringify(updatedPendingPatients)
      )
    }
  } catch (error) {
    console.error('Error removing pending patient:', error)
  }
}
