import type { IconName } from './services';

/** "Why choose Star Med" points. Keep every point factual and verifiable. */
export const whyChoose: readonly { title: string; body: string; icon: IconName }[] = [
  {
    title: 'Many services, one location',
    body: 'Consultation, laboratory, pharmacy and ECG are all under one roof — fewer trips, less waiting around.',
    icon: 'clipboard',
  },
  {
    title: 'Convenient to reach',
    body: 'Located opposite Hanafi Masjid in Mouvval, Pallikkara — easy to find for families across the area.',
    icon: 'location',
  },
  {
    title: 'Patient-focused care',
    body: 'We take time to listen, explain clearly and involve you in decisions about your health.',
    icon: 'hand-heart',
  },
  {
    title: 'Diagnostics & consultation together',
    body: 'Doctors and the laboratory work side by side, so tests advised during your visit can be done here.',
    icon: 'microscope',
  },
  {
    title: 'Pharmacy on site',
    body: 'Collect prescribed medicines before you leave, and ask our pharmacy team about availability.',
    icon: 'pill-bottle',
  },
];
