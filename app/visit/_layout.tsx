import { Stack } from 'expo-router'
import React from 'react'

export default function VisitLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: true,
      title: 'Visit',
      headerBackTitle: 'Back'
    }}>
      <Stack.Screen name='new-visit' />
      <Stack.Screen name='form' />
      <Stack.Screen name='[id]' options={{   headerShown: false }} />
    </Stack>
  )
}
