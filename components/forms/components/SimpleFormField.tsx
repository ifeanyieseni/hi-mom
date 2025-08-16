import React from 'react'
import { View, Text, TextInput, KeyboardTypeOptions } from 'react-native'

interface SimpleFormFieldProps {
  label: string
  value: string
  onChangeText: (value: string) => void
  placeholder?: string
  keyboardType?: KeyboardTypeOptions
  multiline?: boolean
  numberOfLines?: number
  required?: boolean
}

export function SimpleFormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  required = false,
}: SimpleFormFieldProps) {
  return (
    <View className='mb-4'>
      <Text className='text-sm font-medium text-slate-700 mb-2'>
        {label}
        {required && <Text className='text-red-500'> *</Text>}
      </Text>

      <TextInput
        className={`border rounded-lg px-4 py-3 text-base border-slate-300 ${
          multiline ? 'h-20' : 'h-12'
        }`}
        placeholder={placeholder}
        placeholderTextColor='#94a3b8'
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  )
}
