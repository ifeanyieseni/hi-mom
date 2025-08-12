import { useAntenatalVisitStore } from '@/store/antenatalVisitStore'
import { usePatientStore } from '@/store/patientStore'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft, User } from 'lucide-react-native'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

const VisitSummaryScreen = () => {
  const router = useRouter()
  const { id, visitId } = useLocalSearchParams()

  const patient = usePatientStore((state) =>
    state.patients.find((p) => p.id === id)
  )
  const getVisitById = useAntenatalVisitStore((state) => state.getVisitById)

  const visit = visitId ? getVisitById(visitId as string) : null

  if (!patient) {
    return (
      <View className='flex-1 justify-center items-center p-6 bg-white'>
        <Text className='text-base text-gray-500 mb-4'>Patient not found.</Text>
        <TouchableOpacity
          className='bg-primary-500 px-6 py-3 rounded-lg'
          onPress={() => router.back()}
        >
          <Text className='text-white font-bold'>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!visit) {
    return (
      <View className='flex-1 justify-center items-center p-6 bg-white'>
        <Text className='text-base text-gray-500 mb-4'>Visit not found.</Text>
        <TouchableOpacity
          className='bg-primary-500 px-6 py-3 rounded-lg'
          onPress={() => router.back()}
        >
          <Text className='text-white font-bold'>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const renderSection = (title: string, children: React.ReactNode) => (
    <View className='mb-6'>
      <Text className='text-lg font-bold text-gray-800 mb-3'>{title}</Text>
      <View className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'>
        {children}
      </View>
    </View>
  )

  const renderField = (label: string, value: string, required = false) => (
    <View className='mb-3'>
      <Text className='text-sm font-medium text-gray-600 mb-1'>
        {label} {required && <Text className='text-red-500'>*</Text>}
      </Text>
      <Text className='text-base text-gray-800'>
        {value || 'Not specified'}
      </Text>
    </View>
  )

  const renderYesNoField = (label: string, value: string) => (
    <View className='mb-3'>
      <Text className='text-sm font-medium text-gray-600 mb-1'>{label}</Text>
      <View
        className={`px-3 py-1 rounded-full self-start ${
          value === 'yes' ? 'bg-green-100' : 'bg-gray-100'
        }`}
      >
        <Text
          className={`text-sm font-medium ${
            value === 'yes' ? 'text-green-800' : 'text-gray-600'
          }`}
        >
          {value === 'yes' ? 'Yes' : 'No'}
        </Text>
      </View>
    </View>
  )

  const renderHealthEducationTopics = () => {
    // Since healthEducationTopics is not in the AntenatalVisitData interface,
    // we'll return a placeholder for now
    const selectedTopics: string[] = []

    return (
      <View className='mb-3'>
        <Text className='text-sm font-medium text-gray-600 mb-2'>
          Topics Covered:
        </Text>
        {selectedTopics.length > 0 ? (
          <View className='flex-row flex-wrap'>
            {selectedTopics.map((topic, index) => (
              <View
                key={index}
                className='bg-blue-100 px-2 py-1 rounded-full mr-2 mb-2'
              >
                <Text className='text-xs text-blue-800'>{topic}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className='text-gray-500 text-sm'>No topics covered</Text>
        )}
        {/* Health education topics other details would go here */}
      </View>
    )
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Visit Summary' }} />
      <View className='flex-1 bg-gray-50'>
        {/* Header */}
        <View className='bg-primary-500 p-4'>
          <View className='flex-row items-center'>
            <TouchableOpacity onPress={() => router.back()} className='mr-3'>
              <ArrowLeft size={24} color='#ffffff' />
            </TouchableOpacity>
            <View className='flex-1'>
              <Text className='text-white text-lg font-bold'>
                {visit.visitType === 'first' ? 'First' : 'Follow-up'} Antenatal
                Visit
              </Text>
              <Text className='text-white text-sm'>
                {formatDate(visit.visitDate)}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView className='flex-1 p-4'>
          {/* Patient Info */}
          {renderSection(
            'Patient Information',
            <View>
              <View className='flex-row items-center mb-3'>
                <User size={20} color='#2B7A78' />
                <Text className='ml-2 text-lg font-semibold text-gray-800'>
                  {visit.womanFullName}
                </Text>
              </View>
              {renderField('Age', `${visit.age} years`, true)}
              {renderField('Phone Number', visit.womanPhoneNumber, true)}
              {renderField('Village Address', visit.villageAddress, true)}
              {renderField("Husband's Name", visit.husbandName, true)}
              {renderField("Husband's Phone", visit.husbandPhoneNumber, true)}
              {renderField("Woman's Occupation", visit.womanOccupation, true)}
              {renderField(
                "Husband's Occupation",
                visit.husbandOccupation,
                true
              )}
              {renderField(
                "Woman's Education",
                visit.womanEducationLevel,
                true
              )}
              {renderField(
                "Husband's Education",
                visit.husbandEducationLevel,
                true
              )}
              {renderField('Marital Status', visit.maritalStatus, true)}
              {renderField(
                'Emergency Contact',
                visit.emergencyContactName,
                true
              )}
              {renderField(
                'Emergency Contact Relationship',
                visit.emergencyContactRelationship,
                true
              )}
            </View>
          )}

          {/* Obstetric History */}
          {renderSection(
            'Obstetric History',
            <View>
              {renderField('Total Pregnancies', visit.totalPregnancies, true)}
              {renderField(
                'Number of Live Births',
                visit.numberOfLiveBirths,
                true
              )}
              {renderField(
                'Previous Deliveries',
                visit.previousDeliveries,
                true
              )}
              {renderYesNoField('Previous Abortions', visit.previousAbortions)}
              {visit.previousAbortions === 'yes' &&
                visit.numberOfAbortions &&
                renderField('Number of Abortions', visit.numberOfAbortions)}
              {renderYesNoField(
                'Previous Stillbirths',
                visit.previousStillbirths
              )}
              {renderYesNoField(
                'Previous Cesarean Sections',
                visit.previousCesareanSections
              )}
              {visit.previousCesareanSections === 'yes' &&
                visit.numberOfCesareanSections &&
                renderField(
                  'Number of Cesarean Sections',
                  visit.numberOfCesareanSections
                )}
              {renderYesNoField(
                'Previous Vacuum/Forceps Delivery',
                visit.previousVacuumForcepsDelivery
              )}
              {renderYesNoField('Previous APH/PPH', visit.previousAPHPPH)}
              {renderYesNoField(
                'Previous Eclampsia/Pre-eclampsia',
                visit.previousEclampsiaPreeclampsia
              )}
              {renderYesNoField(
                'Previous Symphysiotomy/Fistula Repair',
                visit.previousSymphysiotomyFistulaRepair
              )}
              {renderField(
                'Last Menstrual Period',
                visit.lastMenstrualPeriod,
                true
              )}
              {renderField(
                'Estimated Date of Delivery',
                visit.estimatedDateOfDelivery,
                true
              )}
              {visit.birthWeightOfLastChild &&
                renderField(
                  'Birth Weight of Last Child',
                  `${visit.birthWeightOfLastChild} kg`
                )}
              {visit.intervalSinceLastDelivery &&
                renderField(
                  'Interval Since Last Delivery',
                  `${visit.intervalSinceLastDelivery} years`
                )}
            </View>
          )}

          {/* Medical History */}
          {renderSection(
            'Medical History',
            <View>
              {renderYesNoField('Hypertension', visit.hypertension)}
              {renderYesNoField('Diabetes', visit.diabetes)}
              {renderYesNoField('Asthma', visit.asthma)}
              {renderYesNoField('Epilepsy', visit.epilepsy)}
              {renderYesNoField(
                'Kidney/Renal Disease',
                visit.kidneyRenalDisease
              )}
              {renderYesNoField('Sickle Cell Disease', visit.sickleCellDisease)}
              {renderYesNoField('Sickle Cell Trait', visit.sickleCellTrait)}
              {renderYesNoField('Tuberculosis', visit.tuberculosis)}
              {renderYesNoField('Heart Disease', visit.heartDisease)}
              {renderYesNoField('Thyroid Problems', visit.thyroidProblems)}
              {renderYesNoField('Chronic Anaemia', visit.chronicAnaemia)}
              {renderYesNoField('Blood Transfusions', visit.bloodTransfusions)}
              {renderField('HIV Status', visit.hivStatus, true)}
              {renderField('Hepatitis B Status', visit.hepatitisBStatus, true)}
              {renderYesNoField('Recent Malaria', visit.recentMalaria)}
              {renderYesNoField(
                'Other Chronic Illness',
                visit.otherChronicIllness
              )}
              {visit.otherChronicIllness === 'yes' &&
                visit.otherChronicIllnessDetails &&
                renderField(
                  'Other Illness Details',
                  visit.otherChronicIllnessDetails
                )}
            </View>
          )}

          {/* Laboratory Investigations */}
          {renderSection(
            'Laboratory Investigations',
            <View>
              {visit.bloodGroupRhesus &&
                renderField('Blood Group & Rhesus', visit.bloodGroupRhesus)}
              {visit.haemoglobinLevel &&
                renderField(
                  'Haemoglobin Level',
                  `${visit.haemoglobinLevel} g/dL`
                )}
              {renderField('HIV Test Result', visit.hivTestResult, true)}
              {visit.hivTestDate &&
                renderField('HIV Test Date', visit.hivTestDate)}
              {renderField(
                'Syphilis Test Result',
                visit.syphilisTestResult,
                true
              )}
              {visit.syphilisTestDate &&
                renderField('Syphilis Test Date', visit.syphilisTestDate)}
              {renderField(
                'Hepatitis B Test Result',
                visit.hepatitisBTestResult,
                true
              )}
              {visit.hepatitisBTestDate &&
                renderField('Hepatitis B Test Date', visit.hepatitisBTestDate)}
              {renderField(
                'Malaria Test Result',
                visit.malariaTestResult,
                true
              )}
              {visit.malariaTestDate &&
                renderField('Malaria Test Date', visit.malariaTestDate)}
            </View>
          )}

          {/* Current Pregnancy Details */}
          {renderSection(
            'Current Pregnancy Details',
            <View>
              {renderField(
                'Current Gestation Weeks',
                `${visit.currentGestationWeeks} weeks`,
                true
              )}
              {visit.bloodPressure &&
                renderField('Blood Pressure', visit.bloodPressure)}
              {visit.weight && renderField('Weight', `${visit.weight} kg`)}
              {visit.fundalHeight &&
                renderField('Fundal Height', `${visit.fundalHeight} cm`)}
              {visit.fetalHeartRate &&
                renderField('Fetal Heart Rate', `${visit.fetalHeartRate} bpm`)}
              {visit.fetalMovement &&
                renderField('Fetal Movement', visit.fetalMovement)}
              {visit.urineTest && renderField('Urine Test', visit.urineTest)}
              {visit.notes && renderField('Notes', visit.notes)}
            </View>
          )}

          {/* Delivery Plan */}
          {renderSection(
            'Delivery Plan',
            <View>
              {renderField(
                'Planned Delivery Place',
                visit.plannedDeliveryPlace,
                true
              )}
              {visit.plannedDeliveryPlace === 'health-facility' &&
                visit.healthFacilityName &&
                renderField('Health Facility Name', visit.healthFacilityName)}
              {visit.plannedDeliveryPlace === 'other' &&
                visit.otherDeliveryPlace &&
                renderField('Other Delivery Place', visit.otherDeliveryPlace)}
              {renderYesNoField(
                'Transport Plan for Emergencies',
                visit.transportPlanForEmergencies
              )}
            </View>
          )}

          {/* Risk Assessment */}
          {renderSection(
            'Risk Assessment',
            <View>
              {renderYesNoField('Identified Risks', visit.identifiedRisks)}
              {visit.identifiedRisks === 'yes' &&
                visit.specifiedRisks &&
                renderField('Specified Risks', visit.specifiedRisks)}
              {renderYesNoField(
                'Referral to Higher Level',
                visit.referralToHigherLevel
              )}
              {visit.referralToHigherLevel === 'yes' &&
                visit.referralReason &&
                renderField('Referral Reason', visit.referralReason)}
              {renderHealthEducationTopics()}
            </View>
          )}

          {/* Visit Metadata */}
          {renderSection(
            'Visit Information',
            <View>
              {renderField(
                'Visit Type',
                visit.visitType === 'first' ? 'First Visit' : 'Follow-up Visit'
              )}
              {renderField('Visit Date', formatDate(visit.visitDate))}
              {renderField('Created', formatDate(visit.createdAt))}
              {renderField('Last Updated', formatDate(visit.updatedAt))}
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View className='p-4 bg-white border-t border-gray-200'>
          <TouchableOpacity
            className='bg-primary-500 py-3 rounded-lg mb-3'
            onPress={() => {
              const hasFirstVisit = visit.visitType === 'first'
              if (hasFirstVisit) {
                router.push(`/visit/${id}/follow-up`)
              } else {
                router.push(`/visit/${id}/first`)
              }
            }}
          >
            <Text className='text-white font-bold text-center'>
              {visit.visitType === 'first'
                ? 'Schedule Follow-up Visit'
                : 'Schedule First Visit'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className='bg-gray-300 py-3 rounded-lg'
            onPress={() => router.push(`/patient/${id}`)}
          >
            <Text className='text-gray-800 font-bold text-center'>
              Back to Patient Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default VisitSummaryScreen
