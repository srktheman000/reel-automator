import { interpolate, Easing, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { SceneBase } from '../components/scene-base'
import type { TemplateProps } from '../types'
import { REEL_FPS } from '../constants'

export function EntertainmentTemplate({ scenes }: TemplateProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <div style={{ width: '100%', height: '100%', background: '#000', fontFamily: 'system-ui, sans-serif' }}>
      {scenes.map((scene) => {
        const startFrame = Math.round(scene.startSec * REEL_FPS)
        const endFrame = Math.round(scene.endSec * REEL_FPS)
        const sceneFrame = frame - startFrame

        return (
          <SceneBase key={scene.id} scene={scene} startFrame={startFrame} endFrame={endFrame}>
            {(progress) => {
              const bounce = spring({ frame: sceneFrame, fps, config: { damping: 10, stiffness: 100, mass: 0.5 } })
              return (
                <>
                  {/* Top caption — punchy style */}
                  {scene.captionText && (
                    <div style={{
                      position: 'absolute',
                      top: 100,
                      left: 40,
                      right: 40,
                      color: '#fff',
                      fontSize: 64,
                      fontWeight: 900,
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      WebkitTextStroke: '3px #000',
                      paintOrder: 'stroke fill',
                      transform: `scale(${interpolate(bounce, [0, 1], [0.5, 1])})`,
                      opacity: interpolate(progress, [0, 0.1], [0, 1], { extrapolateRight: 'clamp' }),
                    }}>
                      {scene.captionText}
                    </div>
                  )}

                  {/* Color flash for hook */}
                  {scene.type === 'hook' && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(255, 220, 0, 0.15)',
                      opacity: interpolate(sceneFrame, [0, 6, 12], [1, 0.5, 0], { extrapolateRight: 'clamp' }),
                    }} />
                  )}
                </>
              )
            }}
          </SceneBase>
        )
      })}
    </div>
  )
}
