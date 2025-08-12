/* eslint-disable react-hooks/exhaustive-deps */
import { useFrameworkReady } from '@/hooks/useFrameworkReady'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '../global.css'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

function RootLayoutNav() {
  const { isAuthenticated } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      <Stack.Screen name='language' options={{ headerShown: false }} />
      <Stack.Screen name='sync' options={{ headerShown: false }} />
      <Stack.Screen name='+not-found' options={{ headerShown: false }} />
      <Stack.Screen name='visit' options={{ headerShown: false }} />
      <Stack.Screen
        name='patient/[id]'
        options={{
          title: 'Patient Details',
          headerBackTitle: 'Back',
          headerShown: false,
        }}
      />
    </Stack>
  )
}

export default function RootLayout() {
  useFrameworkReady()

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <RootLayoutNav />
        <StatusBar style='auto' />
      </SafeAreaProvider>
    </AuthProvider>
  )
}
