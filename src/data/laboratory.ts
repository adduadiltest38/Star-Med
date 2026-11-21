/**
 * Laboratory test catalogue — EDITABLE PLACEHOLDER CONTENT.
 *
 * These are common test categories found in diagnostic laboratories and are
 * listed as examples only. The clinic must review this list and keep only the
 * tests it actually offers. Set `confirmed: true` once the clinic verifies the
 * catalogue; until then the page displays a "to be confirmed" notice.
 */
export const labCatalogue = {
  confirmed: false,
  categories: [
    {
      name: 'Blood tests',
      tests: ['Complete Blood Count (CBC)', 'Haemoglobin', 'ESR', 'Blood Group & Rh Typing'],
    },
    {
      name: 'Diabetes',
      tests: ['Fasting Blood Sugar (FBS)', 'Post-prandial Blood Sugar (PPBS)', 'Random Blood Sugar (RBS)', 'HbA1c'],
    },
    {
      name: 'Heart & lipids',
      tests: ['Lipid Profile', 'Total Cholesterol', 'Triglycerides'],
    },
    {
      name: 'Kidney & liver',
      tests: ['Serum Creatinine', 'Blood Urea', 'Uric Acid', 'Liver Function Test (LFT)'],
    },
    {
      name: 'Thyroid',
      tests: ['Thyroid Profile (T3, T4, TSH)', 'TSH'],
    },
    {
      name: 'Urine & other',
      tests: ['Urine Routine Examination', 'Urine Pregnancy Test', 'Stool Routine Examination'],
    },
  ],
} as const;

/** General guidance — not test-specific medical advice. */
export const labVisitTips = [
  'Bring your doctor’s prescription or test request, if you have one.',
  'Some tests need fasting — please call the clinic to confirm instructions for your test.',
  'Carry a list of medicines you currently take.',
  'Ask the laboratory team when and how your report will be available.',
] as const;
