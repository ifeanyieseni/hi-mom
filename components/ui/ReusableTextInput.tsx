import React, { useState } from 'react'
import { TextInput, TextInputProps } from 'react-native'

const ReusableTextInput = ({
  error,
  style,
  ...props
}: TextInputProps & { error?: boolean }) => {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <TextInput
      style={[
        {
          height: 48,
          borderColor: error
            ? '#FDECEA' // error-50 from tailwind.config.js
            : isFocused
              ? '#052871' // primary-500
              : '#D1D5DB',
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 8,
          marginBottom: 12,
          backgroundColor: 'white',
        },
        style,
      ]}
      placeholderTextColor='#9CA3AF'
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    />
  )
}

export default ReusableTextInput
