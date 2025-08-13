import AsyncStorage from '@react-native-async-storage/async-storage'

export async function clearAppStorage() {
  try {
    console.log('Clearing app storage...')

    // Clear all stored data
    await AsyncStorage.clear()

    console.log('✅ App storage cleared successfully')
    console.log('You can now test the full authentication flow:')
    console.log('1. Splash Screen')
    console.log('2. Welcome Screen')
    console.log('3. Login Screen (PIN: 1234)')
    console.log('4. Main App')
  } catch (error) {
    console.error('❌ Error clearing storage:', error)
  }
}

// For direct execution
if (require.main === module) {
  clearAppStorage()
}
