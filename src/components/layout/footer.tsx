import Link from "next/link";
import { navLinks } from "@/lib/nav-data";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer role="contentinfo" className="bg-card/90 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Brand row */}
        <div className="mb-12">
          <h3 className="font-mono uppercase tracking-wider text-sm font-bold mb-3">
            ◈ ANCHOR MILL GROUP
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Comprehensive protection for a complex world. Tailored solutions for
            family offices, ultra-high-net-worth individuals and families, and
            executive leaders.
          </p>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Navigate */}
          <div>
            <h4 className="font-mono uppercase tracking-wider text-xs font-semibold text-muted-foreground mb-4">
              Navigate
            </h4>
            <ul className="space-y-2">
              {navLinks
                .filter((link) => link.href !== "/")
                .map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-mono uppercase tracking-wider text-xs font-semibold text-muted-foreground mb-4">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={siteConfig.portalUrl}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Client Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-mono uppercase tracking-wider text-xs font-semibold text-muted-foreground mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <Link
                  href={siteConfig.scheduleUrl}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Schedule a Call
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {siteConfig.copyrightYear} Anchor Mill Group Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>|</span>
            <span>Terms of Service</span>
            <span>|</span>
            <span>Confidential</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
