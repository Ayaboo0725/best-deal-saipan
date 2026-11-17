'use client';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';

/** "Get island deals first." — email or SMS. TODO(client): connect to the real list provider. */
export default function Newsletter() {
  const [mode, setMode] = useState<'email' | 'sms'>('email');
  const [value, setValue] = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle');

  const valid = mode === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) : value.replace(/\D/g, '').length >= 7;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !consent) {
      setState('error');
      return;
    }
    // No backend yet: nothing is sent or stored.
    setState('done');
  };

  return (
    <section className="section cv-auto !pt-4" aria-labelledby="news-title">
      <div className="wrap">
        <div className="news p-8 sm:p-12 lg:p-16" data-reveal>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow !text-cream/80">
                <Icon name="mail" size={14} /> Deals list
              </p>
              <h2 id="news-title" className="display h-section mt-4">
                Get island
                <br />
                deals first.
              </h2>
              <p className="mt-4 max-w-md text-cream/80">Deal of the week, restocks and typhoon-season essentials — by email or text. No spam, unsubscribe any time.</p>
            </div>
            {state === 'done' ? (
              <div className="glass p-8 text-center" role="status">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green/20 text-green">
                  <Icon name="check" size={26} />
                </span>
                <p className="display mt-4 text-[38px]">You’re on the list</p>
                <p className="mt-2 text-cream/75">We’ll send the next Deal of the Week to {value}.</p>
              </div>
            ) : (
              <form className="glass p-6 sm:p-8" onSubmit={submit} noValidate>
                <div className="seg" role="group" aria-label="How should we reach you?">
                  <button type="button" aria-pressed={mode === 'email'} onClick={() => { setMode('email'); setValue(''); setState('idle'); }}>
                    Email
                  </button>
                  <button type="button" aria-pressed={mode === 'sms'} onClick={() => { setMode('sms'); setValue(''); setState('idle'); }}>
                    SMS
                  </button>
                </div>
                <label htmlFor="news-input" className="mono mt-6 block text-[10.5px] text-cream/70">
                  {mode === 'email' ? 'Email address' : 'Mobile number'}
                </label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="news-input"
                    className="field flex-1"
                    type={mode === 'email' ? 'email' : 'tel'}
                    inputMode={mode === 'email' ? 'email' : 'tel'}
                    autoComplete={mode === 'email' ? 'email' : 'tel'}
                    placeholder={mode === 'email' ? 'you@example.com' : '(670) 000-0000'}
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      if (state === 'error') setState('idle');
                    }}
                    aria-invalid={state === 'error' && !valid}
                    aria-describedby="news-help"
                  />
                  <button type="submit" className="btn btn-primary" data-magnetic>
                    Sign me up <Icon name="arrow-right" size={18} className="arrow" />
                  </button>
                </div>
                <label className="check mt-4 !items-start text-[13px] !text-cream/75">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
                  <span>Yes, send me Best Deal offers. {mode === 'sms' ? 'Message & data rates may apply. Reply STOP to opt out.' : 'Unsubscribe any time.'}</span>
                </label>
                <p id="news-help" className={`mt-3 text-[13px] ${state === 'error' ? 'text-[#ff8a8a]' : 'text-transparent'}`} aria-live="polite">
                  {state === 'error' ? (!valid ? `Please enter a valid ${mode === 'email' ? 'email address' : 'mobile number'}.` : 'Please tick the box to agree to receive offers.') : '.'}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
