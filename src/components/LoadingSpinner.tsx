const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-2 border-muted" />
      <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin-slow" />
      <div className="absolute inset-2 rounded-full border-2 border-accent border-b-transparent animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
    </div>
    <p className="text-muted-foreground text-sm animate-pulse">Loading...</p>
  </div>
);

export default LoadingSpinner;
