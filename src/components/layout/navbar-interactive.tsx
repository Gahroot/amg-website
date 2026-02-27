"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/nav-data";
import { siteConfig } from "@/lib/site-config";

export function NavbarInteractive() {
  const [open, setOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <>
      {/* Theme toggle - visible on all screen sizes */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        <Sun className="size-4 hidden dark:block" />
        <Moon className="size-4 block dark:hidden" />
      </Button>

      {/* Mobile menu - visible only on small screens */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="font-mono uppercase tracking-wider text-sm">
                ◈ ANCHOR MILL GROUP
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground py-2 text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={siteConfig.portalUrl}
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground py-2 text-sm transition-colors"
              >
                Client Portal
              </Link>
              <Button size="sm" asChild className="mt-4">
                <Link href={siteConfig.scheduleUrl} onClick={() => setOpen(false)}>
                  Schedule a Call
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
