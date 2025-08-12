import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import { Controller, Control, FieldPath } from 'react-hook-form'
import { Feather } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { PatientForm } from '@/types/patients'

interface FormDatePickerProps {
  name: FieldPath<PatientForm>
  control: Control<PatientForm>
  label: string
  placeholder?: string
  error?: string
  required?: boolean
  mode?: 'date' | 'time' | 'datetime'
  maximumDate?: Date
  minimumDate?: Date
}

export function FormDatePicker({
  name,
  control,
  label,
  placeholder,
  error,
  required = false,
  mode = 'date',
  maximumDate,
  minimumDate,
}: FormDatePickerProps) {
  const [showPicker, setShowPicker] = useState(false)

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return ''
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const isValidDateValue = (value: any): value is string | Date | undefined => {
    return (
      value === undefined ||
      value === null ||
      typeof value === 'string' ||
      value instanceof Date
    )
  }

  return (
    <View className='mb-4'>
      <Text className='text-sm font-medium text-slate-700 mb-2'>
        {label}
        {required && <Text className='text-red-500'> *</Text>}
      </Text>

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity
              className={`border rounded-lg px-4 py-3 h-12 flex-row items-center justify-between ${
                error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
              }`}
              onPress={() => setShowPicker(true)}
            >
              <Text
                className={`text-base ${
                  value ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {value && isValidDateValue(value)
                  ? formatDate(value)
                  : placeholder}
              </Text>
              <Feather name='calendar' size={20} color='#64748b' />
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={
                  value && isValidDateValue(value) && value
                    ? new Date(value)
                    : new Date()
                }
                mode={mode}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onChange={(event, selectedDate) => {
                  setShowPicker(Platform.OS === 'ios')
                  if (selectedDate) {
                    onChange(selectedDate.toISOString())
                  }
                }}
                onTouchCancel={() => setShowPicker(false)}
              />
            )}
          </>
        )}
      />

      {error && <Text className='text-red-500 text-sm mt-1'>{error}</Text>}
    </View>
  )
}
