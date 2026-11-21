/**
 * Clinic services.
 *
 *  - `enabled: false` hides a service everywhere (cards, pages, sitemap, schema).
 *  - `availabilityNote` shows a clearly marked notice on the card and page —
 *    use it for anything the clinic still needs to confirm (hours, scope).
 *  - Keep descriptions factual. Do not add claims the clinic cannot verify.
 */

export type IconName =
  | 'lab'
  | 'pharmacy'
  | 'stethoscope'
  | 'specialist'
  | 'ecg'
  | 'casualty'
  | 'observation'
  | 'procedures'
  | 'hospital'
  | 'homecare'
  | 'skin'
  | 'heart'
  | 'medicine'
  | 'shield'
  | 'location'
  | 'hand-heart'
  | 'clipboard'
  | 'pill-bottle'
  | 'test-tubes'
  | 'microscope'
  | 'clock'
  | 'users';

export interface Service {
  slug: string;
  name: string;
  /** Short name for compact lists, e.g. footer. */
  shortName?: string;
  icon: IconName;
  /** One-line card description. */
  summary: string;
  /** Longer intro paragraph for the service page. */
  description: string;
  /** What the service covers — bullet points. */
  includes: readonly string[];
  /** Optional notice shown with the service (e.g. hours to be confirmed). */
  availabilityNote?: string;
  /** Page SEO */
  seoTitle: string;
  seoDescription: string;
  /** Link to a dedicated page if one exists (e.g. /laboratory). */
  featuredPage?: string;
  /** Accent colour used for the icon tile. */
  tone: 'blue' | 'teal' | 'green';
  enabled: boolean;
}

