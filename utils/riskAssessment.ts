// Utility for numeric risk triggers extraction (TypeScript version of map_numeric_triggers)
export interface NumericTriggerResult {
  triggers: string[];
  tags: string[];
  actions: string[];
}

export function mapNumericTriggers(form: Record<string, any>): NumericTriggerResult {
  const triggers: string[] = [];
  const tags: string[] = [];
  const actions: string[] = [];

  // I. Demographics
  const age = Number(form.age);
  if (!isNaN(age)) {
    if (age < 18) {
      triggers.push('Adolescent pregnancy (age < 18)');
      tags.push('adolescent_pregnancy');
      actions.push('counsel_adolescent_risk');
    }
    if (age >= 35) {
      triggers.push('Advanced maternal age (>= 35)');
      tags.push('advanced_maternal_age');
      actions.push('counsel_age_risk');
    }
  }

  // II. Obstetric History
  const tp = Number(form.total_pregnancies);
  if (!isNaN(tp) && tp > 5) {
    triggers.push(`Grand multipara (total pregnancies = ${tp})`);
    tags.push('grand_multipara');
    actions.push('plan_high_parity_care');
  }

  const prev_deliv = Number(form.previous_deliveries);
  if (!isNaN(prev_deliv)) {
    if (prev_deliv === 0) {
      triggers.push('Nulliparity (no prior deliveries)');
      tags.push('nullipara');
      actions.push('counsel_nullipara_risk');
    } else if (prev_deliv >= 3) {
      triggers.push(`High parity (previous deliveries = ${prev_deliv})`);
      tags.push('high_parity');
      actions.push('monitor_parity_risks');
    }
  }

  const abortions = Number(form.previous_abortions) || 0;
  if (abortions > 0) {
    triggers.push(`History of abortion(s): ${abortions}`);
    tags.push('previous_abortion');
    actions.push('counsel_family_planning');
  }

  const stillbirths = Number(form.previous_stillbirths) || 0;
  if (stillbirths > 0) {
    triggers.push(`History of stillbirth(s): ${stillbirths}`);
    tags.push('previous_stillbirth');
    actions.push('refer_for_stillbirth_care');
  }

  const csecs = Number(form.previous_c_sections) || 0;
  if (csecs > 0) {
    triggers.push(`Previous caesarean section(s): ${csecs}`);
    tags.push('previous_c_section');
    actions.push('plan_facility_delivery');
  }

  const instr = Number(form.previous_vacuum_forceps) || 0;
  if (instr > 0) {
    triggers.push('History of instrumental delivery');
    tags.push('instrumental_delivery');
    actions.push('monitor_for_delivery_injuries');
  }

  const hemorrhage = form.previous_hemorrhage;
  if (hemorrhage) {
    triggers.push('History of antenatal/postpartum hemorrhage');
    tags.push('aph_pph_history');
    actions.push('prepare_hemorrhage_protocol');
  }

  const eclampsia = form.previous_pre_eclampsia;
  if (eclampsia) {
    triggers.push('History of eclampsia/pre‑eclampsia');
    tags.push('pre_eclampsia');
    actions.push('monitor_bp');
  }

  const fistula = form.previous_fistula_repair;
  if (fistula) {
    triggers.push('History of symphysiotomy/fistula repair');
    tags.push('fistula_repair_history');
    actions.push('refer_for_urology_followup');
  }

  const interval = Number(form.interval_since_last_delivery);
  if (!isNaN(interval) && interval < 2) {
    triggers.push(`Short inter‑pregnancy interval (${interval} years)`);
    tags.push('short_pregnancy_interval');
    actions.push('counsel_optimal_interval');
  }

  const bw = Number(form.birth_weight_last_child);
  if (!isNaN(bw) && bw < 2.5) {
    triggers.push(`Prior low birth weight infant (${bw} kg)`);
    tags.push('previous_low_birth_weight');
    actions.push('monitor_fetal_growth');
  }

  // III. Medical History – Numeric labs
  const hb = Number(form.haemoglobin);
  if (!isNaN(hb)) {
    if (hb < 7) {
      triggers.push(`Severe anemia (Hb = ${hb} g/dL)`);
      tags.push('severe_anemia');
      actions.push('refer_for_anaemia_management');
    } else if (hb < 11) {
      triggers.push(`Mild/moderate anemia (Hb = ${hb} g/dL)`);
      tags.push('anemia');
      actions.push('start_iron');
    }
  }

  // IV. Vital Signs
  const sys = Number(form.bp_systolic);
  const dia = Number(form.bp_diastolic);
  if (!isNaN(sys) && !isNaN(dia)) {
    if (sys >= 160 || dia >= 110) {
      triggers.push(`Severe hypertension (BP = ${sys}/${dia})`);
      tags.push('severe_hypertension');
      actions.push('urgent_refer');
    } else if (sys >= 140 || dia >= 90) {
      triggers.push(`Gestational hypertension (BP = ${sys}/${dia})`);
      tags.push('hypertension');
      actions.push('manage_bp');
    }
  }

  return { triggers, tags, actions };
}
