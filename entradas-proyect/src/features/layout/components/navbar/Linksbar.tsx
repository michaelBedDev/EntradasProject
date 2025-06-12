import Link from "next/link";
import { motion } from "framer-motion";
import { LinkType } from "@/types/global";
import { usePathname } from "next/navigation";

import { LucideIcon } from "lucide-react";

export default function Linksbar({
  links,
  icons,
}: {
  links: LinkType[];
  icons?: Record<string, LucideIcon>;
}) {
  const pathname = usePathname();

  return (
    <nav className="fixed top-16 left-0 right-0 z-40 hidden md:block">
      <div className="container mx-auto px-4 py-2">
        <div className="bg-background/60 dark:bg-background/40 backdrop-blur-md rounded-full shadow-sm border border-border/20 mx-auto max-w-fit">
          <div className="flex items-center justify-center h-10 px-2">
            {links.map((link: LinkType) => {
              const isActive = pathname === link.href;
              const Icon = icons?.[link.icon];

              return (
                <div key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={`
    relative flex items-center px-4 py-1.5 rounded-full transition-all duration-200
    ${
      isActive
        ? "text-primary font-medium"
        : "text-muted-foreground hover:text-foreground hover:bg-background/80"
    }
      `}>
                    <div className="h-4 w-4 mr-2 flex items-center justify-center">
                      {Icon && (
                        <Icon className={`${isActive ? "text-primary" : ""}`} />
                      )}
                    </div>
                    <span className="text-sm whitespace-nowrap">{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                        className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
