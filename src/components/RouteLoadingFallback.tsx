export default function RouteLoadingFallback() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-600 border-t-transparent" />
        <span className="font-semibold text-xs tracking-wider uppercase text-slate-400">
          Loading…
        </span>
      </div>
    </div>
  );
}