import { useEffect, useState } from 'react'
import { useColorScheme as useRNColorScheme } from 'react-native'

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 * Fixed to prevent "Cannot manually set color scheme" error
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  // Use a default light scheme to avoid color scheme conflicts
  const colorScheme = useRNColorScheme()

  if (hasHydrated) {
    // Return the detected color scheme or default to light
    return colorScheme || 'light'
  }

  return 'light'
}
