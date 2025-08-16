import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#333',
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name='home' size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='patients'
        options={{
          title: 'Patients',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name='people' size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='settings'
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name='settings' size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
