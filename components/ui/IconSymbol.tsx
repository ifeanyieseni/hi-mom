// Fallback for using MaterialIcons on Android and web.

import Ionicons from '@expo/vector-icons/Ionicons'
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols'
import { ComponentProps } from 'react'
import {
  OpaqueColorValue,
  Platform,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native'

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code-slash',
  'chevron.right': 'chevron-forward',
  dashboard: 'grid',
  event: 'calendar',
  warning: 'warning',
  people: 'people',
  'grid-outline': 'grid-outline',
  'calendar-outline': 'calendar-outline',
  'warning-outline': 'warning-outline',
  'people-outline': 'people-outline',
  grid: 'grid',
  calendar: 'calendar',
} as const

type IconMapping = typeof MAPPING

type IconSymbolName = keyof IconMapping

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: IconSymbolName
  size?: number
  color?: string | OpaqueColorValue
  style?: StyleProp<TextStyle>
  weight?: SymbolWeight
}) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name={name as SymbolViewProps['name']}
        size={size}
        tintColor={color}
        weight={weight}
        style={style as StyleProp<ViewStyle>}
      />
    )
  } else {
    const mappedName = MAPPING[name]
    if (!mappedName) {
      console.warn(`IconSymbol: No mapping found for icon name '${name}'.`)
      return null
    }
    return <Ionicons color={color} size={size} name={mappedName} style={style} />
  }
}
