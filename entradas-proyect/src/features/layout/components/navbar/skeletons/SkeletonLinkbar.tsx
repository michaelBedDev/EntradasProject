export default function SkeletonLinkbar({ length }: { length: number }) {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 hidden md:block">
      <div className="container mx-auto px-4 py-2">
        <div className="bg-background/60 dark:bg-background/40 backdrop-blur-md rounded-full shadow-sm border border-border/20 mx-auto max-w-fit">
          <div className="flex items-center justify-center h-10 px-2">
            {Array(length)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="mx-2 h-6 w-20 bg-muted animate-pulse rounded-full"
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
