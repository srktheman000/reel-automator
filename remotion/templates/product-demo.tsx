import { interpolate, Easing } from 'remotion'
import { SceneBase } from '../components/scene-base'
import type { TemplateProps } from '../types'
import { REEL_FPS } from '../constants'

export function ProductDemoTemplate({ scenes }: TemplateProps) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#ffffff', fontFamily: 'system-ui, sans-serif' }}>
      {scenes.map((scene) => {
        const startFrame = Math.round(scene.startSec * REEL_FPS)
        const endFrame = Math.round(scene.endSec * REEL_FPS)
        const isCta = scene.type === 'cta'

        return (
          <SceneBase key={scene.id} scene={scene} startFrame={startFrame} endFrame={endFrame}>
            {(progress) => (
              <>
                {/* Light overlay on image area */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(255,255,255,0.15)',
                }} />

                {/* Bottom panel */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: isCta ? 340 : 280,
                  background: '#fff',
                  borderTopLeftRadius: 32,
                  borderTopRightRadius: 32,
                  padding: '32px 48px',
                  transform: `translateY(${interpolate(progress, [0, 0.2], [60, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px)`,
                  opacity: interpolate(progress, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' }),
                }}>
                  {/* Type badge */}
                  <div style={{
                    display: 'inline-block',
                    background: isCta ? '#2563eb' : '#f1f5f9',
                    color: isCta ? '#fff' : '#475569',
                    fontSize: 24,
                    fontWeight: 600,
                    padding: '6px 16px',
                    borderRadius: 100,
                    marginBottom: 16,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {scene.type}
                  </div>

                  {/* Caption */}
                  {scene.captionText && (
                    <div style={{
                      color: '#0f172a',
                      fontSize: isCta ? 52 : 44,
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}>
                      {scene.captionText}
                    </div>
                  )}
                </div>
              </>
            )}
          </SceneBase>
        )
      })}
    </div>
  )
}
