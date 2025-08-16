import { Patient } from '@/types/patients'
import {
  User,
  Calendar,
  Phone,
  MapPin,
  Clock,
  Star,
  Trash2,
} from 'lucide-react-native'
import { Alert, Text, TouchableOpacity, View, Image } from 'react-native'

interface PatientCardProps {
  patient: any
  onPress?: () => void
  path?: string
  onDelete?: (id: string) => void
}

export function PatientCard({
  patient,
  onPress,
  path,
  onDelete,
}: PatientCardProps) {
  const handlePress = () => {
    if (onPress) return onPress()
    if (path) {
      // Use expo-router navigation if available
      // @ts-ignore
      if (typeof window !== 'undefined' && window.router) {
        // @ts-ignore
        window.router.push(path)
      }
    }
  }

  const showDeleteDialog = () => {
    Alert.alert(
      'Delete Patient',
      'Are you sure you want to delete this patient?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete && onDelete(patient.id),
        },
      ],
      { cancelable: true }
    )
  }

  // Destructure patient data from unified JSON structure
  const { name, riskLevel, lastVisit, gestationWeeks, imageUrl } = patient

  // Format due date
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return null
    }
  }

  // Format last visit
  const formatLastVisit = (dateString?: string) => {
    if (!dateString) return 'No visits'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return 'No visits'
    }
  }

  // Get risk level colors
  const getRiskColor = (risk?: string) => {
    switch (risk?.toLowerCase()) {
      case 'high':
        return '#EF4444'
      case 'medium':
        return '#F59E0B'
      case 'low':
        return '#10B981'
      default:
        return '#6B7280'
    }
  }

  const formattedLastVisit = formatLastVisit(lastVisit)
  const riskColor = getRiskColor(riskLevel)

  return (
    <TouchableOpacity
      className='bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 p-5 relative'
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Main content layout */}
      <View className='flex-row items-center mb-4'>
        {/* Avatar */}
        <View className='w-16 h-16 rounded-2xl bg-blue-50 items-center justify-center mr-4 overflow-hidden'>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className='w-16 h-16 rounded-2xl'
              resizeMode='cover'
            />
          ) : (
            <User size={28} color='#3B82F6' />
          )}
        </View>

        {/* Patient Info - 3 lines */}
        <View className='flex-1'>
          {/* Line 1: Name */}
          <Text className='text-lg font-bold text-gray-900 mb-2'>{name}</Text>

          {/* Line 2: Risk Level */}
          <View className='flex-row items-center mb-2'>
            <View
              className='w-3 h-3 rounded-full mr-2'
              style={{ backgroundColor: riskColor }}
            />
            <Text className='text-sm font-medium' style={{ color: riskColor }}>
              {riskLevel?.toUpperCase() || 'UNKNOWN'} RISK
            </Text>
            {gestationWeeks && (
              <Text className='text-sm text-blue-600 font-medium ml-3'>
                • {gestationWeeks}w pregnant
              </Text>
            )}
          </View>

          {/* Line 3: Last Visit */}
          <Text className='text-sm text-gray-600'>
            Last visit: {formattedLastVisit}
          </Text>
        </View>

        {/* Delete button (top right) */}
        {onDelete && (
          <TouchableOpacity
            onPress={showDeleteDialog}
            className='p-2 absolute top-0 right-0'
          >
            <Trash2 size={18} color='#EF4444' />
          </TouchableOpacity>
        )}
      </View>

      {/* Full-width View Details button */}
      <TouchableOpacity
        className='bg-blue-600 py-3 rounded-xl w-full'
        onPress={handlePress}
      >
        <Text className='text-white text-center font-semibold'>
          View Details
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}
