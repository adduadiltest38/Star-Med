import type { ImageMetadata } from 'astro';
import type { IconName } from './services';
import dermatologyImg from '@/assets/images/speciality-dermatology.png';
import cardiologyImg from '@/assets/images/speciality-cardiology.png';
import generalImg from '@/assets/images/speciality-general-medicine.png';

/**
 * Medical specialities. Add new departments here — they appear on the home
 * page, the Specialities page, the Services page and in structured data.
 *
 * Do NOT add doctor names, qualifications or schedules here; those belong in
 * src/data/doctors.ts and must be verified by the clinic.
 */
export interface Speciality {
  slug: string;
  name: string;
  /** Plain-language label, e.g. "Skin Specialist". */
  commonName: string;
  /** schema.org MedicalSpecialty enumeration value, when one exists. */
  schemaSpecialty?: string;
  icon: IconName;
  summary: string;
  description: string;
  /** Common reasons people consult this department (general, non-diagnostic). */
  commonConcerns: readonly string[];
  image: ImageMetadata;
  imageAlt: string;
  tone: 'blue' | 'teal' | 'green';
}

export const specialities: readonly Speciality[] = [
  {
    slug: 'dermatology',
    name: 'Dermatology',
    commonName: 'Skin Specialist',
    schemaSpecialty: 'Dermatologic',
    icon: 'skin',
    summary: 'Consultation for skin, hair and nail concerns.',
    description:
      'Our dermatology department offers consultation for a wide range of skin, hair and nail concerns. A skin specialist can assess your condition and recommend an appropriate plan of care.',
    commonConcerns: ['Skin rashes and allergies', 'Acne and pigmentation', 'Hair and scalp concerns', 'Nail conditions'],
    image: dermatologyImg,
    imageAlt: 'Illustration representing dermatology care — layered skin cross-section with a soft protective glow',
    tone: 'teal',
  },
  {
    slug: 'cardiology',
    name: 'Cardiology',
    commonName: 'Heart Specialist',
    schemaSpecialty: 'Cardiovascular',
    icon: 'heart',
    summary: 'Consultation focused on heart health, supported by on-site ECG.',
    description:
      'The cardiology department focuses on heart health. Consultation with a heart specialist, together with on-site ECG, helps assess heart activity and guide your next steps.',
    commonConcerns: ['Chest discomfort or palpitations', 'Blood pressure follow-up', 'Heart health check-ups', 'ECG review'],
    image: cardiologyImg,
    imageAlt: 'Illustration representing cardiology — a heart symbol with an ECG trace',
    tone: 'blue',
  },
  {
    slug: 'general-medicine',
    name: 'General Medicine',
    commonName: 'General Physician',
    schemaSpecialty: 'PrimaryCare',
    icon: 'medicine',
    summary: 'Everyday health concerns, initial assessment and ongoing care.',
    description:
      'General medicine is the foundation of good healthcare. Our doctors help with everyday illnesses, initial assessment of new symptoms and guidance on tests or specialist referral when needed.',
    commonConcerns: ['Fever, cough and common infections', 'New or unexplained symptoms', 'Routine health check-ups', 'Follow-up care'],
    image: generalImg,
    imageAlt: 'Illustration representing general medicine — a stethoscope and medical clipboard',
    tone: 'green',
  },
];

/** Shown as "coming soon" tiles. Edit freely or leave empty. */
export const upcomingSpecialities: readonly string[] = [];
