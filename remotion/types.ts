export interface SceneProps {
  id: string
  sortOrder: number
  type: 'hook' | 'context' | 'value' | 'cta'
  scriptText: string
  captionText: string | null
  imageUrl: string
  audioUrl: string
  startSec: number
  endSec: number
}

export interface TemplateProps {
  scenes: SceneProps[]
  totalDurationSec: number
}
