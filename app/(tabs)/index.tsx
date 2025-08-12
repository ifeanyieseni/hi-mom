import { DashboardHeader } from '@/components/DashboardHeader'
import { TodaysVisitsSection } from '@/components/dashboard/TodaysVisitsSection'
import { StartVisitButton } from '@/components/dashboard/StartVisitButton'
import { QuickShortcutsSection } from '@/components/dashboard/QuickShortcutsSection'
import { SummaryStatsSection } from '@/components/dashboard/SummaryStatsSection'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useAntenatalVisitStore } from '@/store/antenatalVisitStore'
import { usePatientStore } from '@/store/patientStore'
import {
  getTodaysVisits,
  calculateDashboardStats,
} from '@/utils/dashboardUtils'
import { ShortcutItem } from '@/types/dashboard'
import { router } from 'expo-router'
import { Search, Calendar, Users, AlertTriangle } from 'lucide-react-native'

import React, { useState, useEffect, useCallback } from 'react'
import {
  ScrollView,
  RefreshControl,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function DashboardScreen() {
  const { visits, loadVisits, cleanupOrphanedVisits, removeDuplicateVisits } =
    useAntenatalVisitStore()
  const { patients, loadPatients } = usePatientStore()

  const [isLoading, setIsLoading] = useState(true) // Start with loading true
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load patients on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        await Promise.all([loadPatients(), loadVisits()])

        // Clean up orphaned visits after loading data
        if (patients.length > 0) {
          const patientIds = patients.map((p) => p.id)
          cleanupOrphanedVisits(patientIds)
        }

        // Remove duplicate visits
        removeDuplicateVisits()

        setError(null)
      } catch (err) {
        console.error('Error loading initial data:', err)
        setError('Failed to load patient data')
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, []) // Empty dependency array - only run once on mount

  // Calculate dashboard data with error handling
  const todaysVisits = getTodaysVisits(visits, patients)
  const stats = calculateDashboardStats(visits, patients)

  // Debug logging
  console.log('Dashboard Debug:', {
    visitsCount: visits?.length || 0,
    patientsCount: patients?.length || 0,
    todaysVisitsCount: todaysVisits?.length || 0,
    isLoading,
    error,
  })

  // Define shortcuts
  const shortcuts: ShortcutItem[] = [
    {
      id: 'find-patient',
      title: 'Find Patient',
      icon: Search,
      route: '/patients',
      color: 'bg-blue-500',
    },
    {
      id: 'view-schedule',
      title: 'View Schedule',
      icon: Calendar,
      route: '/schedule',
      color: 'bg-green-500',
    },
  ]

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    setError(null)
    try {
      await Promise.all([loadPatients(), loadVisits()])
      // Visit data is managed by the store and will update automatically

      // Clean up orphaned visits after refresh
      if (patients.length > 0) {
        const patientIds = patients.map((p) => p.id)
        cleanupOrphanedVisits(patientIds)
      }
    } catch (error) {
      console.error('Error refreshing dashboard:', error)
      setError('Failed to refresh data')
    } finally {
      setRefreshing(false)
    }
  }, [loadPatients, loadVisits, patients, cleanupOrphanedVisits])

  // Handle start visit
  const handleStartVisit = () => {
    try {
      router.push('/visit/new-visit')
    } catch (error) {
      console.error('Navigation error:', error)
      setError('Failed to navigate to visit screen')
    }
  }

  // Error retry handler
  const handleRetry = () => {
    setError(null)
    onRefresh()
  }

  // Error display component
  const ErrorDisplay = () => (
    <View className='bg-red-50 border border-red-200 rounded-xl p-4 mb-4'>
      <View className='flex-row items-center mb-2'>
        <AlertTriangle size={20} color='#EF4444' />
        <Text className='text-red-800 font-semibold ml-2'>Error</Text>
      </View>
      <Text className='text-red-700 text-sm mb-3'>{error}</Text>
      <TouchableOpacity
        onPress={handleRetry}
        className='bg-red-100 rounded-lg px-3 py-2 self-start'
      >
        <Text className='text-red-800 font-medium'>Try Again</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <ErrorBoundary>
      <SafeAreaView className='flex-1 bg-gray-100'>
        {/* Header */}
        <DashboardHeader
          userName='Dr. Sarah Johnson'
          onNotificationPress={() => {}}
        />

        <ScrollView
          className='flex-1 px-6 py-6'
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Error Display */}
          {error && <ErrorDisplay />}

          {/* Summary Statistics */}
          <SummaryStatsSection stats={stats} />

          {/* Today's Visits */}
          <TodaysVisitsSection
            visits={todaysVisits}
            isLoading={isLoading}
            onRefresh={onRefresh}
          />

          {/* Start Visit Button */}
          <View className='mb-6'>
            <StartVisitButton onPress={handleStartVisit} />
          </View>

          {/* Quick Shortcuts */}
          <QuickShortcutsSection shortcuts={shortcuts} />
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  )
}
