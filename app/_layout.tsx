 
import { useFrameworkReady } from '@/hooks/useFrameworkReady'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { View, Text, ActivityIndicator } from 'react-native'
import '../global.css'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'

// Loading screen component
function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        HiMom
      </Text>
      <ActivityIndicator size='large' color='white' />
      <Text
        style={{
          color: 'white',
          fontSize: 16,
          marginTop: 20,
          opacity: 0.8,
        }}
      >
        Loading...
      </Text>
    </View>
  )
}

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    console.log('Auth state changed:', {
      isAuthenticated,
      isLoading,
      segments: segments[0],
    })

    // Don't redirect while still loading
    if (isLoading) {
      console.log('Auth still loading...')
      return
    }

    // Check if user is authenticated and redirect accordingly
    if (isAuthenticated === null) {
      // Auth check failed, redirect to welcome
      console.log('Auth check failed, redirecting to welcome')
      router.replace('/welcome')
      return
    }

    if (isAuthenticated) {
      // User is authenticated, redirect to main app
      console.log('User authenticated, redirecting to tabs')
      if (
        segments[0] === '(auth)' ||
        segments[0] === 'login' ||
        segments[0] === 'welcome' ||
        segments[0] === 'index'
      ) {
        router.replace('/(tabs)')
      }
    } else {
      // User is not authenticated, redirect to welcome
      console.log('User not authenticated, redirecting to welcome')
      if (segments[0] === '(tabs)' || segments[0] === 'index') {
        router.replace('/welcome')
      }
    }
  }, [isAuthenticated, isLoading, segments, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingScreen />
  }

  // If not authenticated, only show public routes
  if (isAuthenticated === false) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='welcome' options={{ headerShown: false }} />
        <Stack.Screen name='login' options={{ headerShown: false }} />
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

  // If authenticated, show all routes
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='(auth)' options={{ headerShown: false }} />
      <Stack.Screen name='welcome' options={{ headerShown: false }} />
      <Stack.Screen name='login' options={{ headerShown: false }} />
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
