export function LoadingSession({ loadingText }: { loadingText: string }) {
  return (
    <div className="container mx-auto px-4 py-24 max-w-7xl w-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{loadingText}</p>
      </div>
    </div>
  );
}
