import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { TodaysVisitsSectionProps, TodaysVisit } from '@/types/dashboard'
import { getRiskLevelColor, getRiskLevelText } from '@/utils/dashboardUtils'
import { UserPlus, Clock, Calendar } from 'lucide-react-native'

interface VisitCardProps {
  visit: TodaysVisit
  onPress: () => void
}

const VisitCard: React.FC<VisitCardProps> = ({ visit, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className='bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100'
      accessibilityRole='button'
      accessibilityLabel={`Visit for ${visit.patientName} at ${visit.visitTime}`}
    >
      <View className='flex-row items-center justify-between'>
        <View className='flex-row items-center flex-1'>
          <View className='w-10 h-10 rounded-lg bg-primary-100 items-center justify-center mr-3'>
            <UserPlus size={20} color='#2B7A78' />
          </View>
          <View className='flex-1'>
            <Text className='font-semibold text-gray-900 text-base'>
              {visit.patientName}
            </Text>
            <View className='flex-row items-center mt-1'>
              <Clock size={14} color='#6B7280' />
              <Text className='text-sm text-gray-600 ml-1'>
                {visit.visitTime}
              </Text>
              <Text className='text-sm text-gray-400 ml-2'>
                • {visit.visitType === 'first' ? 'First Visit' : 'Follow-up'}
              </Text>
            </View>
            {visit.gestationWeeks > 0 && (
              <Text className='text-xs text-gray-500 mt-1'>
                {visit.gestationWeeks} weeks gestation
              </Text>
            )}
          </View>
        </View>
        <View className='items-end'>
          <View
            className={`px-2 py-1 rounded-full ${getRiskLevelColor(visit.riskLevel)}`}
          >
            <Text className='text-xs font-bold'>
              {getRiskLevelText(visit.riskLevel)}
            </Text>
          </View>
        </View>
      </View>
      {visit.notes && (
        <Text className='text-sm text-gray-600 mt-2 italic'>{visit.notes}</Text>
      )}
    </TouchableOpacity>
  )
}

const EmptyStateView: React.FC = () => {
  return (
    <View className='bg-white rounded-xl p-8 items-center justify-center shadow-sm border border-gray-100'>
      <View className='w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4'>
        <Calendar size={32} color='#9CA3AF' />
      </View>
      <Text className='text-lg font-semibold text-gray-900 mb-2'>
        No visits scheduled today
      </Text>
      <Text className='text-sm text-gray-600 text-center'>
        You have a clear schedule for today. Use the &quot;Start Visit&quot;
        button to begin a new patient visit.
      </Text>
    </View>
  )
}

const LoadingView: React.FC = () => {
  return (
    <View className='bg-white rounded-xl p-8 items-center justify-center shadow-sm border border-gray-100'>
      <ActivityIndicator size='large' color='#2B7A78' />
      <Text className='text-sm text-gray-600 mt-4'>
        Loading today&apos;s visits...
      </Text>
    </View>
  )
}

export const TodaysVisitsSection: React.FC<TodaysVisitsSectionProps> = ({
  visits,
  isLoading,
  onRefresh,
}) => {
  const handleVisitPress = (visit: TodaysVisit) => {
    try {
      if (!visit.patientId) {
        console.error('Invalid patient ID for visit:', visit.id)
        return
      }
      router.push(`/patient/${visit.patientId}`)
    } catch (error) {
      console.error('Navigation error:', error)
      // Could show a toast or alert here
    }
  }

  return (
    <View className='mb-6'>
      <Text className='text-xl font-bold text-gray-900 mb-4'>
        Today&apos;s Visits
      </Text>

      {isLoading ? (
        <LoadingView />
      ) : visits.length === 0 ? (
        <EmptyStateView />
      ) : (
        <View>
          {visits.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              onPress={() => handleVisitPress(visit)}
            />
          ))}
        </View>
      )}
    </View>
  )
}
