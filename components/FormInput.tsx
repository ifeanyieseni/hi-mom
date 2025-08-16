import React from 'react'
import { Control, Controller, FieldError } from 'react-hook-form'
import { Text, TextInput, TextInputProps, View } from 'react-native'

interface FormInputProps extends TextInputProps {
  label: string
  name: string
  control: Control<any>
  error?: FieldError
  containerClassName?: string
}

export function FormInput({
  label,
  name,
  control,
  error,
  containerClassName = '',
  ...props
}: FormInputProps) {
  const isMultiline = props.multiline
  return (
    <View className={containerClassName}>
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`w-full p-4 bg-gray-50 rounded-xl border ${
              error ? 'border-red-500' : 'border-gray-200'
            } ${isMultiline ? 'h-24' : ''}`}
            placeholderTextColor="#9CA3AF"
            textAlignVertical={isMultiline ? 'top' : 'center'}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            {...props}
          />
        )}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
      )}
    </View>
  )
}

// Keep the old component for backward compatibility
export default function FormInputLegacy({
  label,
  containerClassName = '',
  ...props
}: Omit<FormInputProps, 'name' | 'control' | 'error'>) {
  const isMultiline = props.multiline
  return (
    <View className={containerClassName}>
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <TextInput
        className={`w-full p-4 bg-gray-50 rounded-xl border border-gray-200 ${
          isMultiline ? 'h-24' : ''
        }`}
        placeholderTextColor="#9CA3AF"
        textAlignVertical={isMultiline ? 'top' : 'center'}
        {...props}
      />
    </View>
  )
}