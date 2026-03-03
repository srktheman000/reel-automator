import { interpolate, Easing } from 'remotion'
import { SceneBase } from '../components/scene-base'
import type { TemplateProps } from '../types'
import { REEL_FPS } from '../constants'

export function StorytellingTemplate({ scenes }: TemplateProps) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#1a1a1a', fontFamily: 'Georgia, serif' }}>
      {scenes.map((scene) => {
        const startFrame = Math.round(scene.startSec * REEL_FPS)
        const endFrame = Math.round(scene.endSec * REEL_FPS)

        return (
          <SceneBase key={scene.id} scene={scene} startFrame={startFrame} endFrame={endFrame}>
            {(progress) => (
              <>
                {/* Cinematic letterbox bars */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: '#000' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: '#000' }} />

                {/* Vignette */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
                }} />

                {/* Lower-third caption */}
                {scene.captionText && (
                  <div style={{
                    position: 'absolute',
                    bottom: 160,
                    left: 60,
                    right: 60,
                    color: '#f5f5f0',
                    fontSize: 44,
                    fontStyle: 'italic',
                    lineHeight: 1.4,
                    borderLeft: '4px solid rgba(255,255,255,0.5)',
                    paddingLeft: 24,
                    opacity: interpolate(progress, [0.1, 0.35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                    transform: `translateY(${interpolate(progress, [0.1, 0.35], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) })}px)`,
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
