"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { TrendingUp } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/markets/us", label: "US Markets" },
    { href: "/markets/ngx", label: "NGX Markets" },
  ];

  return (
    <nav 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xl font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            aria-label="SignalIQ Home"
          >
            <TrendingUp className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              SignalIQ
            </span>
          </Link>
          <div className="flex items-center gap-6" role="list">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="listitem"
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm px-2 py-1",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-primary" aria-hidden="true" />
                )}
              </Link>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
