import React from 'react'
import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import { router } from 'expo-router'
import { QuickShortcutsSectionProps, ShortcutItem } from '@/types/dashboard'
import { Search, Calendar, Phone, RefreshCw } from 'lucide-react-native'
import * as Haptics from 'expo-haptics'

interface ShortcutButtonProps {
  shortcut: ShortcutItem
  onPress: () => void
}

const ShortcutButton: React.FC<ShortcutButtonProps> = ({
  shortcut,
  onPress,
}) => {
  const handlePress = async () => {
    // Provide haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }

  return (
    <Pressable
      onPress={handlePress}
      className={`${shortcut.color} rounded-2xl p-4 flex-row items-center shadow-lg flex-1 mx-1 mb-3`}
      accessibilityRole='button'
      accessibilityLabel={shortcut.title}
      accessibilityHint={`Navigate to ${shortcut.title.toLowerCase()}`}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.96 : 1 }],
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View className='w-12 h-12 bg-white/20 rounded-xl items-center justify-center mr-3'>
        <shortcut.icon size={24} color='white' />
      </View>
      <Text className='text-white text-base font-semibold flex-1'>
        {shortcut.title}
      </Text>
    </Pressable>
  )
}

export const QuickShortcutsSection: React.FC<QuickShortcutsSectionProps> = ({
  shortcuts,
}) => {
  const handleShortcutPress = (shortcut: ShortcutItem) => {
    try {
      switch (shortcut.id) {
        case 'find-patient':
          // Navigate to patients tab and activate search
          router.push('/(tabs)/patients')
          break
        case 'view-schedule':
          // Navigate to schedule view (appointments screen for now)
          router.push('/appointments')
          break
        case 'emergency':
          router.push('/emergency')
          break
        case 'sync':
          router.push('/sync')
          break
        default:
          // Fallback to route if provided
          if (shortcut.route) {
            router.push(shortcut.route as any)
          }
      }
    } catch (error) {
      console.error('Navigation error:', error)
      // Could show a toast or alert here
    }
  }

  // Default shortcuts if none provided
  const defaultShortcuts: ShortcutItem[] = [
    {
      id: 'find-patient',
      title: 'Find Patient',
      icon: Search,
      route: '/(tabs)/patients',
      color: 'bg-blue-500',
    },
    {
      id: 'view-schedule',
      title: 'View Schedule',
      icon: Calendar,
      route: '/appointments',
      color: 'bg-green-500',
    },
    {
      id: 'emergency',
      title: 'Emergency',
      icon: Phone,
      route: '/emergency',
      color: 'bg-red-500',
    },
    {
      id: 'sync',
      title: 'Data Sync',
      icon: RefreshCw,
      route: '/sync',
      color: 'bg-purple-500',
    },
  ]

  const displayShortcuts = shortcuts.length > 0 ? shortcuts : defaultShortcuts

  return (
    <View className='mb-6'>
      <Text className='text-xl font-bold text-gray-900 mb-4'>
        Quick Actions
      </Text>
      <View className='flex-row flex-wrap -mx-1'>
        {displayShortcuts.map((shortcut) => (
          <View key={shortcut.id} className='w-1/2'>
            <ShortcutButton
              shortcut={shortcut}
              onPress={() => handleShortcutPress(shortcut)}
            />
          </View>
        ))}
      </View>
    </View>
  )
}
