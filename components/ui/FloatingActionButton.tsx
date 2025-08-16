import { Plus } from 'lucide-react-native'
import { useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

interface FloatingActionButtonProps {
  onPress: () => void
  icon?: React.ReactNode
  bottom?: number
  right?: number
}

export function FloatingActionButton({
  onPress,
  icon = <Plus size={24} color='white' />,
  bottom = 24,
  right = 24,
}: FloatingActionButtonProps) {
  const scale = useSharedValue(1)
  const translateY = useSharedValue(0)

  // Bouncing animation
  useEffect(() => {
    const bounce = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite
      true // Reverse
    )
    translateY.value = bounce

    return () => {
      translateY.value = 0
    }
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    }
  })

  const handlePressIn = () => {
    scale.value = withTiming(0.9, { duration: 100 })
  }

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 })
  }

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom,
          right,
          zIndex: 10,
        },
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        className='w-16 h-16 rounded-full bg-primary-500 items-center justify-center shadow-lg'
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        {icon}
      </TouchableOpacity>
    </Animated.View>
  )
}
