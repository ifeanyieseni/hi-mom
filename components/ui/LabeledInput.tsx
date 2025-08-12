import React from 'react'
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form'
import { Text, TextInput, TextInputProps, View } from 'react-native'

interface LabeledInputProps<T extends FieldValues> extends TextInputProps {
  label: string
  name: Path<T>
  control: Control<T>
  error?: FieldError
  required?: boolean
}

const LabeledInput = <T extends FieldValues>({
  label,
  name,
  control,
  error,
  required = false,
  ...rest
}: LabeledInputProps<T>) => {
  return (
    <View className='mb-4'>
      <Text className='mb-1 font-medium text-gray-700'>
        {label} {required && <Text className='text-red-500'>*</Text>}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`w-full border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded-lg px-4 py-3 bg-white`}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            {...rest}
          />
        )}
      />
      {error && (
        <Text className='mt-1 text-sm text-red-500'>{error.message}</Text>
      )}
    </View>
  )
}

export default LabeledInput
