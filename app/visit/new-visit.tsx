import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg'

const NewVisitScreen = () => {
  const router = useRouter()

  const handleFirstVisit = () => {
    // For first visit, go to the combined registration and first visit form
    // This handles both patient registration and first antenatal visit in one flow
    router.push('/visit/form?type=first')
  }

  const handleFollowUpVisit = () => {
    // For follow-up visit, go to patient search first
    // After patient selection, it will navigate to the unified form system
    router.push('/patient/search?returnTo=followUpVisit')
  }

  return (
    <View className='flex-1 bg-slate-50'>
      <View className='flex-1 justify-center px-6'>
        {/* Pregnancy Icon */}
        <View className='items-center mb-6'>
          <Svg width={80} height={80} viewBox='0 0 24 24' fill='none'>
            <Circle
              cx='12'
              cy='12'
              r='10'
              stroke='#6366f1'
              strokeWidth='2'
              fill='none'
            />
            <Path
              d='M12 6C10.9 6 10 6.9 10 8C10 9.1 10.9 10 12 10C13.1 10 14 9.1 14 8C14 6.9 13.1 6 12 6ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16ZM12 11C10.9 11 10 11.9 10 13C10 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13C14 11.9 13.1 11 12 11Z'
              fill='#6366f1'
            />
          </Svg>
        </View>

        <Text className='text-center text-base text-slate-500 mb-10'>
          Is this the first visit this pregnancy?
        </Text>

        <View className='w-full items-center'>
          {/* First Visit */}
          <TouchableOpacity
            className='w-full h-16 mb-4 rounded-xl overflow-hidden shadow'
            onPress={handleFirstVisit}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6366f1', '#4f46e5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className='flex-1 justify-center items-center rounded-xl'
            >
              <View className='flex-row items-center justify-center px-4'>
                <Feather name='user-plus' size={24} color='#fff' />
                <Text className='text-white text-base font-semibold ml-3'>
                  Yes - First Visit
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Follow-up Visit */}
          <TouchableOpacity
            className='w-full h-16 mb-4 rounded-xl bg-white border border-slate-200 shadow'
            onPress={handleFollowUpVisit}
            activeOpacity={0.8}
          >
            <View className='flex-1 justify-center items-center'>
              <View className='flex-row items-center justify-center px-4'>
                <Feather name='users' size={24} color='#4f46e5' />
                <Text className='text-base font-semibold ml-3 text-indigo-700'>
                  No - Follow-up Visit
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default NewVisitScreen
