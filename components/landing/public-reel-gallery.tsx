import { PUBLIC_REELS } from '@/lib/dummy-data'
import { Play } from 'lucide-react'

function ReelCard({ reel }: { reel: typeof PUBLIC_REELS[0] }) {
  return (
    <div className="group relative w-[180px] sm:w-[200px] shrink-0">
      {/* Phone frame */}
      <div className="relative w-full aspect-[9/16] rounded-[28px] border border-white/10 overflow-hidden bg-gray-950 shadow-xl transition-transform duration-300 group-hover:-translate-y-2">
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-b ${reel.gradient} opacity-90`} />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col">
          {/* Notch */}
          <div className="h-6 flex items-center justify-center bg-black/30">
            <div className="w-14 h-3 bg-black/50 rounded-full" />
          </div>

          {/* Main scene */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 text-center gap-3">
            <div className="text-3xl">{reel.icon}</div>
            <p className="text-white text-xs font-semibold leading-snug">{reel.title}</p>
          </div>

          {/* Bottom info */}
          <div className="px-3 pb-4 space-y-2">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl px-2.5 py-2">
              <p className="text-white/80 text-[9px] font-mono">{reel.creator}</p>
              <p className="text-white text-[10px] font-bold">{reel.views} views</p>
            </div>
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-white fill-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Label below phone */}
      <div className="mt-3 text-center">
        <p className="text-xs font-medium text-foreground truncate">{reel.title}</p>
        <p className="text-[10px] text-muted-foreground">{reel.creator}</p>
      </div>
    </div>
  )
}

export function PublicReelGallery() {
  return (
    <section id="gallery" className="py-24 sm:py-32 border-t border-border/40 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          Real results
        </p>
        <h2
          className="text-4xl sm:text-5xl tracking-tight text-foreground mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Made with ReelAI
        </h2>
        <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
          Creators across niches are using ReelAI to consistently publish high-performing short-form content — without a video editor.
        </p>
      </div>

      {/* Horizontal scrolling reel gallery */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-8 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-8 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-5 sm:gap-6 px-8 sm:px-16 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {/* Duplicate for visual continuity */}
          {[...PUBLIC_REELS, ...PUBLIC_REELS].map((reel, i) => (
            <div key={`${reel.id}-${i}`} className="snap-start">
              <ReelCard reel={reel} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
