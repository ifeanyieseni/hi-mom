import AsyncStorage from '@react-native-async-storage/async-storage'

export const clearAllData = async () => {
  try {
    // Clear patients data
    await AsyncStorage.removeItem('patients')
    
    // Clear antenatal visits data
    await AsyncStorage.removeItem('antenatal-visits-storage')
    
    console.log('All data cleared successfully')
  } catch (error) {
    console.error('Error clearing data:', error)
  }
}