export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          action: string
          actor_name: string
          created_at: string
          entity: string
          entity_title: string | null
          id: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          action: string
          actor_name?: string
          created_at?: string
          entity: string
          entity_title?: string | null
          id?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          action?: string
          actor_name?: string
          created_at?: string
          entity?: string
          entity_title?: string | null
          id?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          created_at: string
          folder: string
          id: string
          mime_type: string | null
          name: string
          size_bytes: number | null
          storage_path: string | null
          tags: string[]
          updated_at: string
          url: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          folder?: string
          id?: string
          mime_type?: string | null
          name: string
          size_bytes?: number | null
          storage_path?: string | null
          tags?: string[]
          updated_at?: string
          url: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          folder?: string
          id?: string
          mime_type?: string | null
          name?: string
          size_bytes?: number | null
          storage_path?: string | null
          tags?: string[]
          updated_at?: string
          url?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      captions: {
        Row: {
          category: string | null
          created_at: string
          favorite: boolean
          id: string
          kind: string | null
          tags: string[]
          text: string
          title: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          favorite?: boolean
          id?: string
          kind?: string | null
          tags?: string[]
          text: string
          title: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          favorite?: boolean
          id?: string
          kind?: string | null
          tags?: string[]
          text?: string
          title?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "captions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      contents: {
        Row: {
          asset_id: string | null
          caption_id: string | null
          caption_text: string | null
          checklist: Json
          created_at: string
          description: string | null
          event_id: string | null
          id: string
          image_url: string | null
          notes: string | null
          owner_id: string | null
          publish_date: string | null
          status: Database["public"]["Enums"]["content_status"]
          theme: string | null
          title: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at: string
          verse_id: string | null
          workspace_id: string
        }
        Insert: {
          asset_id?: string | null
          caption_id?: string | null
          caption_text?: string | null
          checklist?: Json
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          owner_id?: string | null
          publish_date?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          theme?: string | null
          title: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          verse_id?: string | null
          workspace_id: string
        }
        Update: {
          asset_id?: string | null
          caption_id?: string | null
          caption_text?: string | null
          checklist?: Json
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          owner_id?: string | null
          publish_date?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          theme?: string | null
          title?: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          verse_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contents_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contents_caption_id_fkey"
            columns: ["caption_id"]
            isOneToOne: false
            referencedRelation: "captions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contents_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contents_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "verses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contents_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          event_time: string | null
          id: string
          image_url: string | null
          leader: string | null
          location: string | null
          name: string
          status: Database["public"]["Enums"]["event_status"]
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          event_time?: string | null
          id?: string
          image_url?: string | null
          leader?: string | null
          location?: string | null
          name: string
          status?: Database["public"]["Enums"]["event_status"]
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          event_time?: string | null
          id?: string
          image_url?: string | null
          leader?: string | null
          location?: string | null
          name?: string
          status?: Database["public"]["Enums"]["event_status"]
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      instagram_accounts: {
        Row: {
          connected_at: string
          id: string
          ig_user_id: string | null
          status: string
          updated_at: string
          username: string
          workspace_id: string
        }
        Insert: {
          connected_at?: string
          id?: string
          ig_user_id?: string | null
          status?: string
          updated_at?: string
          username: string
          workspace_id: string
        }
        Update: {
          connected_at?: string
          id?: string
          ig_user_id?: string | null
          status?: string
          updated_at?: string
          username?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instagram_accounts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      instagram_insights: {
        Row: {
          clicks: number
          comments: number
          created_at: string
          engagement: number
          followers: number
          id: string
          impressions: number
          likes: number
          metric_date: string
          profile_visits: number
          reach: number
          saves: number
          shares: number
          updated_at: string
          views: number
          workspace_id: string
        }
        Insert: {
          clicks?: number
          comments?: number
          created_at?: string
          engagement?: number
          followers?: number
          id?: string
          impressions?: number
          likes?: number
          metric_date: string
          profile_visits?: number
          reach?: number
          saves?: number
          shares?: number
          updated_at?: string
          views?: number
          workspace_id: string
        }
        Update: {
          clicks?: number
          comments?: number
          created_at?: string
          engagement?: number
          followers?: number
          id?: string
          impressions?: number
          likes?: number
          metric_date?: string
          profile_visits?: number
          reach?: number
          saves?: number
          shares?: number
          updated_at?: string
          views?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instagram_insights_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      instagram_media: {
        Row: {
          caption: string
          created_at: string
          engagement: number
          id: string
          media_type: string
          posted_at: string | null
          reach: number
          thumbnail_url: string | null
          updated_at: string
          views: number
          workspace_id: string
        }
        Insert: {
          caption?: string
          created_at?: string
          engagement?: number
          id?: string
          media_type?: string
          posted_at?: string | null
          reach?: number
          thumbnail_url?: string | null
          updated_at?: string
          views?: number
          workspace_id: string
        }
        Update: {
          caption?: string
          created_at?: string
          engagement?: number
          id?: string
          media_type?: string
          posted_at?: string | null
          reach?: number
          thumbnail_url?: string | null
          updated_at?: string
          views?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instagram_media_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          updated_at: string
          workspace_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id: string
          updated_at?: string
          workspace_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          member_id: string
          notes: string | null
          role: Database["public"]["Enums"]["media_role"]
          schedule_date: string
          time_label: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          member_id: string
          notes?: string | null
          role: Database["public"]["Enums"]["media_role"]
          schedule_date: string
          time_label?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          member_id?: string
          notes?: string | null
          role?: Database["public"]["Enums"]["media_role"]
          schedule_date?: string
          time_label?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          photo_url: string | null
          roles: Database["public"]["Enums"]["media_role"][]
          updated_at: string
          workspace_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          roles?: Database["public"]["Enums"]["media_role"][]
          updated_at?: string
          workspace_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          roles?: Database["public"]["Enums"]["media_role"][]
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
          workspace_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
          workspace_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      verses: {
        Row: {
          book: string
          category: string | null
          chapter: number
          created_at: string
          favorite: boolean
          id: string
          tags: string[]
          text: string
          theme: string | null
          updated_at: string
          verse: string
          workspace_id: string
        }
        Insert: {
          book: string
          category?: string | null
          chapter: number
          created_at?: string
          favorite?: boolean
          id?: string
          tags?: string[]
          text: string
          theme?: string | null
          updated_at?: string
          verse: string
          workspace_id: string
        }
        Update: {
          book?: string
          category?: string | null
          chapter?: number
          created_at?: string
          favorite?: boolean
          id?: string
          tags?: string[]
          text?: string
          theme?: string | null
          updated_at?: string
          verse?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verses_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bootstrap_workspace: {
        Args: { _church_name: string; _full_name: string }
        Returns: string
      }
      current_workspace_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer" | "media" | "pastoral"
      content_status:
        | "ideia"
        | "planejamento"
        | "producao"
        | "revisao"
        | "agendado"
        | "publicado"
        | "cancelado"
      content_type:
        | "feed"
        | "carrossel"
        | "reels"
        | "stories"
        | "culto"
        | "evento"
        | "devocional"
        | "testemunho"
        | "aviso"
        | "versiculo"
      event_status: "planejado" | "confirmado" | "realizado" | "cancelado"
      media_role:
        | "storymaker"
        | "videomaker"
        | "fotografia"
        | "multimidia"
        | "live"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "viewer", "media", "pastoral"],
      content_status: [
        "ideia",
        "planejamento",
        "producao",
        "revisao",
        "agendado",
        "publicado",
        "cancelado",
      ],
      content_type: [
        "feed",
        "carrossel",
        "reels",
        "stories",
        "culto",
        "evento",
        "devocional",
        "testemunho",
        "aviso",
        "versiculo",
      ],
      event_status: ["planejado", "confirmado", "realizado", "cancelado"],
      media_role: [
        "storymaker",
        "videomaker",
        "fotografia",
        "multimidia",
        "live",
      ],
    },
  },
} as const
