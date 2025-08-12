import { AntenatalVisitData } from '@/store/antenatalVisitStore'
import { Patient } from '@/types/patients'
import { TodaysVisit, DashboardStat } from '@/types/dashboard'
import { Calendar, Clock, AlertTriangle, Users } from 'lucide-react-native'

/**
 * Formats a date string to display time in HH:MM format
 */
export const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch (error) {
    return 'Invalid time'
  }
}

/**
 * Calculates risk level based on visit data
 */
export const calculateRiskLevel = (
  visit: AntenatalVisitData
): 'low' | 'medium' | 'high' => {
  let riskScore = 0

  // Age-based risk
  const age = parseInt(visit.age)
  if (age < 18 || age > 35) riskScore += 2
  else if (age < 20 || age > 30) riskScore += 1

  // Medical history risk factors
  if (visit.hypertension === 'yes') riskScore += 3
  if (visit.diabetes === 'yes') riskScore += 3
  if (visit.previousEclampsiaPreeclampsia === 'yes') riskScore += 3
  if (visit.previousCesareanSections === 'yes') riskScore += 2
  if (visit.previousAPHPPH === 'yes') riskScore += 2
  if (visit.sickleCellDisease === 'yes') riskScore += 2
  if (visit.chronicAnaemia === 'yes') riskScore += 1
  if (visit.hivStatus === 'positive') riskScore += 2

  // Pregnancy-related risks
  const gestationWeeks = parseInt(visit.currentGestationWeeks)
  if (gestationWeeks > 42) riskScore += 2
  if (gestationWeeks < 37 && gestationWeeks > 20) riskScore += 1

  // Blood pressure risk
  if (visit.bloodPressure) {
    const [systolic] = visit.bloodPressure.split('/').map(Number)
    if (systolic >= 140) riskScore += 2
    else if (systolic >= 130) riskScore += 1
  }

  // Risk assessment from form
  if (visit.identifiedRisks === 'yes') riskScore += 1
  if (visit.referralToHigherLevel === 'yes') riskScore += 2

  // Return risk level based on score
  if (riskScore >= 6) return 'high'
  if (riskScore >= 3) return 'medium'
  return 'low'
}

/**
 * Filters visits to get only today's visits
 */
export const getTodaysVisits = (
  visits: AntenatalVisitData[],
  patients: Patient[] = []
): TodaysVisit[] => {
  try {
    if (!Array.isArray(visits)) {
      console.warn(
        'getTodaysVisits: visits is not an array, returning empty array'
      )
      return []
    }

    const today = new Date().toDateString()

    return visits
      .filter((visit) => {
        try {
          // Check if visit is valid and for today
          const isTodayVisit = visit &&
            visit.visitDate &&
            new Date(visit.visitDate).toDateString() === today
          
          if (!isTodayVisit) return false
          
          // Check if the patient still exists
          if (visit.patientId) {
            const patientExists = patients.some(patient => patient.id === visit.patientId)
            if (!patientExists) {
              console.warn(`Visit ${visit.id} references non-existent patient ${visit.patientId}`)
              return false
            }
          }
          
          return true
        } catch (error) {
          console.warn('Error filtering visit:', visit?.id, error)
          return false
        }
      })
      .map((visit) => {
        try {
          return {
            id: visit.id || 'unknown',
            patientName: visit.womanFullName || 'Unknown Patient',
            patientId: visit.patientId || '',
            visitTime: formatTime(visit.visitDate),
            visitType: visit.visitType || 'first',
            riskLevel: calculateRiskLevel(visit),
            gestationWeeks: parseInt(visit.currentGestationWeeks) || 0,
            notes: visit.notes || '',
          }
        } catch (error) {
          console.error('Error mapping visit:', visit?.id, error)
          return {
            id: visit.id || 'error',
            patientName: 'Error loading patient',
            patientId: visit.patientId || '',
            visitTime: 'Invalid time',
            visitType: 'first' as const,
            riskLevel: 'low' as const,
            gestationWeeks: 0,
            notes: '',
          }
        }
      })
      .sort((a, b) => {
        try {
          // Sort by visit time
          const timeA = new Date(`1970-01-01 ${a.visitTime}`).getTime()
          const timeB = new Date(`1970-01-01 ${b.visitTime}`).getTime()
          return timeA - timeB
        } catch (error) {
          console.warn('Error sorting visits:', error)
          return 0
        }
      })
  } catch (error) {
    console.error('Error in getTodaysVisits:', error)
    return []
  }
}

