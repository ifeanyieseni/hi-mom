import { ChevronDown } from 'lucide-react-native'
import React, { useState } from 'react'
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
} from 'react-hook-form'
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

interface DropdownProps<T extends FieldValues> {
  label: string
  name: Path<T>
  control: Control<T>
  options: string[]
  error?: FieldError
  required?: boolean
  placeholder?: string
  searchable?: boolean
}

const Dropdown = <T extends FieldValues>({
  label,
  name,
  control,
  options,
  error,
  required = false,
  placeholder = 'Select an option',
  searchable = false,
}: DropdownProps<T>) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  return (
    <View className='mb-4'>
      <Text className='mb-1 font-medium text-gray-700'>
        {label} {required && <Text className='text-red-500'>*</Text>}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity
              className={`w-full border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-lg px-4 py-3 bg-white flex-row justify-between items-center`}
              onPress={() => setModalVisible(true)}
            >
              <Text className={value ? 'text-gray-800' : 'text-gray-400'}>
                {value || placeholder}
              </Text>
              <ChevronDown size={20} color='#6b7280' />
            </TouchableOpacity>

            <Modal
              animationType='slide'
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <Pressable
                className='flex-1 bg-black/50'
                onPress={() => setModalVisible(false)}
              >
                <View className='mt-auto bg-white rounded-t-xl overflow-hidden'>
                  <View className='p-4 border-b border-gray-200'>
                    <Text className='text-lg font-semibold text-center'>
                      Select {label}
                    </Text>
                    {searchable && (
                      <TextInput
                        className='mt-2 border border-gray-300 rounded-lg px-4 py-2'
                        placeholder='Search...'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                      />
                    )}
                  </View>
                  <FlatList
                    data={filteredOptions}
                    keyExtractor={(item) => item}
                    style={{ maxHeight: 300 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        className={`p-4 border-b border-gray-100 ${
                          value === item ? 'bg-primary-50' : ''
                        }`}
                        onPress={() => {
                          onChange(item)
                          setModalVisible(false)
                          setSearchQuery('')
                        }}
                      >
                        <Text
                          className={`${
                            value === item
                              ? 'text-primary-600 font-medium'
                              : 'text-gray-800'
                          }`}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity
                    className='p-4 bg-gray-100'
                    onPress={() => {
                      setModalVisible(false)
                      setSearchQuery('')
                    }}
                  >
                    <Text className='text-center font-medium text-gray-700'>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Modal>
          </>
        )}
      />
      {error && (
        <Text className='mt-1 text-sm text-red-500'>{error.message}</Text>
      )}
    </View>
  )
}

export default Dropdown
