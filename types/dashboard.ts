import { LucideIcon } from 'lucide-react-native'

// Dashboard-specific data structures
export interface TodaysVisit {
  id: string
  patientName: string
  patientId: string
  visitTime: string
  visitType: 'first' | 'follow-up'
  riskLevel: 'low' | 'medium' | 'high'
  gestationWeeks: number
  notes?: string
}

export interface DashboardStat {
  title: string
  value: string | number
  icon: LucideIcon
  color: string
  trend?: 'up' | 'down' | 'stable'
}

export interface ShortcutItem {
  id: string
  title: string
  icon: LucideIcon
  route: string
  color: string
}

export interface DashboardData {
  todaysVisits: TodaysVisit[]
  stats: {
    totalVisitsToday: number
    completedVisits: number
    pendingVisits: number
    highRiskPatients: number
  }
  lastSyncTime: string
  isOnline: boolean
}

// Component prop interfaces
export interface TodaysVisitsSectionProps {
  visits: TodaysVisit[]
  isLoading: boolean
  onRefresh: () => void
}

export interface StartVisitButtonProps {
  onPress: () => void
  disabled?: boolean
}

export interface QuickShortcutsSectionProps {
  shortcuts: ShortcutItem[]
}

export interface SummaryStatsSectionProps {
  stats: DashboardStat[]
}
