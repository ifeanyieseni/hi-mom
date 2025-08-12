import { View, Text } from 'react-native'
import {
  CloudOff,
  CircleCheck as CheckCircle2,
  RotateCw,
  CircleAlert as AlertCircle,
} from 'lucide-react-native'

type StatusType = 'offline' | 'synced' | 'syncing' | 'error'

type StatusBadgeProps = {
  status: StatusType
  text: string
}

const colorMap: Record<StatusType, string> = {
  offline: 'status-offline',
  synced: 'status-synced',
  syncing: 'status-syncing',
  error: 'status-error',
}

const iconMap = {
  offline: <CloudOff size={14} className='text-status-offline' />,
  synced: <CheckCircle2 size={14} className='text-status-synced' />,
  syncing: <RotateCw size={14} className='text-status-syncing' />,
  error: <AlertCircle size={14} className='text-status-error' />,
} as const


export function StatusBadge({ status, text }: StatusBadgeProps) {
  const colorClass = colorMap[status]
  const icon = iconMap[status]

  return (
    <View
      className={`flex-row items-center px-2 py-1 rounded-full border ${colorClass} border-${colorClass} bg-white`}
    >
      {icon}
      <Text className={`font-roboto-medium text-xs ${colorClass} ml-1`}>
        {text}
      </Text>
    </View>
  )
}
