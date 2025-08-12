import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { SummaryStatsSectionProps, DashboardStat } from '@/types/dashboard'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native'

interface StatCardProps {
  stat: DashboardStat
  onPress?: () => void
}

const StatCard: React.FC<StatCardProps> = ({ stat, onPress }) => {
  const getTrendIcon = () => {
    if (!stat.trend) return null

    switch (stat.trend) {
      case 'up':
        return <TrendingUp size={16} color='#10B981' />
      case 'down':
        return <TrendingDown size={16} color='#EF4444' />
      case 'stable':
        return <Minus size={16} color='#6B7280' />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    switch (stat.trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      case 'stable':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const CardComponent = onPress ? TouchableOpacity : View

  return (
    <CardComponent
      onPress={onPress}
      className='bg-white rounded-2xl p-5 shadow-sm w-[48%] mb-4'
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`${stat.title}: ${stat.value}`}
    >
      <View className='flex-row items-center justify-between mb-2'>
        <View
          className={`w-10 h-10 rounded-xl ${stat.color} items-center justify-center`}
        >
          <stat.icon size={18} color='white' />
        </View>
        <View className='flex-row items-center'>
          <Text className='text-2xl font-bold text-gray-900 mr-1'>
            {stat.value}
          </Text>
          {getTrendIcon()}
        </View>
      </View>
      <Text className='text-sm font-medium text-gray-600 mb-1'>
        {stat.title}
      </Text>
      {stat.trend && (
        <Text className={`text-xs ${getTrendColor()}`}>
          {stat.trend === 'up' && 'Trending up'}
          {stat.trend === 'down' && 'Trending down'}
          {stat.trend === 'stable' && 'Stable'}
        </Text>
      )}
    </CardComponent>
  )
}

export const SummaryStatsSection: React.FC<SummaryStatsSectionProps> = ({
  stats,
}) => {
  const handleStatPress = (stat: DashboardStat) => {
    // Handle navigation based on stat type
    // This could be expanded to navigate to relevant screens
    console.log(`Pressed stat: ${stat.title}`)
  }

  return (
    <View className='mb-6'>
      <Text className='text-xl font-bold text-gray-900 mb-4'>Overview</Text>
      <View className='flex-row flex-wrap justify-between'>
        {stats.map((stat, index) => (
          <StatCard
            key={`stat-${index}-${stat.title}`}
            stat={stat}
            onPress={() => handleStatPress(stat)}
          />
        ))}
      </View>
    </View>
  )
}
