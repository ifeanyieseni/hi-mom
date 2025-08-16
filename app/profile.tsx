/* eslint-disable @typescript-eslint/no-unused-vars */
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Edit, MapPin, Phone, Mail, Calendar, Shield, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
  // Mock user data
  const user = {
    name: 'Dr. Sarah Johnson',
    role: 'Community Health Worker',
    location: 'Kaduna, Nigeria',
    phone: '+234 812 345 6789',
    email: 'sarah.johnson@himom.org',
    joinDate: 'January 2023',
    lastActive: 'Today',
    patientsAssigned: 42,
    visitsCompleted: 156,
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-6 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">Profile</Text>
        <Text className="text-base text-gray-600 mt-1">Your account information</Text>
      </View>
      
      <ScrollView className="flex-1">
        {/* Profile Card */}
        <View className="bg-white mx-6 mt-6 rounded-xl shadow-sm overflow-hidden">
          <View className="bg-primary-500 h-24" />
          <View className="px-6 pb-6 -mt-12">
            <View className="items-center">
              <View className="bg-white p-1 rounded-full">
                <View className="w-24 h-24 rounded-full bg-primary-100 items-center justify-center">
                  <Text className="text-3xl font-bold text-primary-500">{user.name.charAt(0)}</Text>
                </View>
              </View>
              <Text className="text-xl font-bold text-gray-900 mt-2">{user.name}</Text>
              <Text className="text-gray-600">{user.role}</Text>
              
              <TouchableOpacity className="flex-row items-center mt-2 bg-primary-50 px-3 py-1 rounded-full">
                <Edit size={12} color="#052871" />
                <Text className="text-xs text-primary-700 ml-1">Edit Profile</Text>
              </TouchableOpacity>
            </View>
            
            <View className="mt-6 space-y-3">
              <View className="flex-row items-center">
                <MapPin size={16} color="#6B7280" />
                <Text className="text-gray-700 ml-2">{user.location}</Text>
              </View>
              
              <View className="flex-row items-center">
                <Phone size={16} color="#6B7280" />
                <Text className="text-gray-700 ml-2">{user.phone}</Text>
              </View>
              
              <View className="flex-row items-center">
                <Mail size={16} color="#6B7280" />
                <Text className="text-gray-700 ml-2">{user.email}</Text>
              </View>
              
              <View className="flex-row items-center">
                <Calendar size={16} color="#6B7280" />
                <Text className="text-gray-700 ml-2">Joined {user.joinDate}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Stats */}
        <View className="mx-6 mt-6 bg-white rounded-xl shadow-sm p-5">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Your Activity</Text>
          
          <View className="flex-row justify-between mb-3">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary-500">{user.patientsAssigned}</Text>
              <Text className="text-sm text-gray-600">Patients</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary-500">{user.visitsCompleted}</Text>
              <Text className="text-sm text-gray-600">Visits</Text>
            </View>
            
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary-500">{user.lastActive}</Text>
              <Text className="text-sm text-gray-600">Last Active</Text>
            </View>
          </View>
        </View>
        
        {/* Account Settings */}
        <View className="mx-6 my-6 space-y-3">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Account Settings</Text>
          
          <TouchableOpacity className="bg-white rounded-xl p-4 flex-row justify-between items-center shadow-sm">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center">
                <Shield size={18} color="#052871" />
              </View>
              <Text className="text-gray-800 ml-3">Security Settings</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/settings')}
            className="bg-white rounded-xl p-4 flex-row justify-between items-center shadow-sm"
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center">
                <Shield size={18} color="#052871" />
              </View>
              <Text className="text-gray-800 ml-3">App Settings</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}