import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, TriangleAlert as AlertTriangle, Heart, Activity } from 'lucide-react-native';

export default function RiskPatientsScreen() {
  // Mock high-risk patients data
  const highRiskPatients = [
    {
      id: 'PT001',
      name: 'Amina Ibrahim',
      age: 24,
      condition: 'Gestational Hypertension',
      riskLevel: 'high',
      vitals: { bloodPressure: '140/90', heartRate: 88 },
      nextAppointment: 'Tomorrow, 10:00 AM',
    },
    {
      id: 'PT005',
      name: 'Hauwa Ibrahim',
      age: 30,
      condition: 'Pre-eclampsia',
      riskLevel: 'high',
      vitals: { bloodPressure: '150/95', heartRate: 92 },
      nextAppointment: 'Today, 2:30 PM',
    },
    {
      id: 'PT008',
      name: 'Zainab Yusuf',
      age: 35,
      condition: 'Gestational Diabetes',
      riskLevel: 'high',
      vitals: { bloodPressure: '135/85', heartRate: 86 },
      nextAppointment: 'May 30, 11:00 AM',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-6 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color="#052871" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-gray-900">High Risk Patients</Text>
            <Text className="text-base text-gray-600 mt-1">{highRiskPatients.length} patients need attention</Text>
          </View>
        </View>
      </View>
      
      <ScrollView className="flex-1 px-6 py-6">
        <View className="space-y-4">
          {highRiskPatients.map((patient) => (
            <TouchableOpacity 
              key={patient.id}
              onPress={() => router.push(`/patient/${patient.id}`)}
              className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-risk-high"
            >
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-lg font-semibold text-gray-900">{patient.name}</Text>
                  <Text className="text-sm text-gray-600 mt-1">Age: {patient.age}</Text>
                </View>
                <View className="bg-error-50 px-3 py-1 rounded-full flex-row items-center">
                  <AlertTriangle size={14} color="#E63946" />
                  <Text className="text-xs font-semibold text-risk-high ml-1">HIGH RISK</Text>
                </View>
              </View>
              
              <View className="mt-3 pt-3 border-t border-gray-100">
                <Text className="text-sm font-medium text-gray-800">{patient.condition}</Text>
                
                <View className="flex-row mt-2 space-x-4">
                  <View className="flex-row items-center">
                    <Heart size={14} color="#E63946" />
                    <Text className="text-sm text-gray-600 ml-1">{patient.vitals.bloodPressure}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Activity size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-600 ml-1">{patient.vitals.heartRate} bpm</Text>
                  </View>
                </View>
                
                <View className="mt-3 bg-primary-50 rounded-lg p-2">
                  <Text className="text-xs text-primary-700">Next appointment: {patient.nextAppointment}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
