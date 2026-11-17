/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  STAR MED CLINIC — CENTRAL SITE CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 *  Edit this file to update clinic details everywhere on the website.
 *
 *  Anything marked `null` or with `placeholder: true` is NOT yet confirmed by
 *  the clinic. The UI shows a clearly marked "to be confirmed" state instead of
 *  inventing information. Replace with real, verified values before launch.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface PostalAddress {
  landmark: string;
  locality: string;
  city: string;
  district: string;
  region: string;
  postalCode: string;
  country: string;
  countryCode: string;
}

export interface OpeningHoursSpec {
  /** schema.org day names, e.g. "Monday" */
  days: readonly string[];
  /** 24h "HH:MM" */
  opens: string;
  closes: string;
}

export interface SiteConfig {
  name: string;
  alternateName: string;
  legalName: string;
  tagline: string;
  shortDescription: string;
  locale: string;
  language: string;
  address: PostalAddress;
  /** Geo coordinates for structured data / maps. Leave null until verified. */
  geo: { latitude: number; longitude: number } | null;
  contact: {
    /** E.164 format, e.g. "+914672000000". null = not yet provided. */
    phone: string | null;
    /** Human-friendly display format for `phone`. */
    phoneDisplay: string | null;
    /** WhatsApp number in E.164 format without "+", e.g. "919876543210". */
    whatsapp: string | null;
    email: string | null;
  };
  maps: {
    /** Search query used when no exact place URL is configured. */
    query: string;
    /** Optional exact Google Maps share link for the clinic's pin. */
    placeUrl: string | null;
    /**
     * Optional Google Maps iframe `src` (Maps → Share → Embed a map → copy src).
     * When null, a query-based embed is generated automatically.
     */
    embedSrc: string | null;
  };
  /** Opening hours. Empty array = hours not yet confirmed (UI shows a notice). */
  openingHours: readonly OpeningHoursSpec[];
  social: readonly { label: string; href: string; icon: 'facebook' | 'instagram' | 'youtube' | 'whatsapp' }[];
  /** Nearby places for natural local-SEO copy. */
  areaServed: readonly string[];
}

export const site: SiteConfig = {
  name: 'Star Med Clinic',
  alternateName: 'Star Med Polyclinic',
  legalName: 'Star Med Polyclinic',
  tagline: 'Committed to your health, Always',
  shortDescription:
    'Star Med Clinic is a polyclinic in Pallikkara offering general and specialist consultation, a diagnostic laboratory, pharmacy, ECG and other patient-focused medical services under one roof.',
  locale: 'en_IN',
  language: 'en-IN',
  address: {
    landmark: 'Opposite Hanafi Masjid',
    locality: 'Mouvval',
    city: 'Pallikkara',
    district: 'Kasaragod',
    region: 'Kerala',
    postalCode: '671316',
    country: 'India',
    countryCode: 'IN',
  },
  geo: null,
  contact: {
    phone: null, // TODO(clinic): e.g. '+9146XXXXXXXX'
    phoneDisplay: null, // TODO(clinic): e.g. '+91 46XX XXX XXX'
    whatsapp: null, // TODO(clinic): e.g. '9198XXXXXXXX'
    email: null, // TODO(clinic): e.g. 'info@yourclinic.in'
  },
  maps: {
    query: 'Star Med Clinic, Opposite Hanafi Masjid, Mouvval, Pallikkara, Kerala 671316',
    placeUrl: null,
    embedSrc: null,
  },
  openingHours: [
    // TODO(clinic): add verified hours, for example:
    // { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '20:00' },
  ],
  social: [
    // TODO(clinic): add verified profiles only, for example:
    // { label: 'Facebook', href: 'https://www.facebook.com/your-page', icon: 'facebook' },
    // { label: 'Instagram', href: 'https://www.instagram.com/your-handle', icon: 'instagram' },
  ],
  areaServed: ['Pallikkara', 'Mouvval', 'Bekal', 'Udma', 'Poinachi', 'Kanhangad', 'Kasaragod'],
};

/** Main navigation (header + footer quick links). */
export const mainNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Specialities', href: '/specialities' },
  { label: 'Our Doctors', href: '/doctors' },
  { label: 'Contact', href: '/contact' },
] as const;

export const secondaryNav = [
  { label: 'Laboratory', href: '/laboratory' },
  { label: 'Pharmacy', href: '/pharmacy' },
] as const;
