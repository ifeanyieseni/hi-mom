import { PatientForm } from '@/types/patients'
import {
  assessRiskWithLocalAPI,
  LocalRiskAssessmentResponse,
} from './localRiskAssessment'

/**
 * Transform PatientForm data to match the Python risk assessment function format
 */
function transformFormDataForRiskAssessment(data: PatientForm) {
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

    // Medical History & Lab Results
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
 * Implement the Python risk assessment logic in TypeScript
 */
function mapNumericTriggers(form: any): {
  triggers: RiskTrigger[]
  riskScore: number
} {
  const triggers: RiskTrigger[] = []
  let riskScore = 0

  // I. Demographics
  const age = form.age
  if (age !== undefined) {
    if (age < 18) {
      triggers.push({
        message: 'Adolescent pregnancy (age < 18)',
        tag: 'adolescent_pregnancy',
        action: 'counsel_adolescent_risk',
      })
      riskScore += 2
    }
    if (age >= 35) {
      triggers.push({
        message: 'Advanced maternal age (>= 35)',
        tag: 'advanced_maternal_age',
        action: 'counsel_age_risk',
      })
      riskScore += 2
    }
  }

  // II. Obstetric History
  const tp = form.total_pregnancies
  if (tp !== undefined && tp > 5) {
    triggers.push({
      message: `Grand multipara (total pregnancies = ${tp})`,
      tag: 'grand_multipara',
      action: 'plan_high_parity_care',
    })
    riskScore += 3
  }

  const prevDeliv = form.previous_deliveries
  if (prevDeliv === 0) {
    triggers.push({
      message: 'Nulliparity (no prior deliveries)',
      tag: 'nullipara',
      action: 'counsel_nullipara_risk',
    })
    riskScore += 1
  } else if (prevDeliv !== undefined && prevDeliv >= 3) {
    triggers.push({
      message: `High parity (previous deliveries = ${prevDeliv})`,
      tag: 'high_parity',
      action: 'monitor_parity_risks',
    })
    riskScore += 2
  }

  const abortions = form.previous_abortions || 0
  if (abortions > 0) {
    triggers.push({
      message: `History of abortion(s): ${abortions}`,
      tag: 'previous_abortion',
      action: 'counsel_family_planning',
    })
    riskScore += 1
  }

  const stillbirths = form.previous_stillbirths || 0
  if (stillbirths > 0) {
    triggers.push({
      message: `History of stillbirth(s): ${stillbirths}`,
      tag: 'previous_stillbirth',
      action: 'refer_for_stillbirth_care',
    })
    riskScore += 3
  }

  const csecs = form.previous_c_sections || 0
  if (csecs > 0) {
    triggers.push({
      message: `Previous caesarean section(s): ${csecs}`,
      tag: 'previous_c_section',
      action: 'plan_facility_delivery',
    })
    riskScore += 2
  }

  const instr = form.previous_vacuum_forceps || 0
  if (instr > 0) {
    triggers.push({
      message: 'History of instrumental delivery',
      tag: 'instrumental_delivery',
      action: 'monitor_for_delivery_injuries',
    })
    riskScore += 1
  }

  const hemorrhage = form.previous_hemorrhage
  if (hemorrhage) {
    triggers.push({
      message: 'History of antenatal/postpartum hemorrhage',
      tag: 'aph_pph_history',
      action: 'prepare_hemorrhage_protocol',
    })
    riskScore += 3
  }

  const eclampsia = form.previous_pre_eclampsia
  if (eclampsia) {
    triggers.push({
      message: 'History of eclampsia/pre‑eclampsia',
      tag: 'pre_eclampsia',
      action: 'monitor_bp',
    })
    riskScore += 3
  }

  const fistula = form.previous_fistula_repair
  if (fistula) {
    triggers.push({
      message: 'History of symphysiotomy/fistula repair',
      tag: 'fistula_repair_history',
      action: 'refer_for_urology_followup',
    })
    riskScore += 2
  }

  const interval = form.interval_since_last_delivery
  if (interval !== undefined && interval < 2) {
    triggers.push({
      message: `Short inter‑pregnancy interval (${interval} years)`,
      tag: 'short_pregnancy_interval',
      action: 'counsel_optimal_interval',
    })
    riskScore += 2
  }

  const bw = form.birth_weight_last_child
  if (bw !== undefined && bw < 2.5) {
    triggers.push({
      message: `Prior low birth weight infant (${bw} kg)`,
      tag: 'previous_low_birth_weight',
      action: 'monitor_fetal_growth',
    })
    riskScore += 2
  }

  // III. Medical History – Numeric labs
  const hb = form.haemoglobin
  if (hb !== undefined) {
    if (hb < 7) {
      triggers.push({
        message: `Severe anemia (Hb = ${hb} g/dL)`,
        tag: 'severe_anemia',
        action: 'refer_for_anaemia_management',
      })
      riskScore += 4
    } else if (hb < 11) {
      triggers.push({
        message: `Mild/moderate anemia (Hb = ${hb} g/dL)`,
        tag: 'anemia',
        action: 'start_iron',
      })
      riskScore += 2
    }
  }

  // IV. Vital Signs
  const sys = form.bp_systolic
  const dia = form.bp_diastolic
  if (sys !== undefined && dia !== undefined) {
    if (sys >= 160 || dia >= 110) {
      triggers.push({
        message: `Severe hypertension (BP = ${sys}/${dia})`,
        tag: 'severe_hypertension',
        action: 'urgent_refer',
      })
      riskScore += 4
    } else if (sys >= 140 || dia >= 90) {
      triggers.push({
        message: `Gestational hypertension (BP = ${sys}/${dia})`,
        tag: 'hypertension',
        action: 'manage_bp',
      })
      riskScore += 3
    }
  }

  return { triggers, riskScore }
}

/**
 * Calculate overall risk level based on risk score
 */
function calculateRiskLevel(riskScore: number): 'low' | 'medium' | 'high' {
  if (riskScore >= 8) return 'high'
  if (riskScore >= 4) return 'medium'
  return 'low'
}

/**
 * Main risk assessment function - now uses local API instead of DeepSeek
 */
export async function assessPatientRisk(
  formData: PatientForm
): Promise<RiskAssessmentResponse> {
  try {
    // Call the local risk assessment API
    const localResult = await assessRiskWithLocalAPI(formData)

    // Transform local API response to match existing interface
    return {
      riskLevel: localResult.risk_level,
      triggers: [], // Local API doesn't return triggers, but we can keep empty for compatibility
      aiRecommendations: [localResult.recommendations], // Convert string to array
      clinicalActions: localResult.risk_factors_found, // Use risk factors as clinical actions
      summary: `Risk Level: ${localResult.risk_level}. ${localResult.risk_factors_found.length} risk factors identified.`,
    }
  } catch (error) {
    console.error('Local risk assessment error:', error)

    // Return safe fallback
    return {
      riskLevel: 'medium',
      triggers: [],
      aiRecommendations: [
        'Risk assessment temporarily unavailable. Please follow standard antenatal care protocols.',
      ],
      clinicalActions: ['follow_standard_care'],
      summary: 'Risk assessment service temporarily unavailable',
    }
  }
}

export interface RiskTrigger {
  message: string
  tag: string
  action: string
}

export interface RiskAssessmentResponse {
  riskLevel: 'low' | 'medium' | 'high'
  triggers: RiskTrigger[]
  aiRecommendations: string[]
  clinicalActions: string[]
  summary: string
}
