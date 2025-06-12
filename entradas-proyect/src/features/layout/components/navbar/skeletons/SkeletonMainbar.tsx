export default function SkeletonMainbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16">
        <div className="flex h-full items-center justify-between">
          {/* Logo skeleton */}
          <div className="flex items-center space-x-2">
            <div className="h-6 w-32 bg-muted animate-pulse rounded-md" />
          </div>

          {/* Botones de acción skeleton */}
          <div className="flex items-center gap-2">
            {/* Menú móvil skeleton */}
            <div className="md:hidden h-9 w-9 bg-muted animate-pulse rounded-md" />

            {/* Botón Enter App skeleton */}
            <div className="hidden md:block">
              <div className="h-9 w-28 bg-muted/80 animate-pulse rounded-lg border border-border/20" />
            </div>

            {/* Selector de tema y wallet skeleton */}
            <div className="hidden md:flex items-center gap-2">
              {/* Selector de tema skeleton */}
              <div className="h-9 w-9 bg-muted/80 animate-pulse rounded-md border border-border/20" />

              {/* Wallet button skeleton */}
              <div className="h-9 w-[140px] bg-muted/80 animate-pulse rounded-lg border border-border/20" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
