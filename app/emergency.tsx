import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, ChevronUp, Phone, TriangleAlert as AlertTriangle, Heart, Thermometer } from 'lucide-react-native';

const emergencyProtocols = [
  {
    id: 1,
    title: 'Severe Bleeding',
    severity: 'CRITICAL',
    icon: AlertTriangle,
    steps: [
      'Call emergency services immediately',
      'Apply direct pressure to bleeding site',
      'Elevate legs if possible',
      'Monitor vital signs',
      'Prepare for immediate transport',
    ],
    contacts: ['Emergency: 199', 'Ambulance: 199'],
  },
  {
    id: 2,
    title: 'High Blood Pressure Crisis',
    severity: 'HIGH',
    icon: Heart,
    steps: [
      'Check blood pressure reading',
      'Have patient lie down on left side',
      'Contact medical supervisor',
      'Prepare for referral',
      'Monitor symptoms closely',
    ],
    contacts: ['Medical Supervisor: +234 801 234 5678'],
  },
  {
    id: 3,
    title: 'Seizures',
    severity: 'CRITICAL',
    icon: AlertTriangle,
    steps: [
      'Ensure patient safety, clear area',
      'Do not restrain patient',
      'Time the seizure',
      'Call emergency services',
      'Check airway after seizure ends',
    ],
    contacts: ['Emergency: 199', 'Neurologist: +234 802 345 6789'],
  },
  {
    id: 4,
    title: 'Difficulty Breathing',
    severity: 'HIGH',
    icon: Heart,
    steps: [
      'Help patient sit upright',
      'Check airway for obstructions',
      'Monitor oxygen saturation',
      'Prepare for oxygen administration',
      'Contact emergency services',
    ],
    contacts: ['Emergency: 199', 'Respiratory Specialist: +234 803 456 7890'],
  },
  {
    id: 5,
    title: 'Chest Pain',
    severity: 'HIGH',
    icon: Heart,
    steps: [
      'Have patient rest immediately',
      'Check vital signs',
      'Prepare for cardiac assessment',
      'Contact emergency services',
      'Monitor for changes',
    ],
    contacts: ['Emergency: 199', 'Cardiologist: +234 804 567 8901'],
  },
  {
    id: 6,
    title: 'High Fever',
    severity: 'MEDIUM',
    icon: Thermometer,
    steps: [
      'Check temperature accurately',
      'Remove excess clothing',
      'Apply cool compresses',
      'Encourage fluid intake',
      'Monitor for complications',
    ],
    contacts: ['Medical Supervisor: +234 801 234 5678'],
  },
];

export default function EmergencyScreen() {
  const [expandedProtocol, setExpandedProtocol] = useState<number | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleProtocol = (id: number) => {
    setExpandedProtocol(expandedProtocol === id ? null : id);
  };

  const makeCall = (phoneNumber: string) => {
    // In a real app, this would initiate a phone call
    console.log('Calling:', phoneNumber);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-red-500 px-6 py-6 shadow-lg">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2 -ml-2 bg-white/20 rounded-xl"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white ml-3">Emergency Protocols</Text>
        </View>
        <Text className="text-red-100 mt-2 text-base">
          Quick access to emergency procedures
        </Text>
      </View>

      {/* Emergency Hotline */}
      <View className="bg-white mx-6 mt-6 rounded-2xl p-6 shadow-lg border-2 border-red-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-red-600">Emergency Hotline</Text>
            <Text className="text-base text-gray-600 mt-1">24/7 Emergency Services</Text>
          </View>
          <TouchableOpacity 
            onPress={() => makeCall('199')}
            className="bg-red-500 rounded-2xl p-4 shadow-lg"
          >
            <Phone size={28} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-3xl font-bold text-red-600 mt-3">199</Text>
      </View>

      {/* Protocol List */}
      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        <View className="space-y-4">
          {emergencyProtocols.map((protocol) => (
            <View key={protocol.id} className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <TouchableOpacity
                onPress={() => toggleProtocol(protocol.id)}
                className="p-5 flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <View className={`w-12 h-12 rounded-xl items-center justify-center mr-3 ${getSeverityColor(protocol.severity)}`}>
                      <protocol.icon size={20} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {protocol.title}
                      </Text>
                      <View className="flex-row items-center mt-1">
                        <View className={`px-3 py-1 rounded-full ${getSeverityColor(protocol.severity)}`}>
                          <Text className="text-white text-xs font-bold">
                            {protocol.severity}
                          </Text>
                        </View>
                        <Text className="text-sm text-gray-500 ml-3">
                          {protocol.steps.length} steps
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View className="ml-3">
                  {expandedProtocol === protocol.id ? (
                    <ChevronUp size={24} color="#9CA3AF" />
                  ) : (
                    <ChevronDown size={24} color="#9CA3AF" />
                  )}
                </View>
              </TouchableOpacity>

              {expandedProtocol === protocol.id && (
                <View className="px-5 pb-5 border-t border-gray-50">
                  <Text className="text-base font-semibold text-gray-900 mb-4 mt-4">
                    Protocol Steps:
                  </Text>
                  <View className="space-y-3 mb-6">
                    {protocol.steps.map((step, index) => (
                      <View key={index} className="flex-row items-start">
                        <View className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center mr-4 mt-1">
                          <Text className="text-white text-sm font-bold">
                            {index + 1}
                          </Text>
                        </View>
                        <Text className="flex-1 text-gray-700 text-base leading-6">{step}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <Text className="text-base font-semibold text-gray-900 mb-3">
                    Emergency Contacts:
                  </Text>
                  <View className="space-y-2">
                    {protocol.contacts.map((contact, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => makeCall(contact.split(': ')[1] || contact)}
                        className="flex-row items-center bg-gray-50 rounded-xl p-4"
                      >
                        <View className="w-10 h-10 bg-primary-500 rounded-xl items-center justify-center">
                          <Phone size={18} color="white" />
                        </View>
                        <Text className="text-gray-800 ml-3 text-base font-medium">{contact}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}