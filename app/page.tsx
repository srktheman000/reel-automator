import { LandingNav } from '@/components/landing/landing-nav'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { PublicReelGallery } from '@/components/landing/public-reel-gallery'
import { Pricing } from '@/components/landing/pricing'
import { LandingFooter } from '@/components/landing/landing-footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <PublicReelGallery />
        <Pricing />
      </main>
      <LandingFooter />
    </div>
  )
}
