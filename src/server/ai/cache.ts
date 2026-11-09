// Caches an async loader. Failures are not cached; the last good value (or `empty`) is returned instead.
export function cached<T>(ttlMs: number, load: () => Promise<T>, empty: T) {
  let value: T | null = null;
  let at = 0;
  let inflight: Promise<T> | null = null;

  return async (): Promise<T> => {
    if (value !== null && Date.now() - at < ttlMs) return value;

    inflight ??= load()
      .then((v) => {
        value = v;
        at = Date.now();
        return v;
      })
      .catch((e) => {
        console.error("[ai] model list failed:", e?.message ?? e);
        return value ?? empty;
      })
      .finally(() => {
        inflight = null;
      });

    return inflight;
  };
}