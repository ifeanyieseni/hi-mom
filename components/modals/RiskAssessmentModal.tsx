import React from 'react'
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { RiskAssessmentResponse } from '@/services/riskAssessment'
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react-native'

interface RiskAssessmentModalProps {
  visible: boolean
  onClose: () => void
  riskAssessment: RiskAssessmentResponse | null
  patientName?: string
}

export function RiskAssessmentModal({
  visible,
  onClose,
  riskAssessment,
  patientName = 'Patient',
}: RiskAssessmentModalProps) {
  // Declare hooks unconditionally; guard logic with optional chaining
  const riskLevel = riskAssessment?.riskLevel

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
        }
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
        }
      default:
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
        }
    }
  }

  const handleUrgentAction = () => {
    const hasUrgentTriggers = riskAssessment?.triggers?.some(
      (trigger) => trigger.action === 'urgent_refer'
    )

    if (hasUrgentTriggers) {
      Alert.alert(
        'Urgent Referral Required',
        'This patient requires immediate referral to a higher-level facility. Please take action now.',
        [
          { text: 'Understood', style: 'default' },
          { text: 'Call Emergency', style: 'destructive' },
        ]
      )
    }
  }

  React.useEffect(() => {
    if (visible && riskLevel === 'high') {
      handleUrgentAction()
    }
  }, [visible, riskLevel, handleUrgentAction])

  
  if (!riskAssessment) return null

  const riskColors = getRiskLevelColor(riskAssessment.riskLevel)

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={onClose}
    >
      <View className='flex-1 bg-white'>
        {/* Header */}
        <View className='flex-row justify-between items-center p-6 border-b border-gray-200'>
          <View>
            <Text className='text-xl font-bold text-gray-900'>
              Risk Assessment
            </Text>
            <Text className='text-sm text-gray-600'>{patientName}</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className='p-2 rounded-full bg-gray-100'
          >
            <X size={20} color='#6B7280' />
          </TouchableOpacity>
        </View>

        <ScrollView className='flex-1 p-6'>
          {/* Risk Level Summary */}
          <View
            className={`p-4 rounded-lg border ${riskColors.bg} ${riskColors.border} mb-6`}
          >
            <View className='flex-row items-center mb-2'>
              {riskAssessment.riskLevel === 'high' ? (
                <AlertTriangle size={24} color='#DC2626' />
              ) : riskAssessment.riskLevel === 'medium' ? (
                <Info size={24} color='#D97706' />
              ) : (
                <CheckCircle size={24} color='#059669' />
              )}
              <Text className={`ml-2 text-lg font-bold ${riskColors.text}`}>
                {riskAssessment.riskLevel.toUpperCase()} RISK
              </Text>
            </View>
            <Text className={`text-sm ${riskColors.text}`}>
              {riskAssessment.summary}
            </Text>
          </View>

          {/* Risk Factors */}
          {riskAssessment.triggers.length > 0 && (
            <View className='mb-6'>
              <Text className='text-lg font-semibold text-gray-900 mb-3'>
                Identified Risk Factors
              </Text>
              {riskAssessment.triggers.map((trigger, index) => (
                <View
                  key={`trigger-${index}-${trigger.message.substring(0, 10)}`}
                  className='flex-row items-start p-3 bg-gray-50 rounded-lg mb-2'
                >
                  <View className='w-2 h-2 rounded-full bg-red-500 mt-2 mr-3' />
                  <Text className='flex-1 text-gray-800'>
                    {trigger.message}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* AI Recommendations */}
          <View className='mb-6'>
            <Text className='text-lg font-semibold text-gray-900 mb-3'>
              🤖 AI Recommendations
            </Text>
            {riskAssessment.aiRecommendations.map((recommendation, index) => (
              <View
                key={`recommendation-${index}-${recommendation.substring(0, 10)}`}
                className='flex-row items-start p-3 bg-blue-50 rounded-lg mb-2'
              >
                <View className='w-6 h-6 rounded-full bg-blue-500 items-center justify-center mr-3 mt-0.5'>
                  <Text className='text-white text-xs font-bold'>
                    {index + 1}
                  </Text>
                </View>
                <Text className='flex-1 text-blue-900'>{recommendation}</Text>
              </View>
            ))}
          </View>

          {/* Clinical Actions */}
          {riskAssessment.clinicalActions.length > 0 && (
            <View className='mb-6'>
              <Text className='text-lg font-semibold text-gray-900 mb-3'>
                Clinical Actions Required
              </Text>
              {riskAssessment.clinicalActions.map((action, index) => (
                <View
                  key={`action-${index}-${action.substring(0, 10)}`}
                  className='flex-row items-center p-3 bg-green-50 rounded-lg mb-2'
                >
                  <CheckCircle size={16} color='#059669' />
                  <Text className='ml-2 text-green-800 capitalize'>
                    {action.replace(/_/g, ' ')}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Emergency Actions */}
          {riskAssessment.riskLevel === 'high' && (
            <View className='p-4 bg-red-50 border border-red-200 rounded-lg mb-6'>
              <Text className='text-red-800 font-semibold mb-2'>
                ⚠️ URGENT ACTION REQUIRED
              </Text>
              <Text className='text-red-700 text-sm mb-3'>
                This patient has high-risk factors that require immediate
                attention.
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'Emergency Referral',
                    'Contact higher-level facility immediately for this patient.',
                    [{ text: 'OK' }]
                  )
                }
                className='bg-red-600 p-3 rounded-lg'
              >
                <Text className='text-white font-semibold text-center'>
                  Initiate Emergency Referral
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Footer Actions */}
        <View className='p-6 border-t border-gray-200'>
          <TouchableOpacity
            onPress={onClose}
            className='bg-indigo-600 p-4 rounded-lg'
          >
            <Text className='text-white font-semibold text-center'>
              Continue with Patient Care
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
