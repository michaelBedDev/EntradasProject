export default function SkeletonMainbar() {
  return (
    <div className="w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-8 h-16 max-w-6xl">
        <div className="flex h-full items-center justify-between">
          {/* Logo skeleton */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="h-6 w-32 bg-muted animate-pulse rounded-md" />
            </div>
          </div>

          {/* Botones de acción skeleton */}
          <div className="flex items-center gap-2">
            {/* Menú móvil skeleton */}
            <div className="md:hidden h-9 w-9 bg-muted animate-pulse rounded-md" />

            {/* Selector de tema y wallet skeleton */}
            <div className="hidden md:flex items-center gap-2">
              {/* Selector de tema skeleton */}
              <div className="h-8 w-8 bg-muted/80 animate-pulse rounded-md" />

              {/* Wallet button skeleton */}
              <div className="h-8 w-[140px] bg-muted/80 animate-pulse rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
