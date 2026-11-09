'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type VoiceState = 'idle' | 'recording' | 'transcribing';

const MAX_SECONDS = 120;

function pickMime() {
  if (typeof MediaRecorder === 'undefined') return '';
  return (
    ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find((t) =>
      MediaRecorder.isTypeSupported(t)
    ) ?? ''
  );
}

export function useVoiceInput(onText: (text: string) => void) {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<VoiceState>('idle');
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<number | null>(null);
  const cancelled = useRef(false);
  const onTextRef = useRef(onText);
  onTextRef.current = onText;

  useEffect(() => {
    setSupported(!!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined');
  }, []);

  const release = useCallback(() => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
  }, []);

  const stop = useCallback(() => {
    if (recorder.current?.state === 'recording') recorder.current.stop();
  }, []);

  const cancel = useCallback(() => {
    cancelled.current = true;
    if (recorder.current?.state === 'recording') recorder.current.stop();
    else {
      release();
      setState('idle');
    }
  }, [release]);

  const transcribe = useCallback(async (blob: Blob) => {
    setState('transcribing');
    try {
      const ext = blob.type.includes('mp4') ? 'mp4' : blob.type.includes('ogg') ? 'ogg' : 'webm';
      const form = new FormData();
      form.append('audio', blob, `voice.${ext}`);
      const res = await fetch('/api/transcribe', { method: 'POST', body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? `Transcription failed (${res.status})`);
      if (data?.text) onTextRef.current(data.text);
      else setError("Couldn't hear anything. Try again a bit closer to the microphone.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setState('idle');
    }
  }, []);

  const start = useCallback(async () => {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = s;
      const mime = pickMime();
      const r = new MediaRecorder(s, mime ? { mimeType: mime } : undefined);
      chunks.current = [];
      cancelled.current = false;

      r.ondataavailable = (e) => {
        if (e.data.size) chunks.current.push(e.data);
      };
      r.onstop = () => {
        release();
        if (cancelled.current) {
          setState('idle');
          return;
        }
        const blob = new Blob(chunks.current, { type: r.mimeType || mime || 'audio/webm' });
        if (blob.size < 1500) {
          setState('idle');
          setError('No audio captured. Try again.');
          return;
        }
        void transcribe(blob);
      };

      recorder.current = r;
      r.start();
      setSeconds(0);
      setState('recording');
      timer.current = window.setInterval(() => setSeconds((n) => n + 1), 1000);
    } catch (e) {
      release();
      setState('idle');
      const name = (e as DOMException).name;
      setError(
        name === 'NotAllowedError'
          ? 'Microphone access is blocked. Allow it in your browser settings and try again.'
          : name === 'NotFoundError'
            ? 'No microphone found.'
            : 'Could not start recording.'
      );
    }
  }, [release, transcribe]);

  // Auto-finish long recordings
  useEffect(() => {
    if (state === 'recording' && seconds >= MAX_SECONDS) stop();
  }, [state, seconds, stop]);

  // Clear errors after a while
  useEffect(() => {
    if (!error) return;
    const t = window.setTimeout(() => setError(null), 6000);
    return () => window.clearTimeout(t);
  }, [error]);

  // Clean up on unmount
  useEffect(
    () => () => {
      cancelled.current = true;
      if (recorder.current?.state === 'recording') recorder.current.stop();
      release();
    },
    [release]
  );

  return { supported, state, seconds, error, start, stop, cancel };
}