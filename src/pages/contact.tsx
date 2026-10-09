import {useEffect, useRef, useState, type FocusEvent, type FormEvent} from 'react';
import {mount} from '../boot';
import {Shards, driveShards, useShardRefs, type Shard} from '../components/Shards';
import {brand, contactPage} from '../content';
import {clamp, easeOutCubic, range} from '../lib/math';
import {pointer} from '../lib/pointer';
import {onFrame} from '../lib/scroll';
import {delay} from '../lib/style';
import {u} from '../lib/url';

/**
 * The enquiry. Left: the invitation and every way to reach the team.
 * Right: the form, with visible labels, errors written under the field they
 * belong to (checked when you leave it), and a summary that takes focus if
 * a send fails. There is no server behind this static site yet, so sending
 * opens the visitor's email app with the enquiry already written out.
 */

type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric';
  placeholder?: string;
  options?: string[];
  textarea?: boolean;
  wide?: boolean;
  hint?: string;
  /** What to ask for when a required field is empty. */
  missing?: string;
};

const FIELDS: Field[] = [
  {name: 'name', label: 'Name and surname', required: true, autoComplete: 'name', missing: 'Please add your name and surname.'},
  {name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email', inputMode: 'email', missing: 'Please add your email address so we can reply.'},
  {name: 'phone', label: 'Contact number', type: 'tel', required: true, autoComplete: 'tel', inputMode: 'tel', hint: 'Include your country code, e.g. +44.', missing: 'Please add a contact number, including the country code.'},
  {name: 'country', label: 'Where are you reaching out from?', options: contactPage.countries, autoComplete: 'country-name'},
  {name: 'date', label: 'Preferred wedding date', type: 'date', required: true, missing: 'Please choose your preferred wedding date — an estimate is fine.'},
  {name: 'guests', label: 'Estimated number of guests', type: 'number', required: true, inputMode: 'numeric', placeholder: 'e.g. 120', missing: 'Please add an estimated number of guests.'},
  {name: 'venue', label: 'Preferred venue(s)', wide: true, placeholder: 'Or “still looking” — we can help', hint: 'Optional.'},
  {name: 'message', label: 'Tell us about your day', required: true, textarea: true, wide: true, placeholder: 'The feeling, the style, the people, anything at all.', missing: 'Please tell us a little about your day.'},
  {name: 'heard', label: 'How did you hear about us?', options: contactPage.heard, wide: true},
];

function validate(f: Field, value: string): string {
  const v = value.trim();
  if (f.required && !v) return f.missing ?? `Please fill in ${f.label.toLowerCase()}.`;
  if (!v) return '';
  if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'That email doesn’t look quite right — please check it, e.g. name@example.com.';
  if (f.type === 'tel' && v.replace(/[^\d]/g, '').length < 7) return 'Please enter a full phone number, including the area or country code.';
  if (f.type === 'number' && (!/^\d+$/.test(v) || Number(v) < 1)) return 'Please enter a number of guests, e.g. 80.';
  if (f.type === 'date' && new Date(v) < new Date(new Date().toDateString())) return 'Please choose a date in the future.';
  return '';
}

const BITS: Shard[] = [
  {piece: 'f01', x: 6, y: 20, h: 9, depth: 0.45, rot: 20, spin: 60},
  {piece: 'f12', x: 40, y: 12, h: 5, depth: 0.3, rot: -20, spin: -90},
  {piece: 'f06', x: 30, y: 84, h: 12, depth: 0.55, rot: 40, spin: 40},
  {piece: 'f03', x: 2, y: 70, h: 26, depth: 0.9, rot: -15, spin: 30, blur: true},
];

function Enquiry() {
  const rootRef = useRef<HTMLElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const bits = useShardRefs();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  useEffect(
    () =>
      onFrame((time) => {
        const root = rootRef.current;
        if (!root) return;
        const p = clamp(window.scrollY / Math.max(1, root.offsetHeight - window.innerHeight));
        const t = time / 1000;
        driveShards(bits, BITS, (s, i) => ({
          x: pointer.x * (s.depth - 0.3) * 4 + Math.cos(t * 0.4 + i) * 0.4,
          y: -p * s.depth * 40 + Math.sin(t * 0.6 + i * 2) * 0.8,
          r: s.rot + p * s.spin + Math.sin(t * 0.3 + i) * 6,
          s: 1,
          o: easeOutCubic(range(t, 0.4, 1.6)),
        }));
      }),
    [bits],
  );

  useEffect(() => {
    if (summary.length) summaryRef.current?.focus();
  }, [summary]);
  useEffect(() => {
    if (sent) doneRef.current?.focus();
  }, [sent]);

  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const f = FIELDS.find((x) => x.name === e.currentTarget.name);
    if (!f) return;
    const msg = validate(f, e.currentTarget.value);
    setErrors((prev) => ({...prev, [f.name]: msg}));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    for (const f of FIELDS) next[f.name] = validate(f, String(data.get(f.name) ?? ''));
    setErrors(next);
    const failed = FIELDS.filter((f) => next[f.name]).map((f) => f.name);
    setSummary(failed);
    if (failed.length) return;

    const lines = FIELDS.map((f) => `${f.label}: ${String(data.get(f.name) ?? '').trim() || '—'}`);
    const subject = `Wedding enquiry — ${String(data.get('name')).trim()} (${String(data.get('date'))})`;
    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setSent(true);
  };

  return (
    <section ref={rootRef} id="top" className="relative overflow-hidden bg-ink px-5 pt-[16svh] pb-[12svh] md:px-10" aria-labelledby="contact-title">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_50%_at_10%_10%,rgb(154_116_66_/_0.25),transparent_70%)]" />
      <Shards shards={BITS} store={bits} />

      <div className="relative mx-auto grid max-w-[84rem] gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Invitation */}
        <div className="lg:sticky lg:top-[14svh] lg:self-start">
          <p className="eyebrow flex items-center gap-4 text-gold animate-[fade-up_1.2s_0.2s_var(--ease-carve)_both]">
            <span className="accent text-[1.2rem] tracking-normal normal-case">v.</span>
            <span aria-hidden="true" className="block h-px w-10 bg-gold/70" />
            {contactPage.eyebrow}
          </p>
          <h1 id="contact-title" className="caps mt-6 text-[clamp(3.5rem,8vw,8rem)] leading-[0.84]" style={{fontVariationSettings: '"wght" 840'}}>
            <span className="mask-line" data-reveal="rise">
              <span className="fill-ivory">{contactPage.title}</span>
            </span>
            <span className="mask-line mask-italic pb-[0.14em]" data-reveal="rise" style={delay(120)}>
              <span className="accent fill-gold text-[1.1em] leading-[0.95]">{contactPage.accent}</span>
            </span>
          </h1>
          <p className="mt-8 max-w-[30rem] text-lead text-linen" data-reveal style={delay(200)}>
            {contactPage.intro}
          </p>

          <div className="mt-12 flex items-end gap-8" data-reveal style={delay(280)}>
            <div className="arch relative h-44 w-32 shrink-0 overflow-hidden bg-coal max-sm:hidden">
              <img src={u('/media/couple-lindsay-m.webp')} alt="" className="size-full object-cover" loading="lazy" />
            </div>
            <dl className="grid gap-5">
              <div>
                <dt className="eyebrow text-ash">Call</dt>
                <dd className="mt-1">
                  <a href={brand.phoneHref} className="accent text-[1.6rem] text-ivory transition-colors hover:text-gold">{brand.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ash">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${brand.email}`} className="accent text-[1.35rem] break-all text-ivory transition-colors hover:text-gold">{brand.email}</a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-ash">Studio</dt>
                <dd className="mt-1 text-[1rem] text-linen">{brand.address}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* The form */}
        <div className="relative rounded-[28px] border border-ivory/10 bg-coal/80 p-6 backdrop-blur-md md:p-12" data-reveal style={delay(160)}>
          {sent ? (
            <div ref={doneRef} tabIndex={-1} role="status" className="flex min-h-[50svh] flex-col items-start justify-center outline-none">
              <img src={u('/media/ww-mark.png')} alt="" aria-hidden="true" className="size-14 opacity-90" />
              <h2 className="caps mt-8 text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.9]" style={{fontVariationSettings: '"wght" 820'}}>
                <span className="fill-ivory block">Thank you —</span>
                <span className="accent fill-gold block text-[1.05em]">almost there.</span>
              </h2>
              <p className="mt-6 max-w-[30rem] text-body text-linen">
                Your email app should now be open with your enquiry written out — just press send. If it didn’t open, email us at{' '}
                <a className="text-gold underline underline-offset-4" href={`mailto:${brand.email}`}>
                  {brand.email}
                </a>{' '}
                or call <a className="text-gold underline underline-offset-4" href={brand.phoneHref}>{brand.phone}</a>.
              </p>
              <button type="button" onClick={() => setSent(false)} className="label mt-8 min-h-11 text-linen underline underline-offset-4 hover:text-gold">
                Edit my enquiry
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} aria-labelledby="form-title">
              <h2 id="form-title" className="accent text-[clamp(1.8rem,2.6vw,2.4rem)] text-ivory">
                Tell us about your day
              </h2>
              <p className="label mt-3 text-ash">
                Fields marked <span className="text-gold">*</span> are required
              </p>

              {summary.length > 0 && (
                <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-8 rounded-[16px] border border-[#e08b7a]/50 bg-[#e08b7a]/10 p-5 outline-none">
                  <p className="font-medium text-ivory">Please check {summary.length === 1 ? 'one detail' : `${summary.length} details`} before sending:</p>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {summary.map((n) => (
                      <li key={n}>
                        <a href={`#f-${n}`} className="text-[0.95rem] text-[#f0b3a6] underline underline-offset-4">
                          {errors[n]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {FIELDS.map((f) => {
                  const id = `f-${f.name}`;
                  const err = errors[f.name];
                  const describedBy = [f.hint ? `${id}-hint` : '', err ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined;
                  const common = {
                    id,
                    name: f.name,
                    required: f.required,
                    autoComplete: f.autoComplete,
                    onBlur,
                    'aria-invalid': err ? true : undefined,
                    'aria-describedby': describedBy,
                    className: 'field',
                  } as const;
                  return (
                    <div key={f.name} className={f.wide ? 'sm:col-span-2' : ''}>
                      <label htmlFor={id} className="eyebrow block text-linen">
                        {f.label} {f.required && <span className="text-gold" aria-hidden="true">*</span>}
                      </label>
                      {f.textarea ? (
                        <textarea {...common} rows={4} placeholder={f.placeholder} className="field resize-y" />
                      ) : f.options ? (
                        <select {...common} defaultValue="">
                          <option value="" disabled>
                            Please select
                          </option>
                          {f.options.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      ) : (
                        <input {...common} type={f.type ?? 'text'} inputMode={f.inputMode} placeholder={f.placeholder} min={f.type === 'number' ? 1 : undefined} />
                      )}
                      {f.hint && !err && (
                        <p id={`${id}-hint`} className="mt-2 text-[0.85rem] text-ash">
                          {f.hint}
                        </p>
                      )}
                      {err && (
                        <p id={`${id}-err`} className="mt-2 text-[0.88rem] text-[#f0b3a6]">
                          {err}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
                <p className="max-w-[20rem] text-[0.88rem] text-ash">Once we receive your enquiry, we'll be in touch to arrange your complimentary 30-minute call.</p>
                <button
                  type="submit"
                  className="btn-sweep group inline-flex min-h-12 items-center gap-4 rounded-full bg-gold py-1.5 pr-1.5 pl-7 text-[0.9rem] font-medium text-ink transition-colors hover:bg-glow"
                >
                  Send enquiry
                  <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-ink text-ivory transition-transform duration-700 ease-(--ease-carve) group-hover:-rotate-45">
                    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

mount(<Enquiry />);
