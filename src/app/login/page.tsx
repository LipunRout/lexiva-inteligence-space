'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

function safeNext(v: string | null) {
  return v && v.startsWith('/') && !v.startsWith('//') ? v : '/chat';
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get('next'));

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    params.get('error') ? 'Sign-in failed. Please try again.' : null
  );
  const [info, setInfo] = useState<string | null>(null);

  async function oauth(provider: 'google' | 'github') {
    setError(null);
    const { error } = await supabaseBrowser().auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) setError(error.message);
  }

  async function sendCode(e?: FormEvent) {
    e?.preventDefault();
    const address = email.trim();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const { error } = await supabaseBrowser().auth.signInWithOtp({
        email: address,
        options: { shouldCreateUser: true },
      });
      if (error) return setError(error.message);
      setEmail(address);
      setCode('');
      setStep('code');
      setInfo(`Enter the verification code sent to ${address}.`);
    } catch {
      setError('Unable to send a verification code. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(e: FormEvent) {
    e.preventDefault();
    if (!/^\d{4}$/.test(code)) {
      setError('Enter the 4-digit code from your email.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { error } = await supabaseBrowser().auth.verifyOtp({
        email: email.trim(),
        token: code,
        type: 'email',
      });
      if (error) return setError(error.message);
      router.replace(next);
      router.refresh();
    } catch {
      setError('Unable to verify the code. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  const btn =
    'inline-flex h-11 w-full items-center justify-center rounded-full border border-white/10 bg-[#26262c] text-[15px] font-medium text-[#f4f4f6] transition-colors hover:bg-[#2d2d34] disabled:opacity-60';
  const input =
    'h-11 w-full rounded-full border border-white/10 bg-black/30 px-4 text-[16px] text-[#f4f4f6] outline-none placeholder:text-[#8c8b93] focus:border-white/25';

  return (
    <main className="mx-auto flex min-h-[80dvh] w-full max-w-sm items-center px-4 py-16">
      <div className="w-full rounded-[24px] border border-white/[0.08] bg-[#18181c] p-6 text-[#f4f4f6] shadow-[0_20px_45px_-15px_rgba(0,0,0,0.5)]">
        <h1 className="text-xl font-semibold tracking-tight">Sign in to Lexiva</h1>
        <p className="mt-1 text-sm text-[#8e8d95]">Sign in securely with a one-time code sent to your email.</p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button type="button" className={btn} onClick={() => oauth('google')}>Continue with Google</button>
          <button type="button" className={btn} onClick={() => oauth('github')}>Continue with GitHub</button>
        </div>

        <div className="my-5 flex items-center gap-3 text-xs text-[#6e6d76]">
          <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
        </div>

        {step === 'email' ? (
          <form onSubmit={sendCode} className="flex flex-col gap-2.5">
            <label htmlFor="email" className="sr-only">Email</label>
            <input id="email" type="email" required autoComplete="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
            <button type="submit" disabled={busy || !email.trim()} className={btn}>
              {busy ? 'Sending...' : 'Email me a verification code'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="flex flex-col gap-2.5">
            <label htmlFor="code" className="sr-only">Verification code</label>
            <input id="code" type="text" required autoComplete="one-time-code" inputMode="numeric"
              pattern="[0-9]{4}" minLength={4} maxLength={4} placeholder="4-digit code"
              value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className={`${input} text-center tracking-[0.3em]`} />
            <button type="submit" disabled={busy || code.length !== 4} className={btn}>
              {busy ? 'Verifying...' : 'Verify code'}
            </button>
            <div className="flex items-center justify-between px-1 text-xs text-[#8e8d95]">
              <button type="button" disabled={busy} onClick={() => { setStep('email'); setCode(''); setInfo(null); setError(null); }}
                className="hover:text-white disabled:opacity-50">
                Use a different email
              </button>
              <button type="button" disabled={busy} onClick={() => void sendCode()}
                className="hover:text-white disabled:opacity-50">
                Resend code
              </button>
            </div>
          </form>
        )}

        <p role="status" className="mt-4 min-h-[20px] text-sm">
          {error ? <span className="text-red-400">{error}</span> : info ? <span className="text-[#8e8d95]">{info}</span> : null}
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}