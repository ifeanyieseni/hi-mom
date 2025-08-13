import { router } from 'expo-router'
import { Globe, Wifi, WifiOff } from 'lucide-react-native'
import { useRef, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginScreen() {
  const [pinDigits, setPinDigits] = useState(['', '', '', ''])
  const [isOnline, setIsOnline] = useState(true)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ]

  const pin = pinDigits.join('')

  const handleLogin = async () => {
    if (pin.length === 4) {
      const success = await login(pin)
      if (!success) {
        setError('Incorrect PIN. Please try again.')
        setPinDigits(['', '', '', ''])
        inputRefs[0].current?.focus()
      }
    } else {
      setError('Please enter a 4-digit PIN')
    }
  }

  const handlePinChange = (value: string, idx: number) => {
    if (/^\d?$/.test(value)) {
      const newDigits = [...pinDigits]
      newDigits[idx] = value
      setPinDigits(newDigits)
      if (value && idx < 3) {
        inputRefs[idx + 1].current?.focus()
      }
      if (!value && idx > 0) {
        inputRefs[idx - 1].current?.focus()
      }
    }
  }

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !pinDigits[idx] && idx > 0) {
      inputRefs[idx - 1].current?.focus()
    }
  }

  return (
    <View className='flex-1 bg-gray-50 justify-center items-center px-6'>
      {/* Header */}
      <View className='absolute top-12 left-0 right-0 flex-row justify-between items-center px-6'>
        <View className='flex-row items-center'>
          {isOnline ? (
            <Wifi size={20} color='#2B7A78' />
          ) : (
            <WifiOff size={20} color='#EF4444' />
          )}
          <Text className='ml-2 text-sm text-gray-600'>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/language')}
          className='flex-row items-center bg-white px-3 py-2 rounded-lg shadow-sm'
          accessible={true}
          accessibilityRole='button'
          accessibilityLabel='Change language'
        >
          <Globe size={18} color='#2B7A78' />
          <Text className='ml-2 text-sm text-gray-700'>EN</Text>
        </TouchableOpacity>
      </View>

      {/* Logo and Title */}
      <View className='items-center mb-12'>
        <View className='w-24 h-24 bg-primary-500 rounded-full items-center justify-center mb-6'>
          <Text className='text-white text-3xl font-bold'>Hi</Text>
        </View>
        <Text className='text-3xl font-bold text-gray-800 mb-2'>HiMom</Text>
        <Text className='text-lg text-gray-600'>Maternal Health Worker</Text>
      </View>

      {/* PIN Input */}
      <View className='w-full max-w-xs mb-2'>
        <Text className='text-lg font-semibold text-gray-700 mb-4 text-center'>
          Enter Your PIN
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {pinDigits.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={inputRefs[idx]}
              value={digit}
              onChangeText={(value) => handlePinChange(value, idx)}
              onKeyPress={(e) => handleKeyPress(e, idx)}
              keyboardType='numeric'
              maxLength={1}
              secureTextEntry
              className='w-12 h-14 bg-white rounded-xl border-2 border-gray-200 text-center text-3xl font-bold text-gray-900'
              placeholder='•'
              placeholderTextColor='#9CA3AF'
              returnKeyType={idx === 3 ? 'done' : 'next'}
              accessible={true}
              accessibilityRole='text'
              accessibilityLabel={`PIN digit ${idx + 1}`}
              accessibilityHint='Enter a single digit for your PIN'
            />
          ))}
        </View>
      </View>
      {/* Error Message */}
      {error ? (
        <Text className='text-center text-red-500 mb-2'>{error}</Text>
      ) : null}
      {/* PIN Hint */}
      {/* TODO: Remove hardcoded PIN hint in production */}
      <Text className='text-center text-gray-400 mb-6'>Hint: 1234</Text>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        className='w-full max-w-xs h-14 bg-primary-500 rounded-xl items-center justify-center shadow-lg'
        disabled={pin.length !== 4}
        accessible={true}
        accessibilityRole='button'
        accessibilityLabel='Login with PIN'
        accessibilityHint='Tap to login with your 4-digit PIN'
        accessibilityState={{ disabled: pin.length !== 4 }}
      >
        <Text className='text-white text-lg font-bold'>Login</Text>
      </TouchableOpacity>

      {/* Help Text */}
      <Text className='text-sm text-gray-500 mt-6 text-center'>
        Contact your supervisor if you need help with your PIN
      </Text>
    </View>
  )
}