const allServices: Service[] = [
  {
    slug: 'laboratory',
    name: 'Laboratory',
    icon: 'lab',
    summary: 'Diagnostic laboratory services and medical testing, with help for test-related enquiries.',
    description:
      'Our in-house diagnostic laboratory supports doctors and patients with routine medical testing. Having the laboratory in the same building as consultation means fewer trips and a smoother path from doctor’s advice to test.',
    includes: [
      'Diagnostic laboratory services',
      'Routine medical testing as advised by your doctor',
      'Help with test-related enquiries and sample instructions',
    ],
    seoTitle: 'Laboratory in Pallikkara — Diagnostic Tests',
    seoDescription:
      'Diagnostic laboratory services at Star Med Clinic, Pallikkara. Contact the clinic for test availability, sample instructions and test-related enquiries.',
    featuredPage: '/laboratory',
    tone: 'teal',
    enabled: true,
  },
  {
    slug: 'pharmacy',
    name: 'Pharmacy',
    icon: 'pharmacy',
    summary: 'On-site pharmacy for your prescriptions, with help on medicine availability.',
    description:
      'The Star Med pharmacy sits within the clinic, so you can collect prescribed medicines right after your consultation. Our pharmacy team can also help with questions about prescriptions and medicine availability.',
    includes: [
      'Pharmacy services within the clinic',
      'Prescription-related enquiries',
      'Medication availability enquiries',
    ],
    seoTitle: 'Pharmacy in Pallikkara — Prescriptions & Medicines',
    seoDescription:
      'On-site pharmacy at Star Med Clinic, Pallikkara. Ask about prescriptions and medicine availability before you visit.',
    featuredPage: '/pharmacy',
    tone: 'green',
    enabled: true,
  },
  {
    slug: 'general-consultation',
    name: 'General Consultation',
    icon: 'stethoscope',
    summary: 'General medical consultation and initial assessment for everyday health concerns.',
    description:
      'A general consultation is often the best first step. Our doctors listen to your concerns, carry out an initial assessment and advise on the next steps — whether that is treatment, tests at our laboratory or a specialist opinion.',
    includes: [
      'General medical consultation',
      'Initial patient assessment',
      'Guidance on tests and follow-up care',
      'Referral to a specialist where needed',
    ],
    seoTitle: 'Doctor Consultation in Pallikkara — General Medicine',
    seoDescription:
      'General doctor consultation at Star Med Clinic, Pallikkara. Initial assessment and guidance on next steps for everyday health concerns.',
    tone: 'blue',
    enabled: true,
  },
  {
    slug: 'specialist-consultation',
    name: 'Specialist Consultation',
    shortName: 'Specialists',
    icon: 'specialist',
    summary: 'Consultations with specialists including Dermatology and Cardiology, subject to availability.',
    description:
      'Star Med brings specialist consultation closer to home. Specialist departments include Dermatology (skin) and Cardiology (heart), with more departments added over time. Please contact the clinic to confirm specialist availability before your visit.',
    includes: [
      'Dermatology / Skin Specialist',
      'Cardiology / Heart Specialist',
      'Other specialist departments, subject to availability',
    ],
    availabilityNote: 'Specialist availability varies — please contact the clinic to confirm before visiting.',
    seoTitle: 'Specialist Consultation in Pallikkara — Skin & Heart',
    seoDescription:
      'Specialist consultation at Star Med Clinic, Pallikkara, including Dermatology (skin) and Cardiology (heart). Contact the clinic to confirm availability.',
    tone: 'teal',
    enabled: true,
  },
  {
    slug: 'ecg',
    name: 'ECG',
    icon: 'ecg',
    summary: 'Electrocardiogram (ECG) to record and assess your heart’s electrical activity.',
    description:
      'An electrocardiogram (ECG) is a quick, painless test that records the electrical activity of the heart. It helps your doctor assess heart rhythm and activity as part of your care.',
    includes: ['Electrocardiogram (ECG) services', 'Heart activity assessment', 'Results shared with your doctor'],
    seoTitle: 'ECG in Pallikkara — Electrocardiogram Test',
    seoDescription:
      'ECG (electrocardiogram) services at Star Med Clinic, Pallikkara. A quick, painless test to help assess heart activity.',
    tone: 'blue',
    enabled: true,
  },
  {
    slug: 'casualty',
    name: 'Casualty',
    icon: 'casualty',
    summary: 'Casualty services for urgent medical care during clinic-confirmed hours.',
    description:
      'Our casualty service provides prompt attention for urgent medical needs. Availability and operating hours of the casualty service are confirmed by the clinic — please call ahead where possible. In a life-threatening emergency, call 112 or go to the nearest hospital emergency department.',
    includes: ['Casualty care for urgent medical needs', 'Initial assessment and stabilisation', 'Referral where required'],
    availabilityNote: 'Casualty hours to be confirmed by the clinic. In a life-threatening emergency, call 112.',
    seoTitle: 'Casualty Services in Pallikkara',
    seoDescription:
      'Casualty services at Star Med Clinic, Pallikkara. Contact the clinic to confirm current availability and hours.',
    tone: 'green',
    enabled: true,
  },
  {
    slug: 'observation',
    name: 'Observation',
    icon: 'observation',
    summary: 'Patient observation facilities for short-term monitoring under medical care.',
    description:
      'Some situations call for a period of monitoring before you head home. Our observation facility lets the medical team keep an eye on your condition in a calm, comfortable setting.',
    includes: ['Patient observation facilities', 'Short-term monitoring under medical supervision'],
    seoTitle: 'Patient Observation Facility — Star Med Clinic',
    seoDescription:
      'Patient observation facilities at Star Med Clinic, Pallikkara, for short-term monitoring under medical care.',
    tone: 'teal',
    enabled: true,
  },
  {
    slug: 'medical-procedures',
    name: 'Medical Procedures',
    shortName: 'Procedures',
    icon: 'procedures',
    summary: 'Available clinical procedures carried out by our medical team.',
    description:
      'A range of clinical procedures is available at the clinic, carried out by our medical team. Please contact us to check whether the procedure you need is offered.',
    includes: ['Available clinical procedures', 'Pre- and post-procedure guidance from the medical team'],
    availabilityNote: 'Contact the clinic to confirm which procedures are currently offered.',
    seoTitle: 'Medical Procedures — Star Med Clinic, Pallikkara',
    seoDescription:
      'Clinical procedures at Star Med Clinic, Pallikkara. Contact the clinic to confirm which procedures are available.',
    tone: 'blue',
    enabled: true,
  },
  {
    slug: 'hospitalization',
    name: 'Hospitalization',
    icon: 'hospital',
    summary: 'In-patient admission facilities.',
    description:
      'In-patient admission facilities. (This service is hidden until confirmed by the clinic — set `enabled: true` in src/data/services.ts once verified.)',
    includes: ['In-patient admission'],
    seoTitle: 'Hospitalization — Star Med Clinic',
    seoDescription: 'In-patient facilities at Star Med Clinic, Pallikkara.',
    tone: 'teal',
    // Display only if confirmed by the clinic.
    enabled: false,
  },
  {
    slug: 'home-care',
    name: 'Home Care',
    icon: 'homecare',
    summary: 'Home healthcare services, subject to availability in your area.',
    description:
      'For patients who find it difficult to travel, home healthcare services may be arranged. Availability depends on your location and the care needed — please contact the clinic to discuss.',
    includes: ['Home healthcare services', 'Availability subject to location and care requirements'],
    availabilityNote: 'Subject to availability — contact the clinic to discuss your needs.',
    seoTitle: 'Home Care Services — Star Med Clinic, Pallikkara',
    seoDescription:
      'Home healthcare services from Star Med Clinic, Pallikkara, subject to availability. Contact the clinic to discuss your needs.',
    tone: 'green',
    enabled: true,
  },
];

export const services: readonly Service[] = allServices.filter((s) => s.enabled);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** URL of the page that best describes a service. */
export function serviceHref(s: Service): string {
  return s.featuredPage ?? `/services/${s.slug}`;
}
