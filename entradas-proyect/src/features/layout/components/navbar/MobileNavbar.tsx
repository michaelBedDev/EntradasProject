import { LinkType } from "@/types/global";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

export default function MobileNavbar({
  links,
  icons,
}: {
  links: LinkType[];
  icons?: Record<string, LucideIcon>;
}) {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 z-40 w-[100vw] bg-background/80 backdrop-blur-xl border-t border-border">
      <div className="flex justify-around p-1">
        {/* Navegación móvil - Tabs inferiores */}
        {links.slice(0, 4).map((link) => {
          const isActive = pathname === link.href;
          const Icon = icons?.[link.icon];

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center justify-center py-2 px-3">
              <div
                className={`p-1.5 rounded-full ${isActive ? "bg-primary/10" : ""}`}>
                {Icon ? (
                  <div
                    className={`h-5 w-5 flex items-center justify-center ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}>
                    <Icon />
                  </div>
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-5 h-5" />
                )}
              </div>
              <span
                className={`text-xs mt-0.5 ${
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                }`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
