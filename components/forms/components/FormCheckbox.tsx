import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Controller, Control, FieldPath } from 'react-hook-form'
import { Feather } from '@expo/vector-icons'
import { PatientForm } from '@/types/patients'

interface FormCheckboxProps {
  name: FieldPath<PatientForm>
  control: Control<PatientForm>
  label: string
  error?: string
  disabled?: boolean
}

export function FormCheckbox({
  name,
  control,
  label,
  error,
  disabled = false,
}: FormCheckboxProps) {
  return (
    <View className='mb-4'>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity
            className={`flex-row items-center py-3 px-4 rounded-lg border ${
              error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
            } ${disabled ? 'opacity-50' : ''}`}
            onPress={() => !disabled && onChange(!value)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <View
              className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                value
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'bg-white border-slate-300'
              }`}
            >
              {value && <Feather name='check' size={14} color='white' />}
            </View>

            <Text
              className={`flex-1 text-base ${
                disabled ? 'text-slate-400' : 'text-slate-900'
              }`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {error && <Text className='text-red-500 text-sm mt-1'>{error}</Text>}
    </View>
  )
}
