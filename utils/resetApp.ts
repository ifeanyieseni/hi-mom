import { usePatientStore } from '@/store/patientStore'
import { useAntenatalVisitStore } from '@/store/antenatalVisitStore'

export const resetAllData = async () => {
  try {
    const patientStore = usePatientStore.getState()
    const visitStore = useAntenatalVisitStore.getState()

    // Clear all stores
    await Promise.all([
      patientStore.clearPatients(),
      visitStore.clearVisits()
    ])

    console.log('All app data has been reset successfully')
  } catch (error) {
    console.error('Error resetting app data:', error)
    throw error
  }
}