import React, { useState } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { AntenatalVisitData } from '@/store/antenatalVisitStore'

interface VisitRecordsTabProps {
  visits: AntenatalVisitData[]
  patientId: string
}

export function VisitRecordsTab({ visits, patientId }: VisitRecordsTabProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'all'>('all')

  // Filter visits based on selected date filter
  const getFilteredVisits = () => {
    if (!visits.length) return []

    const now = new Date()
    const filteredVisits = visits.filter((visit) => {
      const visitDate = new Date(visit.visitDate)

      switch (dateFilter) {
        case 'week':
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - now.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          return visitDate >= weekStart && visitDate <= weekEnd

        case 'month':
          return (
            visitDate.getMonth() === now.getMonth() &&
            visitDate.getFullYear() === now.getFullYear()
          )

        default:
          return true
      }
    })

    return filteredVisits.sort(
      (a, b) =>
        new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
    )
  }

  const filteredVisits = getFilteredVisits()

  const renderListView = () => (
    <View className='space-y-3'>
      {filteredVisits.map((visit) => {
        const {
          id: visitId,
          visitType,
          visitDate,
          currentGestationWeeks,
          bloodPressure,
          weight,
          fetalHeartRate,
          notes,
        } = visit

        const visitDateObj = new Date(visitDate)

        return (
          <View
            key={visitId}
            className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'
          >
            <View className='flex-row justify-between items-start mb-3'>
              <View>
                <Text className='text-lg font-semibold text-gray-800 capitalize'>
                  {visitType} Visit
                </Text>
                <Text className='text-gray-600'>
                  {visitDateObj.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${
                  visitType === 'first' ? 'bg-green-100' : 'bg-blue-100'
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    visitType === 'first' ? 'text-green-700' : 'text-blue-700'
                  }`}
                >
                  {visitType === 'first' ? 'Initial' : 'Follow-up'}
                </Text>
              </View>
            </View>

            <View className='space-y-2'>
              <View className='flex-row justify-between'>
                <Text className='text-gray-600'>Gestation:</Text>
                <Text className='text-gray-800 font-medium'>
                  {currentGestationWeeks} weeks
                </Text>
              </View>
              <View className='flex-row justify-between'>
                <Text className='text-gray-600'>Blood Pressure:</Text>
                <Text className='text-gray-800 font-medium'>
                  {bloodPressure}
                </Text>
              </View>
              <View className='flex-row justify-between'>
                <Text className='text-gray-600'>Weight:</Text>
                <Text className='text-gray-800 font-medium'>{weight}</Text>
              </View>
              <View className='flex-row justify-between'>
                <Text className='text-gray-600'>Fetal Heart Rate:</Text>
                <Text className='text-gray-800 font-medium'>
                  {fetalHeartRate} bpm
                </Text>
              </View>
              {notes && (
                <View className='mt-3 p-3 bg-gray-50 rounded-lg'>
                  <Text className='text-gray-700 text-sm'>{notes}</Text>
                </View>
              )}
            </View>
          </View>
        )
      })}
    </View>
  )

  const renderCalendarView = () => {
    // Group visits by date for simple calendar-like display
    const visitsByDate: { [key: string]: typeof visits } = {}

    filteredVisits.forEach((visit) => {
      const dateKey = new Date(visit.visitDate).toDateString()
      if (!visitsByDate[dateKey]) {
        visitsByDate[dateKey] = []
      }
      visitsByDate[dateKey].push(visit)
    })

    const dates = Object.keys(visitsByDate).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    )

    return (
      <View className='space-y-3'>
        {dates.map((dateKey) => {
          const visits = visitsByDate[dateKey]
          const date = new Date(dateKey)

          return (
            <View
              key={dateKey}
              className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'
            >
              <View className='flex-row items-center mb-3'>
                <View className='w-12 h-12 bg-blue-50 rounded-lg items-center justify-center mr-3'>
                  <Text className='text-blue-600 font-bold text-lg'>
                    {date.getDate()}
                  </Text>
                  <Text className='text-blue-500 text-xs'>
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </Text>
                </View>
                <View className='flex-1'>
                  <Text className='font-semibold text-gray-900'>
                    {date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text className='text-sm text-gray-500'>
                    {visits.length} visit{visits.length > 1 ? 's' : ''}
                  </Text>
                </View>
              </View>

              <View className='space-y-2'>
                {visits.map((visit) => (
                  <View
                    key={visit.id}
                    className='flex-row items-center justify-between p-3 bg-gray-50 rounded-lg'
                  >
                    <View className='flex-row items-center flex-1'>
                      <View
                        className={`w-3 h-3 rounded-full mr-3 ${
                          visit.visitType === 'first'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <View className='flex-1'>
                        <Text className='text-gray-800 font-medium capitalize'>
                          {visit.visitType} Visit
                        </Text>
                        <Text className='text-gray-600 text-sm'>
                          {visit.currentGestationWeeks} weeks • BP:{' '}
                          {visit.bloodPressure}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <ScrollView className='flex-1 px-4 pb-4'>
      {/* Header with Add Button */}
      <View className='flex-row justify-between items-center mb-4'>
        <Text className='text-lg font-bold text-gray-800'>Visit Records</Text>
        <TouchableOpacity
          className='bg-blue-500 px-4 py-2 rounded-lg flex-row items-center'
          onPress={() =>
            router.push(`/visit/form?type=follow-up&patientId=${patientId}`)
          }
        >
          <Ionicons name='add' size={16} color='white' />
          <Text className='text-white font-medium ml-2'>Follow up Visit</Text>
        </TouchableOpacity>
      </View>

      {/* View Mode Toggle */}
      <View className='flex-row bg-gray-100 rounded-lg p-1 mb-4'>
        <TouchableOpacity
          className={`flex-1 py-2 px-3 rounded-md ${
            viewMode === 'list' ? 'bg-white shadow-sm' : ''
          }`}
          onPress={() => setViewMode('list')}
        >
          <Text
            className={`text-center font-medium ${
              viewMode === 'list' ? 'text-gray-900' : 'text-gray-600'
            }`}
          >
            List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 px-3 rounded-md ${
            viewMode === 'calendar' ? 'bg-white shadow-sm' : ''
          }`}
          onPress={() => setViewMode('calendar')}
        >
          <Text
            className={`text-center font-medium ${
              viewMode === 'calendar' ? 'text-gray-900' : 'text-gray-600'
            }`}
          >
            Calendar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Filters */}
      <View className='flex-row space-x-2 mb-4'>
        {[
          { key: 'all', label: 'All Time' },
          { key: 'month', label: 'This Month' },
          { key: 'week', label: 'This Week' },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            className={`px-3 py-2 rounded-full border ${
              dateFilter === filter.key
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white border-gray-200'
            }`}
            onPress={() => setDateFilter(filter.key as any)}
          >
            <Text
              className={`text-sm font-medium ${
                dateFilter === filter.key ? 'text-blue-700' : 'text-gray-600'
              }`}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results Summary */}
      <View className='flex-row items-center justify-between mb-4'>
        <Text className='text-sm text-gray-500'>
          Showing {filteredVisits.length} of {visits.length} visits
        </Text>
        <Text className='text-sm text-gray-500'>
          {dateFilter === 'week' && 'This Week'}
          {dateFilter === 'month' && 'This Month'}
          {dateFilter === 'all' && 'All Time'}
        </Text>
      </View>

      {/* Content */}
      {filteredVisits.length === 0 ? (
        <View className='bg-white rounded-xl p-8 items-center'>
          <Ionicons name='calendar-outline' size={48} color='#ccc' />
          <Text className='text-gray-500 text-center mt-2'>
            {visits.length === 0
              ? 'No visit records found'
              : 'No visits in selected period'}
          </Text>
          <Text className='text-gray-400 text-center text-sm'>
            {visits.length === 0
              ? 'Start by adding a follow-up visit'
              : 'Try selecting a different time period'}
          </Text>
        </View>
      ) : (
        <>{viewMode === 'list' ? renderListView() : renderCalendarView()}</>
      )}
    </ScrollView>
  )
}
