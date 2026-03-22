'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Chrome, Check } from 'lucide-react'

const BENEFITS = [
  '3 free reels every month',
  'AI script + visuals + voice',
  'No credit card required',
]

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !email || !password) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    router.push('/dashboard')
  }

  const handleGoogle = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-[420px] space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Start making reels in under 60 seconds
        </p>
      </div>

      {/* Benefits */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {BENEFITS.map(b => (
          <div key={b} className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-green-400 shrink-0" />
            <span className="text-xs text-muted-foreground">{b}</span>
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">

        {/* Google */}
        <Button
          variant="outline"
          className="w-full gap-2.5 h-10 rounded-xl font-medium"
          onClick={handleGoogle}
          disabled={loading}
        >
          <Chrome className="w-4 h-4" />
          Continue with Google
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium">Full name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Jordan Lee"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={loading}
              autoFocus
              className="h-10 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              className="h-10 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                className="h-10 rounded-xl pr-10"
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-10 rounded-xl font-semibold"
            disabled={loading || !name || !email || !password}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Creating account…
              </div>
            ) : 'Create free account'}
          </Button>

          <p className="text-center text-[11px] text-muted-foreground leading-relaxed">
            By signing up you agree to our{' '}
            <a href="#" className="hover:text-foreground underline underline-offset-2">Terms</a>
            {' '}and{' '}
            <a href="#" className="hover:text-foreground underline underline-offset-2">Privacy Policy</a>.
          </p>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-foreground font-medium hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  )
}
