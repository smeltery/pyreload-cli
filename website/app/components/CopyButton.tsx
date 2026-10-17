'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
export function CopyButton({
  text,
  label = 'Copy command',
}: {
  text: string;
  label?: string;
}) {
  const [status, setStatus] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Copied');
    } catch {
      setStatus('Copy unavailable. Select the text to copy.');
    }
    setTimeout(() => setStatus(''), 3000);
  }
  return (
    <>
      <button className="copy-button" onClick={copy} aria-label={label}>
        {status === 'Copied' ? <Check size={16} /> : <Copy size={16} />}
        <span>{label}</span>
      </button>
      <span
        className={
          status.startsWith('Copy unavailable') ? 'copy-toast' : 'sr-only'
        }
        role="status"
      >
        {status}
      </span>
    </>
  );
}
