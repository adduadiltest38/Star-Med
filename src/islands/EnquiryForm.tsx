import { useEffect, useId, useMemo, useRef, useState, type SubmitEvent } from 'react';
import { AlertCircle, CalendarCheck, CheckCircle2, Loader2, MessageSquareText, Send, ShieldCheck } from 'lucide-react';

export interface EnquiryFormProps {
  services: { slug: string; name: string }[];
  clinicName: string;
  /** JSON endpoint (e.g. Formspree). When empty, WhatsApp hand-off is used. */
  endpoint?: string | undefined;
  /** WhatsApp number (digits only, with country code). */
  whatsapp?: string | null;
  /** Fallback email (mailto) when neither endpoint nor WhatsApp is configured. */
  email?: string | null;
  phoneHref?: string | null;
  defaultMode?: Mode;
}

type Mode = 'appointment' | 'general';
type Status = 'idle' | 'submitting' | 'success' | 'error';
type Channel = 'endpoint' | 'whatsapp' | 'email' | 'none';

interface Values {
  name: string;
  phone: string;
  service: string;
  date: string;
  message: string;
  consent: boolean;
  company: string; // honeypot
}

type Errors = Partial<Record<keyof Values, string>>;

const empty: Values = { name: '', phone: '', service: '', date: '', message: '', consent: false, company: '' };

const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const formatDate = (iso: string) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';

