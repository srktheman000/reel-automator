'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DUMMY_USER, DUMMY_REELS } from '@/lib/dummy-data'
import {
  Camera, CheckCircle2, Video, Zap, TrendingUp,
  Youtube, Instagram, Twitter, Link as LinkIcon, Save,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PLATFORM_LINKS = [
  { id: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'youtube.com/@yourchannel', color: 'text-red-500' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'instagram.com/yourhandle', color: 'text-pink-500' },
  { id: 'twitter', label: 'X / Twitter', icon: Twitter, placeholder: 'x.com/yourhandle', color: 'text-sky-500' },
  { id: 'website', label: 'Website', icon: LinkIcon, placeholder: 'yourwebsite.com', color: 'text-muted-foreground' },
]

const NICHES = [
  'Tech', 'Business', 'Lifestyle', 'Finance', 'Health', 'Education',
  'Entertainment', 'Travel', 'Food', 'Fitness', 'Marketing', 'Productivity',
]

const STATS = [
  {
    label: 'Total reels',
    value: DUMMY_REELS.length,
    icon: Video,
    sub: 'all time',
  },
  {
    label: 'Ready to post',
    value: DUMMY_REELS.filter(r => r.status === 'ready').length,
    icon: CheckCircle2,
    sub: 'completed',
  },
  {
    label: 'Est. total views',
    value: '2.4M',
    icon: TrendingUp,
    sub: 'from AI reels',
  },
  {
    label: 'Plan',
    value: DUMMY_USER.plan,
    icon: Zap,
    sub: 'unlimited reels',
  },
]

function Section({ title, description, children }: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function SaveButton({ saved }: { saved: boolean }) {
  return (
    <Button size="sm" className="gap-1.5 rounded-xl" disabled={saved}>
      {saved ? (
        <><CheckCircle2 className="w-3.5 h-3.5" /> Saved</>
      ) : (
        <><Save className="w-3.5 h-3.5" /> Save changes</>
      )}
    </Button>
  )
}

export default function ProfilePage() {
  const [name, setName] = useState(DUMMY_USER.name)
  const [bio, setBio] = useState('Content creator focused on tech, productivity, and building in public.')
  const [niche, setNiche] = useState<string[]>(['Tech', 'Productivity'])
  const [platforms, setPlatforms] = useState<Record<string, string>>({
    youtube: '',
    instagram: '',
    twitter: '',
    website: '',
  })
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleNiche = (n: string) => {
    setNiche(prev =>
      prev.includes(n) ? prev.filter(x => x !== n) : prev.length < 3 ? [...prev, n] : prev
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-10">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your public profile and creator preferences.</p>
      </div>

      {/* ── Avatar + name hero ── */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <Avatar className="w-20 h-20 text-2xl">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-2xl">
                {name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-card border-2 border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
              aria-label="Change avatar"
            >
              <Camera className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>

          {/* Name + email + plan */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-semibold text-foreground">{name}</h2>
              <Badge className="text-[10px] px-2 py-0.5 font-semibold bg-primary/10 text-primary border-0">
                {DUMMY_USER.plan}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{DUMMY_USER.email}</p>
            <p className="text-xs text-muted-foreground/60">Member since March 2026</p>
          </div>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 space-y-2">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xl font-bold text-foreground tabular-nums">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground leading-snug">{stat.label}</p>
                <p className="text-[10px] text-muted-foreground/60">{stat.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      <Separator />

      {/* ── Basic info ── */}
      <Section title="Basic information" description="How you appear to your audience and teammates.">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="display-name" className="text-xs font-medium">Display name</Label>
              <Input
                id="display-name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="h-10 rounded-xl bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                defaultValue={DUMMY_USER.email}
                className="h-10 rounded-xl bg-background"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-xs font-medium">
              Bio
              <span className="text-muted-foreground font-normal ml-1.5">({bio.length}/160)</span>
            </Label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value.slice(0, 160))}
              placeholder="What do you create? Who's your audience?"
              className={cn(
                'w-full px-3 py-2 text-sm rounded-xl bg-background border border-input',
                'resize-none leading-relaxed text-foreground placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors'
              )}
            />
          </div>

          <div className="flex justify-end">
            <SaveButton saved={saved} />
          </div>
        </div>
      </Section>

      {/* ── Creator niche ── */}
      <Section
        title="Creator niche"
        description="Choose up to 3 niches. The AI uses these to tailor your scripts and hooks."
      >
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {NICHES.map(n => {
              const selected = niche.includes(n)
              const maxed = !selected && niche.length >= 3
              return (
                <button
                  key={n}
                  onClick={() => toggleNiche(n)}
                  disabled={maxed}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                    selected
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : maxed
                      ? 'bg-muted/40 text-muted-foreground/40 border-border/40 cursor-not-allowed'
                      : 'bg-muted/60 text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
                  )}
                >
                  {n}
                </button>
              )
            })}
          </div>
          {niche.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Selected: <span className="text-foreground font-medium">{niche.join(', ')}</span>
              {niche.length < 3 && <span className="text-muted-foreground/60"> · pick {3 - niche.length} more</span>}
            </p>
          )}
          <div className="flex justify-end">
            <SaveButton saved={false} />
          </div>
        </div>
      </Section>

      {/* ── Platform links ── */}
      <Section
        title="Platform links"
        description="Add your social channels so your reel exports auto-fill the right attribution."
      >
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          {PLATFORM_LINKS.map(p => {
            const Icon = p.icon
            return (
              <div key={p.id} className="flex items-center gap-3">
                <Icon className={cn('w-4 h-4 shrink-0', p.color)} />
                <div className="flex-1">
                  <Input
                    placeholder={p.placeholder}
                    value={platforms[p.id] ?? ''}
                    onChange={e => setPlatforms(prev => ({ ...prev, [p.id]: e.target.value }))}
                    className="h-9 rounded-xl text-sm bg-background"
                  />
                </div>
              </div>
            )
          })}
          <div className="flex justify-end pt-1">
            <SaveButton saved={false} />
          </div>
        </div>
      </Section>

      {/* ── Plan ── */}
      <Section title="Subscription" description="Your current plan and billing details.">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">Pro Plan</p>
                <Badge className="text-[10px] px-2 bg-primary/10 text-primary border-0">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">$19 / month · renews Apr 21, 2026</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">Manage</Button>
          </div>

          <Separator />

          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            {[
              { label: 'Reels this month', value: '12 / ∞' },
              { label: 'Voiceover voices', value: '10 available' },
              { label: 'Export quality', value: 'HD · No watermark' },
            ].map(item => (
              <div key={item.label} className="bg-muted/40 rounded-xl px-3 py-2.5">
                <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            To cancel or change your plan, visit the{' '}
            <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
              billing portal
            </a>.
          </p>
        </div>
      </Section>

      {/* ── Danger zone ── */}
      <Section title="Account" description="Irreversible actions — handle with care.">
        <div className="bg-card border border-destructive/20 rounded-2xl p-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Delete account</p>
              <p className="text-xs text-muted-foreground">Permanently remove your account and all reels. This cannot be undone.</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive shrink-0">
              Delete account
            </Button>
          </div>
        </div>
      </Section>

    </div>
  )
}
