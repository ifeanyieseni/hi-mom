import { TrendingDown, TrendingUp } from 'lucide-react-native'
import { Text, View } from 'react-native'

type StatCardProps = {
  title: string
  value: string
  change: string
  positive: boolean
  bgColor?: string
  textColor?: string
}

export function StatsCard({
  title,
  value,
  change,
  positive,
  bgColor,
  textColor = 'text-gray-500',
}: StatCardProps) {
  return (
    <View
      className={`rounded-lg p-4 w-[48%]  border border-gray-100 mb-4  ${bgColor}`}
    >
      <Text className={`font-roboto-medium text-xs ${textColor} mb-1`}>
        {title}
      </Text>
      <Text className={` font-groteskSemiBold text-xl text-gray-900 mb-2 `}>
        {value}
      </Text>
      <View className='flex-row items-center'>
        {positive ? (
          <TrendingUp size={14} color='#22C55E' />
        ) : (
          <TrendingDown size={14} color='#EF4444' />
        )}
        <Text
          className={`font-roboto-medium text-xs ml-1 ${
            positive ? 'text-success-500' : 'text-error-500'
          }`}
        >
          {change}
        </Text>
      </View>
    </View>
  )
}
