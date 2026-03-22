/** Shared pending UI while a route segment’s Server Components stream */
export default function RouteLoading() {
  return (
    <div className="section-y flex min-h-[40vh] w-full flex-col items-center justify-center bg-background">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
        role="status"
        aria-label="Loading page"
      />
      <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}
