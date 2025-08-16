import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginScreen() {
  const { login } = useAuth()
  const [pinDigits, setPinDigits] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null)
  ]

  const pin = pinDigits.join('')

  const handleLogin = async () => {
    if (pin.length === 4) {
      const success = await login(pin)
      if (success) {
        setError('')
      } else {
        setError('Incorrect PIN. Please try again.')
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
        <View className='flex-row justify-between'>
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
              className="w-14 h-14 bg-pink-100 rounded-xl border-2 border-gray-200 text-center text-3xl font-bold text-gray-900"
              placeholder='•'
              placeholderTextColor='#9CA3AF'
              returnKeyType={idx === 3 ? 'done' : 'next'}
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
      >
        <Text className='text-white text-lg font-bold'>Login</Text>
      </TouchableOpacity>

      {/* Help Text */}
      <Text className='text-sm text-gray-500 mt-6 text-center'>
        Contact your admin if you need help with your PIN
      </Text>
    </View>
  )
}
