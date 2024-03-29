export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]
type array = Json[]
export interface Database {
  public: {
    Tables: {
      countries: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      liked_trainers: {
        Row: {
          created_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "liked_trainers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      Location: {
        Row: {
          created_at: string | null
          id: number
          Latitiude: number | null
          Longitude: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          Latitiude?: number | null
          Longitude?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          Latitiude?: number | null
          Longitude?: number | null
        }
        Relationships: []
      }
      Ratings: {
        Row: {
          author: string | null
          comment: string | null
          created_at: string | null
          id: number
          rating: number
        }
        Insert: {
          author?: string | null
          comment?: string | null
          created_at?: string | null
          id?: number
          rating: number
        }
        Update: {
          author?: string | null
          comment?: string | null
          created_at?: string | null
          id?: number
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "Ratings_author_fkey"
            columns: ["author"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      trainer: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          instagram: string | null
          location: string | null
          price_range_end: number | null
          price_range_start: number | null
          website: string | null
          yoe: number | null
          tags: array | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id: string
          instagram?: string | null
          location?: string | null
          price_range_end?: number | null
          price_range_start?: number | null
          website?: string | null
          yoe?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          instagram?: string | null
          location?: string | null
          price_range_end?: number | null
          price_range_start?: number | null
          website?: string | null
          yoe?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trainer_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainer_location_fkey"
            columns: ["location"]
            referencedRelation: "trainer"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string | null
          first_name: string | null
          id: string
          isuser: boolean | null
          last_name: string | null
          location: number | null
          phone_number: number | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          isuser?: boolean | null
          last_name?: string | null
          location?: number | null
          phone_number?: number | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          isuser?: boolean | null
          last_name?: string | null
          location?: number | null
          phone_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_location_fkey"
            columns: ["location"]
            referencedRelation: "Location"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
