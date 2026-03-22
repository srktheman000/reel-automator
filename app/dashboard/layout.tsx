'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Video, Plus, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DUMMY_USER } from '@/lib/dummy-data'

function DashboardNav() {
  const router = useRouter()

  return (
    <header className="h-14 border-b border-border flex items-center px-4 sm:px-6 gap-4 bg-card/70 backdrop-blur-sm sticky top-0 z-20">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 group mr-2">
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-95">
          <Video className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm text-foreground hidden sm:inline">ReelAI</span>
      </Link>

      {/* Plan badge */}
      <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wide border border-primary/20">
        {DUMMY_USER.plan}
      </span>

      <div className="flex-1" />

      {/* New reel CTA */}
      <Link href="/reels/new">
        <Button size="sm" className="gap-1.5 rounded-full px-4 shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Reel</span>
        </Button>
      </Link>

      {/* User avatar dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                {DUMMY_USER.initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-lg">
          {/* User info header */}
          <div className="px-3 py-2.5 border-b border-border">
            <p className="text-xs font-semibold text-foreground">{DUMMY_USER.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{DUMMY_USER.email}</p>
          </div>

          {/* Profile link */}
          <Link href="/dashboard/profile">
            <DropdownMenuItem className="gap-2.5 rounded-lg m-1 cursor-pointer">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          {/* Sign out */}
          <DropdownMenuItem
            className="gap-2.5 text-destructive focus:text-destructive rounded-lg m-1 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
