import { TextToSpeechClient } from '@google-cloud/text-to-speech'

const DEFAULT_VOICE = 'en-US-Journey-F'
const DEFAULT_LANGUAGE = 'en-US'

function buildTTSClient(): TextToSpeechClient {
  const credentials = process.env.GOOGLE_CLOUD_TTS_CREDENTIALS
  if (!credentials) throw new Error('GOOGLE_CLOUD_TTS_CREDENTIALS is not set')

  const parsed = JSON.parse(credentials)
  return new TextToSpeechClient({ credentials: parsed })
}

export async function synthesizeSpeech(opts: {
  text: string
  voiceName?: string
  speakingRate?: number
}): Promise<Buffer> {
  const client = buildTTSClient()
  const voiceName = opts.voiceName ?? DEFAULT_VOICE

  const [response] = await client.synthesizeSpeech({
    input: { text: opts.text.slice(0, 5000) },
    voice: {
      languageCode: DEFAULT_LANGUAGE,
      name: voiceName,
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: opts.speakingRate ?? 1.0,
    },
  })

  if (!response.audioContent) throw new Error('Google TTS returned no audio content')

  return Buffer.from(response.audioContent as Uint8Array)
}
