import { ThemedText } from '@/components/ThemedText'
import { Link } from 'expo-router'
import { Image, Pressable, View } from 'react-native'

export default function WelcomeScreen() {
  return (
    <View className='flex-1 bg-white '>
      {/* Top image */}
      <Image
        source={require('@/assets/images/welcome-img.jpg')}
        style={{ width: '100%', height: '70%', resizeMode: 'cover' }}
      />

      <View className='flex-1 justify-end px-6 bg-white rounded-t-3xl  shadow-lg pt-5 -mt-10'>
        <ThemedText type='title' className='text-center mb-4 italic text-2xl '>
          {' '}
          Hi Mom
        </ThemedText>
        <ThemedText
          style={{ textAlign: 'center', marginBottom: 20, color: '#6B7280' }}
        >
          A simple and safe way to assess pregnancy-related health risks made
          for expecting moms and their caregivers.
        </ThemedText>
        {/* Get Started Button */}
        <Link href='/login' asChild>
          <Pressable
            className='bg-primary-500 rounded-full py-4 items-center mb-4'
            android_ripple={{ color: '#fff', borderless: false }}
            style={{ marginBottom: 16 }}
          >
            <ThemedText
              style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}
            >
              Get Started
            </ThemedText>
          </Pressable>
        </Link>
      </View>
    </View>
  )
}
