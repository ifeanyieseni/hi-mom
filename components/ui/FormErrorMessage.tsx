import { AlertCircle } from 'lucide-react-native'
import React from 'react'
import { Text, View } from 'react-native'

interface FormErrorMessageProps {
  message: string
}

const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ message }) => {
  if (!message) return null

  return (
    <View className='flex-row items-center mt-1'>
      <AlertCircle size={16} color='#ef4444' />
      <Text className='ml-1 text-sm text-red-500'>{message}</Text>
    </View>
  )
}

export default FormErrorMessage