function validate(v: Values, mode: Mode): Errors {
  const e: Errors = {};
  const name = v.name.trim();
  if (!name) e.name = 'Please enter the patient’s name.';
  else if (name.length < 2 || name.length > 80) e.name = 'Name should be between 2 and 80 characters.';
  else if (!/^[\p{L} .'-]+$/u.test(name)) e.name = 'Please use letters only.';

  const digits = v.phone.replace(/[\s()-]/g, '');
  if (!digits) e.phone = 'Please enter a phone number so the clinic can reach you.';
  else if (!/^(\+?91)?[6-9]\d{9}$/.test(digits) && !/^\+\d{8,15}$/.test(digits))
    e.phone = 'Enter a valid 10-digit mobile number (e.g. 98XXXXXXXX).';

  if (mode === 'appointment') {
    if (!v.service) e.service = 'Please choose the service you need.';
    if (!v.date) e.date = 'Please choose a preferred date.';
    else if (v.date < todayISO()) e.date = 'Preferred date cannot be in the past.';
  }
  if (mode === 'general' && v.message.trim().length < 5) e.message = 'Please tell us briefly how we can help.';
  if (v.message.length > 500) e.message = 'Please keep the message under 500 characters.';
  if (!v.consent) e.consent = 'Please confirm you agree to be contacted.';
  return e;
}

export default function EnquiryForm({
  services,
  clinicName,
  endpoint,
  whatsapp,
  email,
  phoneHref,
  defaultMode = 'appointment',
}: EnquiryFormProps) {
  const uid = useId();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const channel: Channel = endpoint ? 'endpoint' : whatsapp ? 'whatsapp' : email ? 'email' : 'none';

  // Prefill from ?service=slug and #general links.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('service');
    if (s && services.some((x) => x.slug === s)) setValues((v) => ({ ...v, service: s }));
    if (params.get('type') === 'general') setMode('general');
  }, [services]);

  useEffect(() => {
    if (status === 'success' || status === 'error') resultRef.current?.focus();
  }, [status]);

  const id = (f: string) => `${uid}-${f}`;
  const serviceName = useMemo(() => services.find((s) => s.slug === values.service)?.name ?? '', [services, values.service]);

  const set = <K extends keyof Values>(key: K, val: Values[K]) => {
    const next = { ...values, [key]: val };
    setValues(next);
    if (touched[key]) setErrors(validate(next, mode));
  };
  const blur = (key: keyof Values) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(values, mode));
  };

  const buildMessage = () =>
    [
      `${mode === 'appointment' ? 'Appointment enquiry' : 'General enquiry'} — ${clinicName}`,
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
      serviceName && `Service: ${serviceName}`,
      mode === 'appointment' && values.date && `Preferred date: ${formatDate(values.date)}`,
      values.message.trim() && `Message: ${values.message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (values.company) return; // bot
    const errs = validate(values, mode);
    setErrors(errs);
    setTouched({ name: true, phone: true, service: true, date: true, message: true, consent: true });
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus('submitting');
    setServerError('');
    try {
      if (channel === 'endpoint' && endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            type: mode,
            name: values.name.trim(),
            phone: values.phone.trim(),
            service: serviceName,
            preferredDate: mode === 'appointment' ? values.date : '',
            message: values.message.trim(),
            _subject: `${mode === 'appointment' ? 'Appointment' : 'General'} enquiry from ${values.name.trim()}`,
          }),
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
      } else if (channel === 'whatsapp' && whatsapp) {
        const url = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(buildMessage())}`;
        const win = window.open(url, '_blank', 'noopener,noreferrer');
        if (!win) window.location.href = url;
      } else if (channel === 'email' && email) {
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(
          `${mode === 'appointment' ? 'Appointment' : 'General'} enquiry`,
        )}&body=${encodeURIComponent(buildMessage())}`;
      } else {
        throw new Error('not-configured');
      }
      setStatus('success');
    } catch (err) {
      setServerError(
        err instanceof Error && err.message === 'not-configured'
          ? 'Online enquiries are not active yet. Please call or visit the clinic.'
          : 'We couldn’t send your enquiry right now. Please check your connection and try again, or contact the clinic directly.',
      );
      setStatus('error');
    }
  }

  const reset = () => {
    setValues(empty);
    setErrors({});
    setTouched({});
    setStatus('idle');
  };

  const errorList = Object.entries(errors).filter(([k]) => touched[k as keyof Values]);
  const fieldBase =
    'block w-full rounded-2xl border bg-white px-4 py-3.5 text-[1rem] text-ink shadow-[inset_0_1px_2px_rgb(11_27_54/0.04)] transition placeholder:text-muted/70 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 focus:outline-none';
  const fieldCls = (k: keyof Values) =>
    `${fieldBase} ${touched[k] && errors[k] ? 'border-red-400 bg-red-50/40' : 'border-line'}`;
  const describedBy = (k: keyof Values, hint?: boolean) =>
    [hint && id(`${k}-hint`), touched[k] && errors[k] && id(`${k}-err`)].filter(Boolean).join(' ') || undefined;
  const ErrorText = ({ k }: { k: keyof Values }) =>
    touched[k] && errors[k] ? (
      <p id={id(`${k}-err`)} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-700">
        <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
        {errors[k]}
      </p>
    ) : null;

  if (status === 'success') {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="rounded-3xl bg-green-50 p-8 text-center outline-none sm:p-10">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-green-500 text-white shadow-[0_10px_30px_-10px_rgb(34_163_101/0.7)]">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <h3 className="mt-6 text-2xl font-bold text-ink">
          {channel === 'endpoint' ? 'Thank you — your enquiry has been sent' : 'Almost done — send your message'}
        </h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-soft">
          {channel === 'endpoint' && 'The clinic team will contact you on the number you provided.'}
          {channel === 'whatsapp' && 'WhatsApp has opened with your enquiry pre-filled. Please press send in WhatsApp to share it with the clinic.'}
          {channel === 'email' && 'Your email app has opened with the enquiry pre-filled. Please press send to share it with the clinic.'}
        </p>
        {mode === 'appointment' && (
          <p className="mx-auto mt-4 max-w-md rounded-2xl bg-white px-4 py-3 text-sm text-ink-soft">
            <strong className="text-ink">Please note:</strong> this is an appointment <em>request</em>, not a confirmed booking. The clinic will contact you to confirm a time.
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex h-12 items-center rounded-full border border-line bg-white px-6 font-semibold text-ink transition hover:border-brand-200 hover:text-brand-700"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby={id('title')} className="relative">
      <h3 id={id('title')} className="sr-only">
        {mode === 'appointment' ? 'Appointment enquiry form' : 'General enquiry form'}
      </h3>

      {/* Mode switch */}
      <div role="radiogroup" aria-label="Enquiry type" className="grid grid-cols-2 gap-1 rounded-full bg-surface p-1.5">
        {(
          [
            ['appointment', 'Appointment', CalendarCheck],
            ['general', 'General enquiry', MessageSquareText],
          ] as const
        ).map(([m, label, Icon]) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => {
              setMode(m);
              setErrors({});
              setTouched({});
            }}
            className={`flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              mode === m ? 'bg-white text-brand-700 shadow-soft' : 'text-muted hover:text-ink'
            }`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 outline-none"
        >
          <p className="font-semibold">Please check the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errorList.map(([k, msg]) => (
              <li key={k}>
                <a href={`#${id(k)}`} className="underline underline-offset-2">
                  {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor={id('name')} className="mb-2 block text-sm font-semibold text-ink">
            Patient name <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id={id('name')}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            onBlur={() => blur('name')}
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby={describedBy('name')}
            className={fieldCls('name')}
            placeholder="Full name"
          />
          <ErrorText k="name" />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor={id('phone')} className="mb-2 block text-sm font-semibold text-ink">
            Phone number <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id={id('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            maxLength={16}
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            onBlur={() => blur('phone')}
            aria-invalid={Boolean(touched.phone && errors.phone)}
            aria-describedby={describedBy('phone')}
            className={fieldCls('phone')}
            placeholder="10-digit mobile number"
          />
          <ErrorText k="phone" />
        </div>

        <div className={mode === 'appointment' ? 'sm:col-span-1' : 'sm:col-span-2'}>
          <label htmlFor={id('service')} className="mb-2 block text-sm font-semibold text-ink">
            Requested service {mode === 'appointment' ? <span className="text-red-600" aria-hidden="true">*</span> : <span className="font-normal text-muted">(optional)</span>}
          </label>
          <select
            id={id('service')}
            name="service"
            required={mode === 'appointment'}
            value={values.service}
            onChange={(e) => set('service', e.target.value)}
            onBlur={() => blur('service')}
            aria-invalid={Boolean(touched.service && errors.service)}
            aria-describedby={describedBy('service')}
            className={`${fieldCls('service')} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235a6880' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-11`}
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
          <ErrorText k="service" />
        </div>

        {mode === 'appointment' && (
          <div className="sm:col-span-1">
            <label htmlFor={id('date')} className="mb-2 block text-sm font-semibold text-ink">
              Preferred date <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id={id('date')}
              name="date"
              type="date"
              required
              min={todayISO()}
              value={values.date}
              onChange={(e) => set('date', e.target.value)}
              onBlur={() => blur('date')}
              aria-invalid={Boolean(touched.date && errors.date)}
              aria-describedby={describedBy('date', true)}
              className={fieldCls('date')}
            />
            <p id={id('date-hint')} className="mt-2 text-xs text-muted">
              The clinic will confirm the exact time with you.
            </p>
            <ErrorText k="date" />
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor={id('message')} className="mb-2 block text-sm font-semibold text-ink">
            Message {mode === 'general' ? <span className="text-red-600" aria-hidden="true">*</span> : <span className="font-normal text-muted">(optional)</span>}
          </label>
          <textarea
            id={id('message')}
            name="message"
            rows={4}
            maxLength={500}
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
            onBlur={() => blur('message')}
            aria-invalid={Boolean(touched.message && errors.message)}
            aria-describedby={describedBy('message', true)}
            className={`${fieldCls('message')} resize-y`}
            placeholder={mode === 'appointment' ? 'Anything the clinic should know about timing?' : 'How can we help?'}
          />
          <p id={id('message-hint')} className="mt-2 flex justify-between gap-4 text-xs text-muted">
            <span>Please don’t share detailed medical history or records here.</span>
            <span aria-hidden="true">{values.message.length}/500</span>
          </p>
          <ErrorText k="message" />
        </div>

        {/* Honeypot — hidden from people and assistive tech */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={id('company')}>Company</label>
          <input id={id('company')} name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={(e) => set('company', e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-start gap-3">
            <input
              id={id('consent')}
              name="consent"
              type="checkbox"
              checked={values.consent}
              onChange={(e) => set('consent', e.target.checked)}
              onBlur={() => blur('consent')}
              aria-invalid={Boolean(touched.consent && errors.consent)}
              aria-describedby={describedBy('consent')}
              className="mt-0.5 size-5 shrink-0 rounded-md border-line accent-brand-600"
            />
            <label htmlFor={id('consent')} className="text-sm leading-relaxed text-ink-soft">
              I agree to be contacted by {clinicName} about this enquiry.
            </label>
          </div>
          <ErrorText k="consent" />
        </div>
      </div>

      {status === 'error' && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="mt-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 outline-none">
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <p>
            {serverError}
            {phoneHref && (
              <>
                {' '}
                <a href={phoneHref} className="font-semibold underline">
                  Call the clinic
                </a>
                .
              </>
            )}
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xs text-muted">
          <ShieldCheck className="size-4 text-green-600" aria-hidden="true" />
          {channel === 'whatsapp' ? 'Your enquiry will open in WhatsApp for you to send.' : 'We only use these details to respond to you.'}
        </p>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-brand-600 px-8 font-semibold text-white shadow-[0_10px_30px_-10px_rgb(36_112_224/0.55)] transition hover:-translate-y-0.5 hover:bg-brand-700 disabled:translate-y-0 disabled:opacity-70"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>
              {mode === 'appointment' ? 'Request appointment' : 'Send enquiry'} <Send className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {status === 'submitting' ? 'Sending your enquiry' : ''}
      </p>
    </form>
  );
}
