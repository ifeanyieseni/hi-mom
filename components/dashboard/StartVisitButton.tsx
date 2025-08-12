import React from 'react'
import { TouchableOpacity, Text, View, Pressable } from 'react-native'
import { router } from 'expo-router'
import { StartVisitButtonProps } from '@/types/dashboard'
import { UserPlus } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'

export const StartVisitButton: React.FC<StartVisitButtonProps> = ({
  onPress,
  disabled = false,
}) => {
  const handlePress = async () => {
    if (disabled) return

    try {
      // Provide haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

      // Call the provided onPress handler or default navigation
      if (onPress) {
        onPress()
      } else {
        router.push('/visit/new-visit')
      }
    } catch (error) {
      console.error('Navigation error:', error)
      // Could show a toast or alert here
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={`rounded-2xl p-6 shadow-lg mb-6 ${
        disabled ? 'bg-gray-300' : 'bg-primary-500 active:bg-primary-600'
      }`}
      accessibilityRole='button'
      accessibilityLabel='Start new patient visit'
      accessibilityHint='Navigates to the visit flow to begin a new patient visit'
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
          opacity: pressed && !disabled ? 0.9 : 1,
        },
      ]}
    >
      <View className='flex-row items-center justify-center'>
        <View
          className={`w-14 h-14 rounded-xl items-center justify-center mr-4 ${
            disabled ? 'bg-white/30' : 'bg-white/20'
          }`}
        >
          <UserPlus size={28} color={disabled ? '#9CA3AF' : 'white'} />
        </View>
        <View className='flex-1'>
          <Text
            className={`text-xl font-bold ${
              disabled ? 'text-gray-500' : 'text-white'
            }`}
          >
            Start Visit
          </Text>
          <Text
            className={`text-sm ${
              disabled ? 'text-gray-400' : 'text-white/80'
            }`}
          >
            Begin a new patient visit
          </Text>
        </View>
      </View>
    </Pressable>
  )
}
