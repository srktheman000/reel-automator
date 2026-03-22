import { FileText, LayoutTemplate, Sparkles } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: FileText,
    title: 'Add your content',
    description: 'Paste a script, article, or notes. Or upload a PDF. The AI uses this as source material for your entire reel.',
    detail: 'Up to 2,000 characters · PDF extraction included',
  },
  {
    number: '02',
    icon: LayoutTemplate,
    title: 'Choose a template',
    description: 'Pick the style that fits your goal — educational deep-dives, punchy entertainment, or product marketing.',
    detail: '5 templates · Each optimised for platform algorithms',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Generate & export',
    description: 'Click Generate. The AI writes your script, creates scene visuals, records the voiceover, and assembles the reel.',
    detail: 'Ready in ~60 seconds · 9:16 MP4 download',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            How it works
          </p>
          <h2
            className="text-4xl sm:text-5xl tracking-tight text-foreground mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Three steps, sixty seconds
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            No video editing skills required. No timeline dragging. No render queue.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-7 left-[20%] right-[20%] h-px bg-border/60" aria-hidden />

          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative space-y-5">
                {/* Step icon */}
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-card border border-border shadow-sm">
                  <Icon className="w-6 h-6 text-foreground" />
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-[9px] font-bold text-primary-foreground">{i + 1}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  <p className="text-xs text-muted-foreground/60 font-mono">{step.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
