export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-5 bg-[#030303]"
    >
      <div className="relative h-14 w-14">
        <span className="absolute inset-0 rounded-full border-2 border-white/[0.08]" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-300 border-r-rose-300 motion-reduce:animate-none" />
        <span className="absolute inset-[18px] rounded-full bg-gradient-to-br from-indigo-400 to-rose-400 motion-safe:animate-pulse" />
      </div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/50">
        Loading
      </p>
      <span className="sr-only">Loading page</span>
    </div>
  );
}