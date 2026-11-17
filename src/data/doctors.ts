import type { ImageMetadata } from 'astro';

/**
 * Medical team.
 *
 * This list is intentionally EMPTY. Add only real, clinic-verified doctors.
 * Never publish names, qualifications, registration numbers or schedules
 * that the clinic has not confirmed in writing.
 *
 * Example entry (copy, uncomment and fill in):
 *
 *   {
 *     name: 'Dr. Full Name',
 *     qualifications: 'MBBS, MD (Dermatology)',
 *     speciality: 'dermatology',          // slug from src/data/specialities.ts
 *     role: 'Consultant Dermatologist',
 *     registrationNo: 'TCMC 12345',        // optional, as shown on certificate
 *     schedule: [{ days: 'Mon, Wed, Fri', time: '10:00 AM – 1:00 PM' }],
 *     photo: doctorPhoto,                  // import from '@/assets/images/doctors/…'
 *     photoAlt: 'Portrait of Dr. Full Name',
 *   },
 */
export interface Doctor {
  name: string;
  qualifications: string;
  speciality: string;
  role: string;
  registrationNo?: string;
  schedule?: readonly { days: string; time: string }[];
  photo?: ImageMetadata;
  photoAlt?: string;
}

export const doctors: readonly Doctor[] = [];
