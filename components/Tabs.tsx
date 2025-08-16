import React, { useState } from 'react'
import { Text, TouchableOpacity, View, ScrollView } from 'react-native'

type TabSwitcherProps = {
  tabs: string[]
  onChange?: (activeTab: string) => void
  initialTab?: string
  className?: string
}

export const TabSwitcher = ({
  tabs,
  onChange,
  initialTab,
  className,
}: TabSwitcherProps) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab || tabs[0])

  const handlePress = (tab: string) => {
    setActiveTab(tab)
    onChange?.(tab)
  }

  return (
    <View className={`${className} border-b border-gray-200`}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        style={{ minHeight: 56 }}
      >
        {tabs.map((tab, index) => {
          const isActive = tab === activeTab
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => handlePress(tab)}
              className={`py-4 px-6 items-center justify-center min-w-fit ${
                isActive ? 'border-b-2 border-primary-500' : ''
              } ${index !== tabs.length - 1 ? 'mr-6' : ''}`}
            >
              <Text
                className={`text-sm font-medium ${
                  isActive ? 'text-primary-500' : 'text-gray-500'
                }`}
                numberOfLines={1}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}
