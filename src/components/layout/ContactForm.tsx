'use client';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { whatsappLink } from '@/config/store';

/** No backend yet: the form composes a WhatsApp message the visitor sends themselves. */
export default function ContactForm() {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('Product question');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) {
      setErr('Please write a short message.');
      return;
    }
    const text = `Hi Best Deal!${name ? ` This is ${name}.` : ''}\nTopic: ${topic}\n\n${msg.trim()}`;
    window.open(whatsappLink(text), '_blank', 'noopener,noreferrer');
  };
  return (
    <form className="glass p-6 sm:p-8" onSubmit={submit} noValidate>
      <p className="display text-[40px]">Send a message</p>
      <p className="body-copy mt-1 text-sm">Opens WhatsApp with your message ready to send.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mono mb-2 block text-[10.5px] text-muted">Your name (optional)</span>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label className="block">
          <span className="mono mb-2 block text-[10.5px] text-muted">Topic</span>
          <select className="select w-full !h-[50px] !rounded-[14px]" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option>Product question</option>
            <option>Stock check</option>
            <option>Order / pickup</option>
            <option>Delivery</option>
            <option>Something else</option>
          </select>
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mono mb-2 block text-[10.5px] text-muted">Message</span>
        <textarea
          className="field !h-36 resize-y py-3"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
            setErr('');
          }}
          aria-invalid={!!err}
          aria-describedby="contact-err"
          placeholder="e.g. Do you have Mobil 1 5W-30 in 5qt? I can pick up this afternoon."
        />
      </label>
      <p id="contact-err" className="mt-2 min-h-5 text-[13px] text-[#ff8a8a]" aria-live="polite">
        {err}
      </p>
      <button type="submit" className="btn btn-primary mt-2" data-magnetic>
        <Icon name="whatsapp" size={18} /> Continue in WhatsApp <Icon name="arrow-right" size={16} className="arrow" />
      </button>
    </form>
  );
}
