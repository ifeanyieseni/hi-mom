import { Text, TouchableOpacity, View } from 'react-native'

type RiskLevel = 'high' | 'medium' | 'low' | 'unknown'

type RiskCardProps = {
  title: string
  count: number
  level: RiskLevel
  lastUpdated: string
  onPress?: () => void
}

const riskTextColors: Record<RiskLevel, string> = {
  high: 'text-red-600',
  medium: 'text-yellow-600',
  low: 'text-green-600',
  unknown: 'text-gray-600',
}

export function RiskCard({
  title,
  count,
  level,
  lastUpdated,
  onPress = () => {},
}: RiskCardProps) {
  const countColor = riskTextColors[level]

  return (
    <TouchableOpacity
      onPress={onPress}
      className='flex-row justify-between items-center border border-gray-200 rounded-md shadow-sm px-4 py-3 bg-white'
    >
      {/* Left: title + last updated */}
      <View className='flex-1'>
        <Text className='font-roboto-medium text-sm text-gray-800'>
          {title}
        </Text>
        <Text className='text-xs text-gray-500 mt-1'>{lastUpdated}</Text>
      </View>

      {/* Right: count + chevron */}
      <View className='flex-row items-center space-x-2'>
        <Text className={`text-xl font-bold text-red-500 ${countColor}`}>
          {count}
        </Text>
        {/* <ChevronRight size={20} className={countColor} /> */}
      </View>
    </TouchableOpacity>
  )
}
