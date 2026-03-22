import Link from 'next/link'
import { Video } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal header */}
      <header className="h-14 flex items-center justify-center border-b border-border/40 px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-95">
            <Video className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm text-foreground">ReelAI</span>
        </Link>
      </header>

      {/* Background effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative">
        {children}
      </main>

      <footer className="h-12 flex items-center justify-center">
        <p className="text-xs text-muted-foreground">
          © 2026 ReelAI ·{' '}
          <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
          {' · '}
          <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
        </p>
      </footer>
    </div>
  )
}
