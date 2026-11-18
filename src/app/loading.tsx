// Shown while a page is still loading on the server. A short gold ruler that
// breathes slowly (and stays still when reduced motion is on), plus a status
// for screen readers.
export default function Loading() {
  return (
    <div
      role="status"
      className="flex w-full flex-1 flex-col items-center justify-center gap-4 px-5 py-24"
    >
      <div
        aria-hidden
        className="takar h-2 w-40 animate-pulse motion-reduce:animate-none"
      />
      <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
        Memuat…
      </p>
    </div>
  );
}
