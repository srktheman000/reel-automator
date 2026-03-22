import { Sparkles, ImageIcon, Mic, Zap, LayoutTemplate, Globe } from 'lucide-react'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Script Writer',
    description: 'Gemini 2.0 Flash reads your content and writes a structured reel script — hook, context, value, CTA — optimised for watch time.',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
  },
  {
    icon: ImageIcon,
    title: 'Auto Scene Visuals',
    description: 'Each scene gets an AI-generated image that matches the mood and message. No stock photos, no Canva needed.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Mic,
    title: 'Voice & Caption Sync',
    description: 'Professional-quality AI voiceover via Google TTS, with captions automatically synced to every scene.',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
  {
    icon: LayoutTemplate,
    title: '5 Creator Templates',
    description: 'Pick from Educational, Marketing, Entertainment, Storytelling, or Product Demo — each with its own pacing and visual style.',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
  },
  {
    icon: Zap,
    title: 'One-click Regeneration',
    description: 'Not happy with a scene? Chat with the AI editor to tweak any line, swap an image, or rewrite the entire hook in seconds.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
  },
  {
    icon: Globe,
    title: 'Export to Every Platform',
    description: 'Download as a ready-to-upload 9:16 MP4. Optimised for YouTube Shorts, Instagram Reels, and TikTok in one click.',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Everything you need
          </p>
          <h2
            className="text-4xl sm:text-5xl tracking-tight text-foreground mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            From raw idea to finished reel
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            The complete pipeline — writing, visuals, audio, captions — handled by AI so you can focus on creating more, not editing longer.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/50 rounded-2xl overflow-hidden border border-border/50">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-card p-7 group hover:bg-accent/20 transition-colors duration-200"
              >
                <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-5`}>
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
