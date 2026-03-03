'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { SceneCard } from './scene-card'
import type { ReelScene } from '@/lib/supabase/types'

interface SceneListProps {
  scenes: ReelScene[]
  signedImageUrls: Record<string, string>
  selectedSceneId?: string
  onSelectScene: (id: string) => void
}

export function SceneList({ scenes, signedImageUrls, selectedSceneId, onSelectScene }: SceneListProps) {
  if (scenes.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
        No scenes yet
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-2">
        {scenes.map((scene, index) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            index={index}
            signedImageUrl={scene.image_url ? signedImageUrls[scene.image_url] : undefined}
            isSelected={selectedSceneId === scene.id}
            onClick={() => onSelectScene(scene.id)}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
