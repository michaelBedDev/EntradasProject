export default function SkeletonLinkbar({ length }: { length: number }) {
  return (
    <nav className="top-18 w-full z-40 hidden md:block">
      <div className="container mx-auto px-4 py-2 max-w-6xl">
        <div className="bg-background/60 dark:bg-background/40 backdrop-blur-md rounded-full shadow-sm border border-border/20 mx-auto max-w-fit">
          <div className="flex items-center justify-center h-10 px-2">
            {Array(length)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="relative">
                  <div className="relative flex items-center px-4 py-1.5 rounded-full transition-all duration-200 text-muted-foreground">
                    <div className="h-4 w-4 mr-2 flex items-center justify-center">
                      <div className="h-4 w-4 bg-muted animate-pulse rounded-full" />
                    </div>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded-full" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
