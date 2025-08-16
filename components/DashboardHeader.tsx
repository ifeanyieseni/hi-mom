import { useRouter } from 'expo-router'
import { CloudCheck } from 'lucide-react-native'

import { Image, Text, TouchableOpacity, View } from 'react-native'

type DashboardHeaderProps = {
  userName: string
  avatarUrl?: string
  unreadCount?: number
  onNotificationPress?: () => void
}

export function DashboardHeader({
  userName,
  avatarUrl,
  unreadCount = 0,
  onNotificationPress,
}: DashboardHeaderProps) {
  const router = useRouter()

  return (
    <View className='flex-row justify-between items-center px-4 py-4 bg-white'>
      {/* Left side: Avatar + Name */}
      <View className='flex-row items-center'>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Image
            source={{
              uri:
                avatarUrl ||
                'https://ui-avatars.com/api/?name=User&background=0A6EBD&color=fff',
            }}
            className='w-10 h-10 rounded-full mr-3 bg-gray-200'
          />
        </TouchableOpacity>
        <View>
          {/* <Text className='font-roboto-medium text-sm text-gray-500'>
            Welcome back
          </Text> */}
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Text className='font-roboto-bold text-lg text-gray-800'>
              {userName}
            </Text>
          </TouchableOpacity>
          <Text className='text-sm text-gray-500 '>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>

      {/* Right side: Cloud status, online, last sync */}
      <View className='items-end'>
        <View className='flex-row items-center mb-1'>
          <CloudCheck size={18} color='#10B981' />
          <Text className='ml-1 text-green-500 font-medium'>Online</Text>
        </View>
        <Text className='text-xs text-gray-400'>Last sync: 546d ago</Text>
      </View>
    </View>
  )
}
