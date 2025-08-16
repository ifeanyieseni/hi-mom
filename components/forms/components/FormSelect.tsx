import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native'
import { Controller, Control, FieldPath } from 'react-hook-form'
import { Feather } from '@expo/vector-icons'
import { PatientForm } from '@/types/patients'

interface SelectOption {
  label: string
  value: string
}

interface FormSelectProps {
  name: FieldPath<PatientForm>
  control: Control<PatientForm>
  label: string
  placeholder?: string
  options: SelectOption[]
  error?: string
  helperText?: string
  required?: boolean
  onValueChange?: (value: string) => void
  disabled?: boolean
}

export function FormSelect({
  name,
  control,
  label,
  placeholder,
  options,
  error,
  helperText,
  required = false,
  onValueChange,
  disabled = false,
}: FormSelectProps) {
  const [modalVisible, setModalVisible] = useState(false)

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
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity
              className={`border rounded-lg px-4 py-3 h-12 flex-row items-center justify-between ${
                error ? 'border-red-300 bg-red-50' : 'border-slate-300 bg-white'
              } ${disabled ? 'opacity-50' : ''}`}
              onPress={() => !disabled && setModalVisible(true)}
              disabled={disabled}
            >
              <Text
                className={`text-base ${
                  value ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {value
                  ? options.find((opt) => opt.value === value)?.label
                  : placeholder}
              </Text>
              <Feather name='chevron-down' size={20} color='#64748b' />
            </TouchableOpacity>

            <Modal
              visible={modalVisible}
              transparent
              animationType='slide'
              onRequestClose={() => setModalVisible(false)}
            >
              <View className='flex-1 justify-end bg-black/50'>
                <View className='bg-white rounded-t-xl max-h-96'>
                  <View className='px-4 py-3 border-b border-slate-200 flex-row items-center justify-between'>
                    <Text className='text-lg font-semibold text-slate-800'>
                      {label}
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Feather name='x' size={24} color='#64748b' />
                    </TouchableOpacity>
                  </View>

                  <FlatList
                    data={options}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className='px-4 py-4 border-b border-slate-100'
                        onPress={() => {
                          onChange(item.value)
                          onValueChange?.(item.value)
                          setModalVisible(false)
                        }}
                      >
                        <Text
                          className={`text-base ${
                            value === item.value
                              ? 'text-indigo-600 font-medium'
                              : 'text-slate-900'
                          }`}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </Modal>
          </>
        )}
      />

      {error && <Text className='text-red-500 text-sm mt-1'>{error}</Text>}
    </View>
  )
}
