import { ThemedText } from '@/components/ThemedText'
import { Link } from 'expo-router'
import { Image, Pressable, View } from 'react-native'

export default function WelcomeScreen() {
  return (
    <View className='flex-1 bg-white'>
      {/* Top image with dark overlay */}
      <View style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Image
          source={require('@/assets/images/welcome-img.jpg')}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
          }}
          accessible={true}
          accessibilityLabel='Welcome image showing maternal health care'
        />
        {/* Dark overlay */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.486)',
          }}
        />
        {/* Content overlaid on the image */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingHorizontal: 24,
          }}
        >
          <ThemedText
            type='title'
            style={{
              color: 'white',
              fontSize: 32,
              fontWeight: 'bold',
              marginBottom: 16,
              textAlign: 'left',
            }}
          >
            Hi Mom
          </ThemedText>
          <ThemedText
            style={{
              color: 'white',
              fontSize: 18,
              lineHeight: 26,
              textAlign: 'left',
              opacity: 0.9,
            }}
          >
            A simple and safe way to assess pregnancy-related health risks made
            for expecting moms and their caregivers.
          </ThemedText>

          <View style={{ width: '100%', marginTop: '10px' }}>
            <Link href='/login' asChild>
              <Pressable
                className='bg-primary-500 rounded-full py-6 items-center mb-4'
                style={{ marginTop: 16, minHeight: 60, width: '100%' }}
                accessible={true}
                accessibilityRole='button'
                accessibilityLabel='Get Started'
                accessibilityHint='Tap to begin using the HiMom app'
              >
                <ThemedText
                  style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}
                >
                  Get Started
                </ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </View>
  )
}
