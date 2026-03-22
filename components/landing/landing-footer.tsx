import Link from 'next/link'
import { Video } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t border-border/40 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Video className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm text-foreground">ReelAI</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI-powered short-form video creation for content creators.
            </p>
          </div>

          {/* Links */}
          {[
            {
              heading: 'Product',
              links: [
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Changelog', href: '#' },
              ],
            },
            {
              heading: 'Company',
              links: [
                { label: 'About', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Contact', href: '#' },
              ],
            },
            {
              heading: 'Legal',
              links: [
                { label: 'Privacy', href: '#' },
                { label: 'Terms', href: '#' },
                { label: 'Cookies', href: '#' },
              ],
            },
          ].map(col => (
            <div key={col.heading}>
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">{col.heading}</p>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 ReelAI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ for creators who ship every week.
          </p>
        </div>
      </div>
    </footer>
  )
}
