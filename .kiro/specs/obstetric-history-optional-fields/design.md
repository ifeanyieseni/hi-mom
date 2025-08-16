# Design Document

## Overview

This design document outlines the implementation approach for making obstetric history fields appropriately optional in the Patient Onboarding Form. The solution focuses on improving user experience by distinguishing between essential fields (required for risk assessment) and contextual fields (only relevant when applicable), while maintaining data integrity and risk assessment accuracy.

## Architecture

### Field Classification System

Fields in the obstetric history step will be classified into three categories:

1. **Always Required**: Critical for risk assessment and patient safety
   - Last Menstrual Period (LMP)
   - Estimated Date of Delivery (EDD)
   - Total Number of Pregnancies
   - Number of Live Births

2. **Conditionally Required**: Required only when certain conditions are met
   - Abortion count (required when hasAbortions = true)
   - Cesarean count (required when hadCesarean = true)

3. **Always Optional**: Contextual information that enhances care but isn't critical
   - Previous complications (stillbirths, vacuum/forceps, APH/PPH, etc.)
   - Previous birth details (weight, interval since last delivery)

### Validation Strategy

The validation will be implemented using a multi-layered approach:

1. **Schema-level validation**: Update Zod schema to reflect optional fields
2. **Form-level validation**: Custom validation logic in the form component
3. **UI-level indicators**: Visual cues to distinguish required vs optional fields

## Components and Interfaces

### Updated Zod Schema

```typescript
obstetricHistory: z.object({
  // Always required
  totalPregnancies: z.number().min(0, 'Total pregnancies is required'),
  numberOfLiveBirths: z.number().min(0, 'Number of live births is required'),
  lastMenstrualPeriod: z.string().min(1, 'Last menstrual period is required'),
  estimatedDateOfDelivery: z
    .string()
    .min(1, 'Estimated delivery date is required'),

  // Conditionally required
  numberOfPreviousDeliveries: z.enum(['0', '1', '2', '3+']).optional(),
  previousAbortions: z.object({
    hasAbortions: z.boolean(),
    countIfYes: z
      .number()
      .optional()
      .refine((val, ctx) => {
        const hasAbortions = ctx.parent.hasAbortions
        if (hasAbortions && (val === undefined || val <= 0)) {
          return false
        }
        return true
      }, 'Count is required when abortions are indicated'),
  }),
  previousCesareanSections: z.object({
    hadCesarean: z.boolean(),
    countIfYes: z
      .number()
      .optional()
      .refine((val, ctx) => {
        const hadCesarean = ctx.parent.hadCesarean
        if (hadCesarean && (val === undefined || val <= 0)) {
          return false
        }
        return true
      }, 'Count is required when cesarean sections are indicated'),
  }),

  // Always optional
  previousStillbirths: z.boolean().optional(),
  previousVacuumForcepsDelivery: z.boolean().optional(),
  previousAPHPPH: z.boolean().optional(),
  previousEclampsiaPreeclampsia: z.boolean().optional(),
  previousSymphysiotomyFistulaRepair: z.boolean().optional(),
  lastBirthWeightKg: z.coerce.number().optional(),
  intervalSinceLastDeliveryYears: z.coerce.number().optional(),
})
```

### Form Validation Logic

```typescript
const validateObstetricHistory = (data: PatientForm['obstetricHistory']) => {
  const errors: string[] = []

  // Always required fields
  if (!data.lastMenstrualPeriod) {
    errors.push('Last Menstrual Period is required')
  }
  if (!data.estimatedDateOfDelivery) {
    errors.push('Estimated Date of Delivery is required')
  }
  if (data.totalPregnancies === undefined || data.totalPregnancies < 0) {
    errors.push('Total pregnancies is required')
  }
  if (data.numberOfLiveBirths === undefined || data.numberOfLiveBirths < 0) {
    errors.push('Number of live births is required')
  }

  // Conditional validation
  if (
    data.previousAbortions?.hasAbortions &&
    !data.previousAbortions.countIfYes
  ) {
    errors.push('Number of abortions is required when abortions are indicated')
  }
  if (
    data.previousCesareanSections?.hadCesarean &&
    !data.previousCesareanSections.countIfYes
  ) {
    errors.push(
      'Number of cesarean sections is required when cesarean sections are indicated'
    )
  }

  return errors
}
```

### UI Component Updates

#### Field Labeling System

- Required fields: Label with red asterisk (\*)
- Optional fields: Label with "(Optional)" suffix
- Conditionally required: Dynamic asterisk based on parent field state

