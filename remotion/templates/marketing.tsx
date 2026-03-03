import { interpolate, Easing } from 'remotion'
import { SceneBase } from '../components/scene-base'
import type { TemplateProps } from '../types'
import { REEL_FPS } from '../constants'

export function MarketingTemplate({ scenes }: TemplateProps) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#0f0f0f', fontFamily: 'system-ui, sans-serif' }}>
      {scenes.map((scene) => {
        const startFrame = Math.round(scene.startSec * REEL_FPS)
        const endFrame = Math.round(scene.endSec * REEL_FPS)
        const isCta = scene.type === 'cta'

        return (
          <SceneBase key={scene.id} scene={scene} startFrame={startFrame} endFrame={endFrame}>
            {(progress) => (
              <>
                {/* Full gradient overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: isCta
                    ? 'linear-gradient(135deg, rgba(234,179,8,0.9) 0%, rgba(239,68,68,0.9) 100%)'
                    : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                }} />

                {/* Bold heading */}
                {scene.captionText && (
                  <div style={{
                    position: 'absolute',
                    bottom: isCta ? undefined : 100,
                    top: isCta ? '50%' : undefined,
                    transform: isCta
                      ? `translateY(-50%) translateX(${interpolate(progress, [0, 0.25], [-80, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px)`
                      : `translateX(${interpolate(progress, [0, 0.25], [-80, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px)`,
                    left: 60,
                    right: 60,
                    color: '#fff',
                    fontSize: isCta ? 72 : 58,
                    fontWeight: 900,
                    lineHeight: 1.1,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    opacity: interpolate(progress, [0, 0.25], [0, 1], { extrapolateRight: 'clamp' }),
                  }}>
                    {scene.captionText}
                  </div>
                )}

                {/* Accent bar */}
                <div style={{
                  position: 'absolute',
                  bottom: isCta ? undefined : 80,
                  top: isCta ? 'calc(50% + 120px)' : undefined,
                  left: 60,
                  width: interpolate(progress, [0.1, 0.4], [0, 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                  height: 6,
                  background: '#eab308',
                  borderRadius: 3,
                }} />
              </>
            )}
          </SceneBase>
        )
      })}
    </div>
  )
}
