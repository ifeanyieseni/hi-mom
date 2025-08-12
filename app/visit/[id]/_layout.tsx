import { Stack } from 'expo-router'
import React from 'react'

export default function VisitIdLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='first' />
      <Stack.Screen name='follow-up' />
      <Stack.Screen name='summary' />
    </Stack>
  )
} 