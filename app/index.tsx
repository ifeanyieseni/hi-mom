import React, { useEffect } from 'react'
import { router } from 'expo-router'

export default function Index() {
  useEffect(() => {
    // Navigate directly to welcome screen
    console.log('Navigating directly to welcome screen...')
    router.replace('/welcome')
  }, [])

  // Return null since we're redirecting immediately
  return null
}
