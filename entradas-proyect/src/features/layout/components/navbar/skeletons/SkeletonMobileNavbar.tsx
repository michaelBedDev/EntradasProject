export default function SkeletonMobileNavbar() {
  return (
    <div className="lg:hidden fixed bottom-0 z-40 w-[100vw] bg-background/80 backdrop-blur-xl border-t border-border">
      <div className="flex justify-around p-1">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-2 px-3">
              <div className="p-1.5 rounded-full">
                <div className="h-5 w-5 bg-muted animate-pulse rounded-full" />
              </div>
              <div className="h-3 w-12 bg-muted animate-pulse rounded-full mt-0.5" />
            </div>
          ))}
      </div>
    </div>
  );
}
