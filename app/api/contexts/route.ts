import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 60

const textSchema = z.object({
  source_type: z.literal('text'),
  session_id: z.string().uuid(),
  text: z.string().min(1).max(20000),
})

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') ?? ''

  const supabase = await createClient()

  if (contentType.includes('application/json')) {
    const body = await req.json()
    const parsed = textSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { session_id, text } = parsed.data

    const { data, error } = await supabase
      .from('reel_contexts')
      .insert({ session_id, source_type: 'text', raw_text: text })
      .select('id, source_type, created_at')
      .single()

    if (error) {
      console.error('[POST /api/contexts]', error)
      return NextResponse.json({ error: 'Failed to save context', debug: { message: error.message, code: error.code, details: error.details } }, { status: 500 })
    }

    return NextResponse.json({ data: { id: data.id, char_count: text.length, source_type: 'text' } }, { status: 201 })
  }

  if (contentType.includes('multipart/form-data')) {
    let formData: FormData
    try {
      formData = await req.formData()
    } catch {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    const sessionId = formData.get('session_id')
    const file = formData.get('file')

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 })
    }

    const uuidResult = z.string().uuid().safeParse(sessionId)
    if (!uuidResult.success) {
      return NextResponse.json({ error: 'session_id must be a valid UUID' }, { status: 400 })
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required for PDF upload' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let rawText: string
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse')
      const result = await pdfParse(buffer)
      rawText = result.text.trim()
    } catch (err) {
      console.error('[POST /api/contexts] PDF parse error', err)
      return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 422 })
    }

    if (!rawText) {
      return NextResponse.json({ error: 'Could not extract any text from this PDF' }, { status: 422 })
    }

    // Upload original PDF to Supabase Storage
    const bucket = process.env.SUPABASE_STORAGE_BUCKET_CONTEXTS ?? 'reel-contexts'
    const storagePath = `${sessionId}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, buffer, { contentType: 'application/pdf', upsert: false })

    if (uploadError) {
      console.error('[POST /api/contexts] Storage upload error', uploadError)
      // Continue without storage — text extraction succeeded
    }

    const { data, error } = await supabase
      .from('reel_contexts')
      .insert({
        session_id: sessionId,
        source_type: 'pdf',
        raw_text: rawText.slice(0, 20000),
        storage_path: uploadError ? null : storagePath,
      })
      .select('id, source_type')
      .single()

    if (error) {
      console.error('[POST /api/contexts]', error)
      return NextResponse.json({ error: 'Failed to save context' }, { status: 500 })
    }

    return NextResponse.json({ data: { id: data.id, char_count: rawText.length, source_type: 'pdf' } }, { status: 201 })
  }

  return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 })
}
