import { site } from '@/config/site';

const { address, contact, maps } = site;

export const addressLines = [
  `${address.landmark},`,
  `${address.locality}, ${address.city}, ${address.postalCode}`,
] as const;

export const fullAddress = `${address.landmark}, ${address.locality}, ${address.city}, ${address.district}, ${address.region} ${address.postalCode}, ${address.country}`;

export const hasPhone = Boolean(contact.phone);
export const hasWhatsApp = Boolean(contact.whatsapp);
export const hasEmail = Boolean(contact.email);

export const telHref = contact.phone ? `tel:${contact.phone.replace(/\s+/g, '')}` : null;
export const mailHref = contact.email ? `mailto:${contact.email}` : null;

/** Build a WhatsApp click-to-chat URL with an optional pre-filled message. */
export function whatsappHref(message?: string): string | null {
  if (!contact.whatsapp) return null;
  const digits = contact.whatsapp.replace(/\D/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${text}`;
}

export const defaultWhatsAppMessage = `Hello ${site.name}, I would like to make an enquiry.`;

/** Google Maps directions link (opens navigation in the Maps app on phones). */
export const directionsHref =
  maps.placeUrl ??
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(maps.query)}`;

/** Link to view the clinic on Google Maps. */
export const mapViewHref =
  maps.placeUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(maps.query)}`;

/** Iframe src for the embedded map (no API key required). */
export const mapEmbedSrc =
  maps.embedSrc ?? `https://maps.google.com/maps?q=${encodeURIComponent(maps.query)}&z=16&output=embed`;

/** Format "08:00" → "8:00 AM". */
export function formatTime(t: string): string {
  const [hStr, m] = t.split(':');
  const h = Number(hStr);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${suffix}`;
}