/**
 * Calculates dashboard statistics from visits and patients data
 */
export const calculateDashboardStats = (
  visits: AntenatalVisitData[],
  patients: Patient[]
): DashboardStat[] => {
  try {
    const safeVisits = Array.isArray(visits) ? visits : []
    const safePatients = Array.isArray(patients) ? patients : []

    const today = new Date().toDateString()
    const todaysVisits = safeVisits.filter((visit) => {
      try {
        return (
          visit &&
          visit.visitDate &&
          new Date(visit.visitDate).toDateString() === today
        )
      } catch (error) {
        console.warn('Error filtering visit for stats:', visit?.id, error)
        return false
      }
    })

    // Calculate completed visits (visits that have been marked as completed)
    // For now, we'll consider all visits from today as pending since we don't have a completion status
    const completedVisits = 0 // This would need to be implemented when visit completion is tracked

    // Calculate high-risk patients
    const highRiskPatients = safePatients.filter((patient) => {
      try {
        return patient && patient.riskLevel === 'high'
      } catch (error) {
        console.warn('Error checking patient risk level:', patient?.id, error)
        return false
      }
    }).length

    return [
      {
        title: 'Visits Today',
        value: todaysVisits.length,
        icon: Calendar,
        color: 'bg-blue-500',
      },
      {
        title: 'High Risk',
        value: highRiskPatients,
        icon: AlertTriangle,
        color: 'bg-red-500',
      },
      {
        title: 'Pending Visits',
        value: Math.max(0, todaysVisits.length - completedVisits),
        icon: Clock,
        color: 'bg-yellow-500',
      },
      {
        title: 'Total Patients',
        value: safePatients.length,
        icon: Users,
        color: 'bg-green-500',
      },
    ]
  } catch (error) {
    console.error('Error calculating dashboard stats:', error)
    // Return default stats in case of error
    return [
      {
        title: 'Visits Today',
        value: 0,
        icon: Calendar,
        color: 'bg-blue-500',
      },
      {
        title: 'High Risk',
        value: 0,
        icon: AlertTriangle,
        color: 'bg-red-500',
      },
      {
        title: 'Pending Visits',
        value: 0,
        icon: Clock,
        color: 'bg-yellow-500',
      },
      {
        title: 'Total Patients',
        value: 0,
        icon: Users,
        color: 'bg-green-500',
      },
    ]
  }
}

/**
 * Checks if a date is today
 */
export const isToday = (dateString: string): boolean => {
  const today = new Date().toDateString()
  const checkDate = new Date(dateString).toDateString()
  return today === checkDate
}

/**
 * Gets the risk level color class for styling
 */
export const getRiskLevelColor = (
  riskLevel: 'low' | 'medium' | 'high'
): string => {
  switch (riskLevel) {
    case 'high':
      return 'bg-red-100 text-red-600'
    case 'medium':
      return 'bg-yellow-100 text-yellow-600'
    case 'low':
      return 'bg-green-100 text-green-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

/**
 * Gets the risk level display text
 */
export const getRiskLevelText = (
  riskLevel: 'low' | 'medium' | 'high'
): string => {
  switch (riskLevel) {
    case 'high':
      return 'HIGH'
    case 'medium':
      return 'MEDIUM'
    case 'low':
      return 'LOW'
    default:
      return 'UNKNOWN'
  }
}
