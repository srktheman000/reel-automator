export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string
          title: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'messages_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'sessions'
            referencedColumns: ['id']
          }
        ]
      }
      reel_contexts: {
        Row: {
          id: string
          session_id: string
          source_type: 'text' | 'pdf'
          raw_text: string
          storage_path: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          source_type: 'text' | 'pdf'
          raw_text: string
          storage_path?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          source_type?: 'text' | 'pdf'
          raw_text?: string
          storage_path?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reel_contexts_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'sessions'
            referencedColumns: ['id']
          }
        ]
      }
      reels: {
        Row: {
          id: string
          session_id: string
          context_id: string | null
          template: 'educational' | 'marketing' | 'entertainment' | 'storytelling' | 'product-demo'
          title: string | null
          status: 'pending' | 'generating-blueprint' | 'generating-assets' | 'ready' | 'failed'
          total_scenes: number | null
          duration_sec: number | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          context_id?: string | null
          template: 'educational' | 'marketing' | 'entertainment' | 'storytelling' | 'product-demo'
          title?: string | null
          status?: 'pending' | 'generating-blueprint' | 'generating-assets' | 'ready' | 'failed'
          total_scenes?: number | null
          duration_sec?: number | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          context_id?: string | null
          template?: 'educational' | 'marketing' | 'entertainment' | 'storytelling' | 'product-demo'
          title?: string | null
          status?: 'pending' | 'generating-blueprint' | 'generating-assets' | 'ready' | 'failed'
          total_scenes?: number | null
          duration_sec?: number | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reels_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'sessions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reels_context_id_fkey'
            columns: ['context_id']
            isOneToOne: false
            referencedRelation: 'reel_contexts'
            referencedColumns: ['id']
          }
        ]
      }
      reel_scenes: {
        Row: {
          id: string
          reel_id: string
          sort_order: number
          type: 'hook' | 'context' | 'value' | 'cta'
          script_text: string
          caption_text: string | null
          image_prompt: string | null
          start_sec: number
          end_sec: number
          image_url: string | null
          audio_url: string | null
          image_status: 'pending' | 'generating' | 'ready' | 'failed'
          audio_status: 'pending' | 'generating' | 'ready' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reel_id: string
          sort_order: number
          type: 'hook' | 'context' | 'value' | 'cta'
          script_text: string
          caption_text?: string | null
          image_prompt?: string | null
          start_sec: number
          end_sec: number
          image_url?: string | null
          audio_url?: string | null
          image_status?: 'pending' | 'generating' | 'ready' | 'failed'
          audio_status?: 'pending' | 'generating' | 'ready' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reel_id?: string
          sort_order?: number
          type?: 'hook' | 'context' | 'value' | 'cta'
          script_text?: string
          caption_text?: string | null
          image_prompt?: string | null
          start_sec?: number
          end_sec?: number
          image_url?: string | null
          audio_url?: string | null
          image_status?: 'pending' | 'generating' | 'ready' | 'failed'
          audio_status?: 'pending' | 'generating' | 'ready' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reel_scenes_reel_id_fkey'
            columns: ['reel_id']
            isOneToOne: false
            referencedRelation: 'reels'
            referencedColumns: ['id']
          }
        ]
      }
      generation_jobs: {
        Row: {
          id: string
          reel_id: string
          status: 'queued' | 'running' | 'done' | 'failed'
          total_steps: number
          done_steps: number
          error_message: string | null
          started_at: string | null
          finished_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reel_id: string
          status?: 'queued' | 'running' | 'done' | 'failed'
          total_steps?: number
          done_steps?: number
          error_message?: string | null
          started_at?: string | null
          finished_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reel_id?: string
          status?: 'queued' | 'running' | 'done' | 'failed'
          total_steps?: number
          done_steps?: number
          error_message?: string | null
          started_at?: string | null
          finished_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'generation_jobs_reel_id_fkey'
            columns: ['reel_id']
            isOneToOne: true
            referencedRelation: 'reels'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Convenience row types
export type Session = Database['public']['Tables']['sessions']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type ReelContext = Database['public']['Tables']['reel_contexts']['Row']
export type Reel = Database['public']['Tables']['reels']['Row']
export type ReelScene = Database['public']['Tables']['reel_scenes']['Row']
export type GenerationJob = Database['public']['Tables']['generation_jobs']['Row']

// Convenience insert types
export type ReelInsert = Database['public']['Tables']['reels']['Insert']
export type ReelSceneInsert = Database['public']['Tables']['reel_scenes']['Insert']
export type ReelContextInsert = Database['public']['Tables']['reel_contexts']['Insert']
