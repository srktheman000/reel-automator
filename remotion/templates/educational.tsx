import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion'
import { SceneBase } from '../components/scene-base'
import type { TemplateProps } from '../types'
import { REEL_FPS } from '../constants'

export function EducationalTemplate({ scenes, totalDurationSec }: TemplateProps) {
  const frame = useCurrentFrame()

  return (
    <div style={{ width: '100%', height: '100%', background: '#f8f9fa', fontFamily: 'system-ui, sans-serif' }}>
      {scenes.map((scene, index) => {
        const startFrame = Math.round(scene.startSec * REEL_FPS)
        const endFrame = Math.round(scene.endSec * REEL_FPS)
        const stepNumber = index + 1

        return (
          <SceneBase key={scene.id} scene={scene} startFrame={startFrame} endFrame={endFrame}>
            {(progress) => (
              <>
                {/* Dark gradient overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                }} />

                {/* Step badge */}
                <div style={{
                  position: 'absolute',
                  top: 60,
                  left: 60,
                  background: '#2563eb',
                  color: '#fff',
                  borderRadius: 50,
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 36,
                  fontWeight: 700,
                  opacity: interpolate(progress, [0, 0.15], [0, 1], { extrapolateRight: 'clamp' }),
                }}>
                  {scene.type === 'hook' ? '🎯' : stepNumber}
                </div>

                {/* Caption text */}
                {scene.captionText && (
                  <div style={{
                    position: 'absolute',
                    bottom: 80,
                    left: 60,
                    right: 60,
                    color: '#fff',
                    fontSize: 52,
                    fontWeight: 700,
                    lineHeight: 1.3,
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    transform: `translateY(${interpolate(progress, [0, 0.2], [40, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px)`,
                    opacity: interpolate(progress, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' }),
                  }}>
                    {scene.captionText}
                  </div>
                )}
              </>
            )}
          </SceneBase>
        )
      })}
    </div>
  )
}
