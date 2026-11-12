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
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const audioData = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const audioFrame = useRef<number | null>(null);
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
    if (audioFrame.current !== null) {
      cancelAnimationFrame(audioFrame.current);
      audioFrame.current = null;
    }
    analyser.current = null;
    audioData.current = null;
    const context = audioContext.current;
    audioContext.current = null;
    if (context && context.state !== 'closed') void context.close();
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
      setAudioLevel(0);
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
      if (typeof window.AudioContext === 'function') {
        const context = new window.AudioContext();
        const meter = context.createAnalyser();
        meter.fftSize = 512;
        meter.smoothingTimeConstant = 0.72;
        context.createMediaStreamSource(s).connect(meter);
        audioContext.current = context;
        analyser.current = meter;
        audioData.current = new Uint8Array(new ArrayBuffer(meter.fftSize));
        if (context.state === 'suspended') await context.resume();

        let lastLevelUpdate = 0;
        const measureAudio = (timestamp: number) => {
          const currentAnalyser = analyser.current;
          const data = audioData.current;
          if (!currentAnalyser || !data) return;

          currentAnalyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const sample = (data[i] - 128) / 128;
            sum += sample * sample;
          }
          if (timestamp - lastLevelUpdate >= 50) {
            setAudioLevel(Math.min(Math.sqrt(sum / data.length) * 6, 1));
            lastLevelUpdate = timestamp;
          }
          audioFrame.current = requestAnimationFrame(measureAudio);
        };
        audioFrame.current = requestAnimationFrame(measureAudio);
      }

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
          setAudioLevel(0);
          return;
        }
        const blob = new Blob(chunks.current, { type: r.mimeType || mime || 'audio/webm' });
        if (blob.size < 1500) {
          setState('idle');
          setAudioLevel(0);
          setError('No audio captured. Try again.');
          return;
        }
        setAudioLevel(0);
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
      setAudioLevel(0);
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

  return { supported, state, seconds, audioLevel, error, start, stop, cancel };
}