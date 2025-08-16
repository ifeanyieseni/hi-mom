import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { Globe, Bell, Moon, Shield, HelpCircle, LogOut, ChevronRight, RefreshCw } from 'lucide-react-native';
import { resetAllData } from '@/utils/resetApp';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSync: true,
    dataPrivacy: true,
  });

  const handleToggle = (setting: string) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting as keyof typeof prev] }));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-6 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">Settings</Text>
        <Text className="text-base text-gray-600 mt-1">Customize your app preferences</Text>
      </View>
      
      <ScrollView className="flex-1 px-6 py-6">
        <View className="space-y-6">
          {/* App Preferences */}
          <View className="space-y-3">
            <Text className="text-lg font-semibold text-gray-800 mb-2">App Preferences</Text>
            
            <TouchableOpacity 
              onPress={() => router.push('/language')}
              className="bg-white rounded-xl p-4 flex-row justify-between items-center shadow-sm"
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center">
                  <Globe size={18} color="#052871" />
                </View>
                <Text className="text-gray-800 ml-3">Language</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-2">English</Text>
                <ChevronRight size={18} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
            
            <View className="bg-white rounded-xl p-4 flex-row justify-between items-center shadow-sm">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center">
                  <Bell size={18} color="#052871" />
                </View>
                <Text className="text-gray-800 ml-3">Notifications</Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={() => handleToggle('notifications')}
                trackColor={{ false: '#D1D5DB', true: '#052871' }}
              />
            </View>
            
            <View className="bg-white rounded-xl p-4 flex-row justify-between items-center shadow-sm">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center">
                  <Moon size={18} color="#052871" />
                </View>
                <Text className="text-gray-800 ml-3">Dark Mode</Text>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={() => handleToggle('darkMode')}
                trackColor={{ false: '#D1D5DB', true: '#052871' }}
              />
            </View>
          </View>
          
          {/* Data & Privacy */}
          <View className="space-y-3">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Data & Privacy</Text>
            
            <TouchableOpacity 
              onPress={() => router.push('/sync')}
              className="bg-white rounded-xl p-4 flex-row justify-between items-center shadow-sm"
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center">
                  <Shield size={18} color="#052871" />
                </View>
                <Text className="text-gray-800 ml-3">Sync Data</Text>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
            
            <View className="bg-white rounded-xl p-4 flex-row justify-between items-center shadow-sm">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center">
                  <Shield size={18} color="#052871" />
                </View>
                <Text className="text-gray-800 ml-3">Auto Sync</Text>
              </View>
              <Switch
                value={settings.autoSync}
                onValueChange={() => handleToggle('autoSync')}
                trackColor={{ false: '#D1D5DB', true: '#052871' }}
              />
            </View>
            
            <View className="bg-white rounded-xl p-4 flex-row justify-between items-center shadow-sm">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center">
                  <Shield size={18} color="#052871" />
                </View>
                <Text className="text-gray-800 ml-3">Data Privacy</Text>
              </View>
              <Switch
                value={settings.dataPrivacy}
                onValueChange={() => handleToggle('dataPrivacy')}
                trackColor={{ false: '#D1D5DB', true: '#052871' }}
              />
            </View>
          </View>
          
          {/* Support */}
          <View className="space-y-3">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Support</Text>
            
            <TouchableOpacity className="bg-white rounded-xl p-4 flex-row justify-between items-center shadow-sm">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center">
                  <HelpCircle size={18} color="#052871" />
                </View>
                <Text className="text-gray-800 ml-3">Help & Support</Text>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-white rounded-xl p-4 flex-row justify-between items-center shadow-sm">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center">
                  <HelpCircle size={18} color="#052871" />
                </View>
                <Text className="text-gray-800 ml-3">About</Text>
              </View>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          
          {/* Reset Data */}
          <TouchableOpacity 
            onPress={() => {
              Alert.alert(
                'Reset All Data',
                'Are you sure you want to reset all data? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        await resetAllData();
                        Alert.alert('Success', 'All data has been reset successfully');
                      } catch (error) {
                        Alert.alert('Error', 'Failed to reset data');
                      }
                    },
                  },
                ]
              );
            }}
            className="bg-white rounded-xl p-4 flex-row items-center shadow-sm mb-4"
          >
            <View className="w-8 h-8 rounded-full bg-error-50 items-center justify-center">
              <RefreshCw size={18} color="#E63946" />
            </View>
            <Text className="text-risk-high ml-3 font-medium">Reset All Data</Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity 
            onPress={() => router.push('/login')}
            className="bg-white rounded-xl p-4 flex-row items-center shadow-sm"
          >
            <View className="w-8 h-8 rounded-full bg-error-50 items-center justify-center">
              <LogOut size={18} color="#E63946" />
            </View>
            <Text className="text-risk-high ml-3 font-medium">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}