#### Visual Indicators

```typescript
interface FieldLabelProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  conditionallyRequired?: boolean;
}

const FieldLabel: React.FC<FieldLabelProps> = ({
  label,
  required,
  optional,
  conditionallyRequired
}) => (
  <Text className="text-sm font-medium text-slate-700 mb-2">
    {label}
    {required && <Text className="text-red-500 ml-1">*</Text>}
    {optional && <Text className="text-slate-500 ml-1">(Optional)</Text>}
    {conditionallyRequired && <Text className="text-orange-500 ml-1">*</Text>}
  </Text>
);
```

## Data Models

### Default Values Strategy

For optional fields that are left empty, the system will use appropriate default values:

```typescript
const getDefaultObstetricValues = () => ({
  previousStillbirths: false,
  previousVacuumForcepsDelivery: false,
  previousAPHPPH: false,
  previousEclampsiaPreeclampsia: false,
  previousSymphysiotomyFistulaRepair: false,
  lastBirthWeightKg: null,
  intervalSinceLastDeliveryYears: null,
})
```

### Risk Assessment Integration

The risk assessment algorithm will be updated to handle optional fields gracefully:

```typescript
const calculateRiskScore = (patientData: PatientForm) => {
  const obstetricHistory = patientData.obstetricHistory

  // Use default "no risk" values for optional fields that are null/undefined
  const complications = {
    stillbirths: obstetricHistory.previousStillbirths ?? false,
    vacuumForceps: obstetricHistory.previousVacuumForcepsDelivery ?? false,
    hemorrhage: obstetricHistory.previousAPHPPH ?? false,
    preeclampsia: obstetricHistory.previousEclampsiaPreeclampsia ?? false,
    surgicalHistory:
      obstetricHistory.previousSymphysiotomyFistulaRepair ?? false,
  }

  // Continue with risk calculation using safe defaults
  return calculateRisk(complications)
}
```

## Error Handling

### Validation Error Messages

Clear, contextual error messages will be provided:

1. **Missing required fields**: "This field is required for patient safety assessment"
2. **Missing conditional fields**: "Please provide count when [condition] is selected"
3. **Invalid data**: "Please enter a valid [field type]"

### Form Submission Handling

```typescript
const handleFormSubmission = async (data: PatientForm) => {
  try {
    // Validate required fields
    const validationErrors = validateObstetricHistory(data.obstetricHistory)

    if (validationErrors.length > 0) {
      throw new ValidationError(validationErrors)
    }

    // Fill in default values for optional fields
    const processedData = {
      ...data,
      obstetricHistory: {
        ...data.obstetricHistory,
        ...getDefaultObstetricValues(),
      },
    }

    // Proceed with submission
    await savePatientData(processedData)
  } catch (error) {
    handleSubmissionError(error)
  }
}
```

## Testing Strategy

### Unit Tests

1. **Schema Validation Tests**
   - Test required field validation
   - Test conditional field validation
   - Test optional field handling

2. **Form Component Tests**
   - Test field rendering based on requirements
   - Test validation message display
   - Test form submission with various field combinations

3. **Risk Assessment Tests**
   - Test risk calculation with missing optional fields
   - Test default value application
   - Test edge cases with minimal data

### Integration Tests

1. **End-to-End Form Flow**
   - Complete form with all fields
   - Complete form with minimal required fields only
   - Complete form with mixed required/optional fields

2. **Data Persistence Tests**
   - Verify correct data storage with optional fields
   - Verify default value application in database
   - Verify data retrieval and display

### User Acceptance Testing Scenarios

1. **First-time mother registration**
   - Should be able to complete form with minimal obstetric history
   - Should not be forced to enter irrelevant previous pregnancy data

2. **Experienced mother registration**
   - Should be guided to provide relevant historical information
   - Should have clear indicators of what information is critical

3. **Incomplete information scenarios**
   - Should be able to proceed when optional information is unavailable
   - Should be blocked only when critical information is missing

## Implementation Considerations

### Backward Compatibility

Existing patient records will be handled gracefully:

- Missing optional fields will be treated as "false" or "null" appropriately
- No data migration required for existing records
- Risk assessments will continue to work with existing data

### Performance Impact

The changes will have minimal performance impact:

- Schema validation remains efficient
- Additional conditional logic is lightweight
- No additional database queries required

### Accessibility

The design ensures accessibility compliance:

- Screen readers will announce field requirements clearly
- Visual indicators are supplemented with text labels
- Form navigation remains keyboard-friendly
