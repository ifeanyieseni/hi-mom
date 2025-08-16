import React from 'react'
import { View, Text, TextInput, KeyboardTypeOptions } from 'react-native'
import { Controller, Control, FieldPath } from 'react-hook-form'
import { PatientForm } from '@/types/patients'

interface FormFieldProps {
  name: FieldPath<PatientForm>
  control: Control<PatientForm>
  label: string
  placeholder?: string
  keyboardType?: KeyboardTypeOptions
  multiline?: boolean
  numberOfLines?: number
  error?: string
  helperText?: string
  required?: boolean
}

export function FormField({
  name,
  control,
  label,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  helperText,
  required = false,
}: FormFieldProps) {
  return (
    <View className='mb-4'>
      <Text className='text-sm font-medium text-slate-700 mb-2'>
        {label}
        {required && <Text className='text-red-500'> *</Text>}
      </Text>

      {helperText && (
        <Text className='text-xs text-slate-500 mb-2 leading-4'>
          {helperText}
        </Text>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`border rounded-lg px-4 py-3 text-base ${
              error ? 'border-red-500' : 'border-slate-300'
            } ${multiline ? 'h-20' : 'h-12'}`}
            placeholder={placeholder}
            placeholderTextColor='#94a3b8'
            value={value?.toString() ?? ''}
            onChangeText={(text) => {
              // Handle numeric inputs properly
              if (keyboardType === 'numeric' || keyboardType === 'number-pad') {
                // Convert string to number for numeric fields
                if (text === '') {
                  onChange(undefined)
                } else {
                  const numValue = Number(text)
                  if (!isNaN(numValue)) {
                    onChange(numValue)
                  } else {
                    onChange(undefined)
                  }
                }
              } else {
                onChange(text)
              }
            }}
            onBlur={onBlur}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={multiline ? 'top' : 'center'}
          />
        )}
      />

      {error && <Text className='text-red-500 text-sm mt-1'>{error}</Text>}
    </View>
  )
}
