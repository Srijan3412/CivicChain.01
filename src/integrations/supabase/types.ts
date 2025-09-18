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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      budget_files: {
        Row: {
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          original_filename: string
          processing_status: string | null
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          original_filename: string
          processing_status?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          original_filename?: string
          processing_status?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      budgets: {
        Row: {
          amount: number
          category: string
          created_at: string
          fiscal_year: string
          id: string
          project_name: string | null
          source_file: string | null
          ward: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          fiscal_year: string
          id?: string
          project_name?: string | null
          source_file?: string | null
          ward: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          fiscal_year?: string
          id?: string
          project_name?: string | null
          source_file?: string | null
          ward?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_source_file_fkey"
            columns: ["source_file"]
            isOneToOne: false
            referencedRelation: "budget_files"
            referencedColumns: ["id"]
          },
        ]
      }
      citizen_reports: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          image_urls: string[] | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          image_urls?: string[] | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_urls?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          comment: string | null
          email: string
          id: number
          image: string | null
          name: string | null
          rating: number | null
          reviews: Json | null
          url: string | null
        }
        Insert: {
          comment?: string | null
          email: string
          id?: number
          image?: string | null
          name?: string | null
          rating?: number | null
          reviews?: Json | null
          url?: string | null
        }
        Update: {
          comment?: string | null
          email?: string
          id?: number
          image?: string | null
          name?: string | null
          rating?: number | null
          reviews?: Json | null
          url?: string | null
        }
        Relationships: []
      }
      feedback_reviews: {
        Row: {
          asin: string | null
          id: number
          last_scraped_at: string
          reviews: Json
          url: string
        }
        Insert: {
          asin?: string | null
          id?: number
          last_scraped_at?: string
          reviews?: Json
          url: string
        }
        Update: {
          asin?: string | null
          id?: number
          last_scraped_at?: string
          reviews?: Json
          url?: string
        }
        Relationships: []
      }
      municipal_budget: {
        Row: {
          account: string
          account_budget_a: string
          created_at: string | null
          file_id: string | null
          glcode: string
          id: string
          remaining_amt: number
          used_amt: number
          user_id: string | null
        }
        Insert: {
          account: string
          account_budget_a: string
          created_at?: string | null
          file_id?: string | null
          glcode: string
          id?: string
          remaining_amt: number
          used_amt: number
          user_id?: string | null
        }
        Update: {
          account?: string
          account_budget_a?: string
          created_at?: string | null
          file_id?: string | null
          glcode?: string
          id?: string
          remaining_amt?: number
          used_amt?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "municipal_budget_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "budget_files"
            referencedColumns: ["id"]
          },
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
    Enums: {},
  },
} as const
