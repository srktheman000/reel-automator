import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Play } from 'lucide-react'

// Mock phone reel frame — pure CSS, no images needed
function ReelPhoneMock() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Warm glow behind phone */}
      <div className="absolute inset-0 bg-amber-400/10 rounded-full blur-3xl scale-75 opacity-80" />

      {/* Phone shell */}
      <div className="relative w-[220px] sm:w-[260px] h-[440px] sm:h-[520px] rounded-[40px] border-[6px] border-foreground/10 bg-stone-900 shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-7 bg-black/50 flex items-center justify-center z-10">
          <div className="w-20 h-4 bg-stone-800 rounded-full" />
        </div>

        {/* Reel content */}
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 bg-gradient-to-b from-blue-800 to-indigo-950 flex flex-col items-center justify-center px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <span className="text-lg">⚡</span>
            </div>
            <p className="text-white text-[11px] font-semibold leading-snug mb-1">
              90% of creators burn out within 6 months
            </p>
            <p className="text-white/50 text-[9px] leading-relaxed">
              Here's the system that changes that.
            </p>
          </div>

          {/* Caption bar */}
          <div className="absolute bottom-0 inset-x-0 pb-4 px-3">
            <div className="bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2 mb-2">
              <p className="text-white text-[9px] font-medium leading-snug text-center">
                5 Creator Burnout Signs → <span className="text-blue-300">Educational</span>
              </p>
            </div>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-white text-sm">❤️</div>
                  <div className="text-white/60 text-[8px]">124K</div>
                </div>
                <div className="text-center">
                  <div className="text-white text-sm">💬</div>
                  <div className="text-white/60 text-[8px]">2.1K</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-white text-sm">↗️</div>
                <div className="text-white/60 text-[8px]">Share</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI badge */}
        <div className="absolute top-10 right-2 bg-primary/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 shadow-lg">
          <Sparkles className="w-2.5 h-2.5 text-primary-foreground" />
          <span className="text-[8px] text-primary-foreground font-semibold">AI Made</span>
        </div>
      </div>

      {/* Floating stat cards */}
      <div className="absolute -left-4 sm:-left-10 top-20 bg-card border border-border shadow-lg rounded-2xl px-3 py-2.5">
        <p className="text-[10px] text-muted-foreground">Generated in</p>
        <p className="text-sm font-bold text-foreground">47 seconds</p>
      </div>
      <div className="absolute -right-4 sm:-right-10 bottom-24 bg-card border border-border shadow-lg rounded-2xl px-3 py-2.5">
        <p className="text-[10px] text-muted-foreground">Views earned</p>
        <p className="text-sm font-bold text-foreground">2.4M ↑</p>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background">
        {/* Subtle dot grid — adapts to light/dark */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Warm gradient orbs */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-amber-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-200/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: copy */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-foreground"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Turn any idea into a{' '}
                <span className="relative inline-block">
                  <span className="relative z-10">viral short</span>
                  <span
                    className="absolute inset-x-0 bottom-1 h-3 bg-amber-400/30 -skew-x-3 z-0 rounded-sm"
                    aria-hidden
                  />
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Paste any script, article, or notes — ReelAI writes, visualises, and voices your reel in under 60 seconds. Ready for YouTube Shorts, Instagram Reels, and TikTok.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/signup">
                <Button size="lg" className="rounded-full px-7 gap-2 text-sm font-semibold shadow-sm">
                  Start for free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#gallery">
                <Button variant="ghost" size="lg" className="rounded-full px-6 gap-2 text-sm">
                  <Play className="w-4 h-4" />
                  See examples
                </Button>
              </a>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              {[
                { value: '12,400+', label: 'creators' },
                { value: '340K+', label: 'reels made' },
                { value: '4.9★', label: 'rating' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-lg font-bold text-foreground tabular-nums">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
              <div className="text-xs text-muted-foreground/60 border-l border-border pl-6 hidden sm:block">
                No video editing skills required
              </div>
            </div>
          </div>

          {/* Right: phone mockup */}
          <div className="hidden lg:flex items-center justify-center">
            <ReelPhoneMock />
          </div>
        </div>
      </div>
    </section>
  )
}
