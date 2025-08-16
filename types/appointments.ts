/**
 * Appointment type definitions
 */

export type AppointmentType = 'check-up' | 'vaccination' | 'emergency' | 'ultrasound' | 'other';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string; // ISO date string
  duration: number; // in minutes
  type: AppointmentType;
  location: string;
  notes?: string;
  completed?: boolean;
  attendees?: string;
}