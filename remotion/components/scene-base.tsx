import { useCurrentFrame, useVideoConfig, Audio, Img, interpolate, Easing } from 'remotion'
import type { SceneProps } from '../types'
import { REEL_FPS } from '../constants'

interface SceneBaseProps {
  scene: SceneProps
  startFrame: number
  endFrame: number
  children?: (progress: number) => React.ReactNode
}

export function SceneBase({ scene, startFrame, endFrame, children }: SceneBaseProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const sceneFrame = frame - startFrame
  const sceneDuration = endFrame - startFrame
  const progress = Math.min(1, Math.max(0, sceneFrame / sceneDuration))

  const opacity = interpolate(
    sceneFrame,
    [0, 8, sceneDuration - 8, sceneDuration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.ease }
  )

  if (frame < startFrame || frame >= endFrame) return null

  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      {scene.imageUrl && (
        <Img
          src={scene.imageUrl}
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }}
        />
      )}
      {scene.audioUrl && (
        <Audio src={scene.audioUrl} startFrom={0} />
      )}
      {children && children(progress)}
    </div>
  )
}
