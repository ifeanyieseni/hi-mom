import { useEffect } from 'react';

export default function usePrefillAntenatalForm(source: any, setValue: (field: string, value: any) => void) {
  useEffect(() => {
    if (source) {
      // Demographic and Contact Information
      setValue('womanFullName', source.womanFullName || source.name || '');
      setValue('age', source.age ? String(source.age) : '');
      setValue('villageAddress', source.villageAddress || source.address || '');
      setValue('womanPhoneNumber', source.womanPhoneNumber || source.phoneNumber || '');
      setValue('husbandName', source.husbandName || '');
      setValue('husbandPhoneNumber', source.husbandPhoneNumber || '');
      setValue('womanOccupation', source.womanOccupation || '');
      setValue('husbandOccupation', source.husbandOccupation || '');
      setValue('womanEducationLevel', source.womanEducationLevel || '');
      setValue('husbandEducationLevel', source.husbandEducationLevel || '');
      setValue('maritalStatus', source.maritalStatus || 'married');
      setValue('emergencyContactName', source.emergencyContactName || '');
      setValue('emergencyContactRelationship', source.emergencyContactRelationship || '');
      // Obstetric History
      setValue('totalPregnancies', source.totalPregnancies || '');
      setValue('numberOfLiveBirths', source.numberOfLiveBirths || '');
      setValue('previousDeliveries', source.previousDeliveries || '0');
      setValue('previousAbortions', source.previousAbortions || 'no');
      setValue('numberOfAbortions', source.numberOfAbortions || '');
      setValue('previousStillbirths', source.previousStillbirths || 'no');
      setValue('previousCesareanSections', source.previousCesareanSections || 'no');
      setValue('numberOfCesareanSections', source.numberOfCesareanSections || '');
      setValue('previousVacuumForcepsDelivery', source.previousVacuumForcepsDelivery || 'no');
      setValue('previousAPHPPH', source.previousAPHPPH || 'no');
      setValue('previousEclampsiaPreeclampsia', source.previousEclampsiaPreeclampsia || 'no');
      setValue('previousSymphysiotomyFistulaRepair', source.previousSymphysiotomyFistulaRepair || 'no');
      setValue('lastMenstrualPeriod', source.lastMenstrualPeriod || '');
      setValue('estimatedDateOfDelivery', source.estimatedDateOfDelivery || '');
      setValue('birthWeightOfLastChild', source.birthWeightOfLastChild || '');
      setValue('intervalSinceLastDelivery', source.intervalSinceLastDelivery || '');
      // Medical History
      setValue('hypertension', source.hypertension || 'no');
      setValue('diabetes', source.diabetes || 'no');
      setValue('asthma', source.asthma || 'no');
      setValue('epilepsy', source.epilepsy || 'no');
      setValue('kidneyRenalDisease', source.kidneyRenalDisease || 'no');
      setValue('sickleCellDisease', source.sickleCellDisease || 'no');
      setValue('sickleCellTrait', source.sickleCellTrait || 'no');
      setValue('tuberculosis', source.tuberculosis || 'no');
      setValue('heartDisease', source.heartDisease || 'no');
      setValue('thyroidProblems', source.thyroidProblems || 'no');
      setValue('chronicAnaemia', source.chronicAnaemia || 'no');
      setValue('bloodTransfusions', source.bloodTransfusions || 'no');
      setValue('hivStatus', source.hivStatus || 'unknown');
      setValue('hepatitisBStatus', source.hepatitisBStatus || 'unknown');
      setValue('recentMalaria', source.recentMalaria || 'no');
      setValue('otherChronicIllness', source.otherChronicIllness || 'no');
      setValue('otherChronicIllnessDetails', source.otherChronicIllnessDetails || '');
      // Laboratory Investigations
      setValue('bloodGroupRhesus', source.bloodGroupRhesus || '');
      setValue('haemoglobinLevel', source.haemoglobinLevel || '');
      setValue('hivTestResult', source.hivTestResult || 'pending');
      setValue('hivTestDate', source.hivTestDate || '');
      setValue('syphilisTestResult', source.syphilisTestResult || 'pending');
      setValue('syphilisTestDate', source.syphilisTestDate || '');
      setValue('hepatitisBTestResult', source.hepatitisBTestResult || 'pending');
      setValue('hepatitisBTestDate', source.hepatitisBTestDate || '');
      setValue('malariaTestResult', source.malariaTestResult || 'na');
      setValue('malariaTestDate', source.malariaTestDate || '');
      // Delivery Plan
      setValue('plannedDeliveryPlace', source.plannedDeliveryPlace || 'health-facility');
      setValue('healthFacilityName', source.healthFacilityName || '');
      setValue('otherDeliveryPlace', source.otherDeliveryPlace || '');
      setValue('transportPlanForEmergencies', source.transportPlanForEmergencies || 'no');
      // Risk Assessment
      setValue('identifiedRisks', source.identifiedRisks || 'no');
      setValue('specifiedRisks', source.specifiedRisks || '');
      setValue('referralToHigherLevel', source.referralToHigherLevel || 'no');
      setValue('referralReason', source.referralReason || '');
      setValue('healthEducationTopics', source.healthEducationTopics || {
        nutritionDuringPregnancy: false,
        dangerSignsInPregnancy: false,
        birthPreparedness: false,
        exclusiveBreastfeeding: false,
        familyPlanning: false,
        postnatalCare: false,
        infantCare: false,
        malariaPrevention: false,
        hivPreventionPMTCT: false,
        other: false,
        otherDetails: '',
      });
      // Current Pregnancy Details
      setValue('currentGestationWeeks', source.currentGestationWeeks || '');
      setValue('bloodPressure', source.bloodPressure || '');
      setValue('weight', source.weight || '');
      setValue('fundalHeight', source.fundalHeight || '');
      setValue('fetalHeartRate', source.fetalHeartRate || '');
      setValue('fetalMovement', source.fetalMovement || '');
      setValue('urineTest', source.urineTest || '');
      setValue('notes', source.notes || '');
    }
  }, [source, setValue]);
} 