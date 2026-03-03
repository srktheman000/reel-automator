'use client'

import { useMemo } from 'react'
import { Player } from '@remotion/player'
import { EducationalTemplate } from '@/remotion/templates/educational'
import { MarketingTemplate } from '@/remotion/templates/marketing'
import { EntertainmentTemplate } from '@/remotion/templates/entertainment'
import { StorytellingTemplate } from '@/remotion/templates/storytelling'
import { ProductDemoTemplate } from '@/remotion/templates/product-demo'
import { REEL_WIDTH, REEL_HEIGHT, REEL_FPS } from '@/remotion/constants'
import type { TemplateProps } from '@/remotion/types'
import type { TemplateId } from '@/lib/ai/prompts/reel-chat'
import type { ReelScene } from '@/lib/supabase/types'

interface RemotionPreviewProps {
  template: TemplateId
  scenes: ReelScene[]
  signedImageUrls: Record<string, string>
  signedAudioUrls: Record<string, string>
  totalDurationSec: number
}

const TEMPLATE_COMPONENTS: Record<TemplateId, React.ComponentType<TemplateProps>> = {
  educational: EducationalTemplate,
  marketing: MarketingTemplate,
  entertainment: EntertainmentTemplate,
  storytelling: StorytellingTemplate,
  'product-demo': ProductDemoTemplate,
}

export function RemotionPreview({
  template,
  scenes,
  signedImageUrls,
  signedAudioUrls,
  totalDurationSec,
}: RemotionPreviewProps) {
  const TemplateComponent = TEMPLATE_COMPONENTS[template]

  const inputProps = useMemo<TemplateProps>(() => ({
    totalDurationSec,
    scenes: scenes.map(s => ({
      id: s.id,
      sortOrder: s.sort_order,
      type: s.type,
      scriptText: s.script_text,
      captionText: s.caption_text,
      imageUrl: s.image_url ? (signedImageUrls[s.image_url] ?? '') : '',
      audioUrl: s.audio_url ? (signedAudioUrls[s.audio_url] ?? '') : '',
      startSec: Number(s.start_sec),
      endSec: Number(s.end_sec),
    })),
  }), [scenes, signedImageUrls, signedAudioUrls, totalDurationSec])

  const durationInFrames = Math.max(1, Math.ceil(totalDurationSec * REEL_FPS))

  return (
    <div className="w-full flex justify-center">
      <div style={{ width: 360, height: 640 }}>
        <Player
          component={TemplateComponent as unknown as React.ComponentType<Record<string, unknown>>}
          inputProps={inputProps as unknown as Record<string, unknown>}
          durationInFrames={durationInFrames}
          compositionWidth={REEL_WIDTH}
          compositionHeight={REEL_HEIGHT}
          fps={REEL_FPS}
          style={{ width: '100%', height: '100%', borderRadius: 16 }}
          controls
          loop
        />
      </div>
    </div>
  )
}
