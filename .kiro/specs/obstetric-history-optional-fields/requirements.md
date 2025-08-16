# Requirements Document

## Introduction

This feature enhancement aims to improve the user experience of the Patient Onboarding Form by making certain obstetric history fields optional instead of mandatory. Currently, all obstetric history fields are required for form progression, which can create barriers for healthcare workers when some historical information is not available or not applicable to first-time mothers. This change will allow more flexible data collection while maintaining essential information capture for risk assessment.

## Requirements

### Requirement 1

**User Story:** As a healthcare worker, I want to be able to proceed through the obstetric history step even when some historical information is not available, so that I can complete patient registration without being blocked by missing non-critical data.

#### Acceptance Criteria

1. WHEN a healthcare worker is on the obstetric history step THEN the system SHALL allow progression to the next step without requiring all obstetric history fields to be filled
2. WHEN essential obstetric history fields (LMP and EDD) are missing THEN the system SHALL prevent progression and display appropriate validation messages
3. WHEN optional obstetric history fields are left empty THEN the system SHALL save the form with null/default values for those fields

### Requirement 2

**User Story:** As a healthcare worker registering a first-time mother, I want obstetric history fields that don't apply to be optional, so that I don't have to enter irrelevant information just to proceed with registration.

#### Acceptance Criteria

1. WHEN registering a patient with zero previous pregnancies THEN the system SHALL make previous delivery-related fields optional
2. WHEN a patient indicates no previous abortions THEN the system SHALL not require abortion count details
3. WHEN a patient indicates no previous cesarean sections THEN the system SHALL not require cesarean count details

### Requirement 3

**User Story:** As a healthcare worker, I want clear visual indicators of which obstetric history fields are required versus optional, so that I can efficiently complete the form and understand what information is critical.

#### Acceptance Criteria

1. WHEN viewing the obstetric history form THEN the system SHALL visually distinguish required fields from optional fields
2. WHEN validation fails THEN the system SHALL clearly indicate which required fields are missing
3. WHEN hovering over or focusing on optional fields THEN the system SHALL provide context about why the field is optional

### Requirement 4

**User Story:** As a system administrator, I want the risk assessment algorithm to continue working correctly with optional obstetric history fields, so that patient safety is not compromised by the flexibility changes.

#### Acceptance Criteria

1. WHEN optional obstetric history fields are empty THEN the risk assessment SHALL treat them as "no history" or use appropriate default values
2. WHEN calculating risk scores THEN the system SHALL account for missing optional data without throwing errors
3. WHEN generating patient summaries THEN the system SHALL handle optional fields gracefully in reports and displays
