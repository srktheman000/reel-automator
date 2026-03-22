import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Try ReelAI and see what the AI can do with your content.',
    cta: 'Get started',
    ctaHref: '/signup',
    featured: false,
    features: [
      '3 reels per month',
      'All 5 templates',
      'AI script generation',
      'Scene visuals',
      'Captions included',
      'MP4 export (watermarked)',
    ],
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'For creators who publish consistently and need full power.',
    cta: 'Start Pro free for 7 days',
    ctaHref: '/signup?plan=pro',
    featured: true,
    badge: 'Most popular',
    features: [
      'Unlimited reels',
      'All 5 templates',
      'AI script + chat editor',
      'HD scene visuals',
      'AI voiceover (10 voices)',
      'Watermark-free MP4',
      'Priority generation',
    ],
  },
  {
    name: 'Agency',
    price: '$49',
    period: 'per month',
    description: 'For teams and agencies managing multiple creator accounts.',
    cta: 'Talk to us',
    ctaHref: '/signup?plan=agency',
    featured: false,
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Brand kit (fonts, colors)',
      'Bulk generation (API)',
      'Custom templates',
      'Priority support',
      'SLA guarantee',
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Pricing
          </p>
          <h2
            className="text-4xl sm:text-5xl tracking-tight text-foreground mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Simple, honest pricing
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Start free, upgrade when you're ready. No hidden fees, no credit card required.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative flex flex-col rounded-2xl border p-7 transition-all',
                plan.featured
                  ? 'bg-primary border-primary/30 shadow-2xl shadow-primary/10 scale-[1.02]'
                  : 'bg-card border-border/60 hover:border-border'
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="rounded-full px-3 text-[10px] font-semibold bg-foreground text-background">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <p className={cn(
                  'text-xs font-semibold uppercase tracking-widest mb-2',
                  plan.featured ? 'text-primary-foreground/60' : 'text-muted-foreground'
                )}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className={cn(
                    'text-4xl font-bold tracking-tight',
                    plan.featured ? 'text-primary-foreground' : 'text-foreground'
                  )}>
                    {plan.price}
                  </span>
                  <span className={cn(
                    'text-sm mb-1',
                    plan.featured ? 'text-primary-foreground/60' : 'text-muted-foreground'
                  )}>
                    /{plan.period}
                  </span>
                </div>
                <p className={cn(
                  'text-sm leading-relaxed',
                  plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'
                )}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className={cn(
                      'w-4 h-4 mt-px shrink-0',
                      plan.featured ? 'text-primary-foreground' : 'text-foreground'
                    )} />
                    <span className={cn(
                      'text-sm',
                      plan.featured ? 'text-primary-foreground/80' : 'text-foreground'
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaHref}>
                <Button
                  className={cn(
                    'w-full rounded-xl',
                    plan.featured
                      ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                      : ''
                  )}
                  variant={plan.featured ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
