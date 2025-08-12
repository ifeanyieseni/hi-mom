import { PatientForm } from '@/types/patients'

export interface LocalRiskAssessmentResponse {
  risk_level: 'low' | 'medium' | 'high'
  risk_factors_found: string[]
  recommendations: string
}

/**
 * Transform PatientForm data to match the local API format
 */
function transformFormDataForLocalAPI(data: PatientForm) {
  return {
    // Demographics
    age: data.demographicAndContactInformation.age,

    // Obstetric History
    total_pregnancies: data.obstetricHistory.totalPregnancies,
    previous_deliveries:
      parseInt(data.obstetricHistory.numberOfPreviousDeliveries) || 0,
    previous_abortions: data.obstetricHistory.previousAbortions.hasAbortions
      ? data.obstetricHistory.previousAbortions.countIfYes || 1
      : 0,
    previous_stillbirths: data.obstetricHistory.previousStillbirths ? 1 : 0,
    previous_c_sections: data.obstetricHistory.previousCesareanSections
      .hadCesarean
      ? data.obstetricHistory.previousCesareanSections.countIfYes || 1
      : 0,
    previous_vacuum_forceps: data.obstetricHistory.previousVacuumForcepsDelivery
      ? 1
      : 0,
    previous_hemorrhage: data.obstetricHistory.previousAPHPPH ? 1 : 0,
    previous_pre_eclampsia: data.obstetricHistory.previousEclampsiaPreeclampsia
      ? 1
      : 0,
    previous_fistula_repair: data.obstetricHistory
      .previousSymphysiotomyFistulaRepair
      ? 1
      : 0,
    interval_since_last_delivery:
      data.obstetricHistory.intervalSinceLastDeliveryYears || 0,
    birth_weight_last_child: data.obstetricHistory.lastBirthWeightKg || 0,

    // Medical History
    hypertension: data.medicalHistory.hypertension ? 1 : 0,
    diabetes: data.medicalHistory.diabetes ? 1 : 0,
    asthma: data.medicalHistory.asthma ? 1 : 0,
    epilepsy: data.medicalHistory.epilepsy ? 1 : 0,
    kidney_renal_disease: data.medicalHistory.kidneyRenalDisease ? 1 : 0,
    sickle_cell_disease: data.medicalHistory.sickleCellDisease ? 1 : 0,
    sickle_cell_trait: data.medicalHistory.sickleCellTrait ? 1 : 0,
    tuberculosis: data.medicalHistory.tuberculosis ? 1 : 0,
    heart_disease: data.medicalHistory.heartDisease ? 1 : 0,
    thyroid_problems: data.medicalHistory.thyroidProblems ? 1 : 0,
    chronic_anaemia: data.medicalHistory.chronicAnaemia ? 1 : 0,
    blood_transfusions: data.medicalHistory.bloodTransfusions ? 1 : 0,
    hiv_status: data.medicalHistory.hivStatus === 'Positive' ? 1 : 0,
    hepatitis_b_status: data.medicalHistory.hepatitisBStatus === 'Positive' ? 1 : 0,
    recent_malaria: data.medicalHistory.recentMalariaEpisodes ? 1 : 0,

    // Laboratory Results
    haemoglobin: data.laboratoryInvestigations.haemoglobinLevel || 0,

    // Current Pregnancy - Vital Signs
    bp_systolic: data.currentPregnancyDetails.bloodPressure
      ? parseInt(data.currentPregnancyDetails.bloodPressure.split('/')[0])
      : 0,
    bp_diastolic: data.currentPregnancyDetails.bloodPressure
      ? parseInt(data.currentPregnancyDetails.bloodPressure.split('/')[1])
      : 0,

    // Current gestation
    gestation_weeks: data.currentPregnancyDetails.currentGestationWeeks || 0,
  }
}

/**
 * Call the local risk assessment API
 */
export async function assessRiskWithLocalAPI(
  formData: PatientForm
): Promise<LocalRiskAssessmentResponse> {
  try {
    const transformedData = transformFormDataForLocalAPI(formData)
    
    const response = await fetch('http://127.0.0.1:8000/assess_risk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData),
    })

    if (!response.ok) {
      throw new Error(`Risk assessment API failed: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Local risk assessment failed:', error)
    throw error
  }
}
