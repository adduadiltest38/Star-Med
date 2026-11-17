import { site } from '@/config/site';
import { services, serviceHref } from '@/data/services';
import { specialities } from '@/data/specialities';
import { fullAddress, mapViewHref } from '@/lib/contact';

export interface Crumb {
  name: string;
  href: string;
}

const abs = (siteUrl: URL, path: string) => new URL(path, siteUrl).toString();

/** Page <title> pattern: "Page — Star Med Clinic, Pallikkara" (home uses its own). */
export function pageTitle(title: string): string {
  return title.includes(site.name) ? title : `${title} | ${site.name}`;
}

export function clinicId(siteUrl: URL): string {
  return `${abs(siteUrl, '/')}#clinic`;
}

/** MedicalClinic (a LocalBusiness subtype) — the main entity for local SEO. */
export function medicalClinicSchema(siteUrl: URL, logoUrl: string, imageUrl: string) {
  const { address, contact, geo, openingHours, social, areaServed } = site;
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': clinicId(siteUrl),
    name: site.name,
    alternateName: site.alternateName,
    legalName: site.legalName,
    slogan: site.tagline,
    description: site.shortDescription,
    url: abs(siteUrl, '/'),
    logo: logoUrl,
    image: imageUrl,
    hasMap: mapViewHref,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${address.landmark}, ${address.locality}`,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.countryCode,
    },
    ...(geo && { geo: { '@type': 'GeoCoordinates', latitude: geo.latitude, longitude: geo.longitude } }),
    ...(contact.phone && { telephone: contact.phone }),
    ...(contact.email && { email: contact.email }),
    ...(openingHours.length > 0 && {
      openingHoursSpecification: openingHours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
        opens: h.opens,
        closes: h.closes,
      })),
    }),
    ...(social.length > 0 && { sameAs: social.map((s) => s.href) }),
    areaServed: areaServed.map((name) => ({ '@type': 'Place', name })),
    medicalSpecialty: specialities.map((s) => s.schemaSpecialty).filter(Boolean),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Medical services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.summary,
          url: abs(siteUrl, serviceHref(s)),
        },
      })),
    },
    knowsLanguage: ['en', 'ml'],
  };
}

export function websiteSchema(siteUrl: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${abs(siteUrl, '/')}#website`,
    url: abs(siteUrl, '/'),
    name: site.name,
    alternateName: site.alternateName,
    inLanguage: site.language,
    publisher: { '@id': clinicId(siteUrl) },
  };
}

export function webPageSchema(
  siteUrl: URL,
  opts: { url: string; name: string; description: string; type?: string },
) {
  return {
    '@context': 'https://schema.org',
    '@type': opts.type ?? 'WebPage',
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: site.language,
    isPartOf: { '@id': `${abs(siteUrl, '/')}#website` },
    about: { '@id': clinicId(siteUrl) },
  };
}

export function breadcrumbSchema(siteUrl: URL, crumbs: readonly Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(siteUrl, c.href),
    })),
  };
}

export function serviceSchema(siteUrl: URL, opts: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.name,
    description: opts.description,
    url: opts.url,
    provider: { '@id': clinicId(siteUrl) },
    areaServed: site.areaServed.map((name) => ({ '@type': 'Place', name })),
  };
}

export { fullAddress };

/** Normalise a request path to its public URL form: "/index.html" → "/", "/about.html" → "/about". */
export function normalizePath(pathname: string): string {
  const p = pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/$/, '$1');
  return p || '/';
}
