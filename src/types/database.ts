export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      collection_points: {
        Row: {
          accepted_items: string[] | null
          city: string | null
          contact_name: string | null
          contact_phone: string | null
          coordinates: unknown | null
          created_at: string | null
          id: number
          location: string | null
          name: string | null
          status: string | null
          type: string | null
          urgent_needs: string | null
        }
        Insert: {
          accepted_items?: string[] | null
          city?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          id?: number
          location?: string | null
          name?: string | null
          status?: string | null
          type?: string | null
          urgent_needs?: string | null
        }
        Update: {
          accepted_items?: string[] | null
          city?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          id?: number
          location?: string | null
          name?: string | null
          status?: string | null
          type?: string | null
          urgent_needs?: string | null
        }
        Relationships: []
      }
      delivery_points: {
        Row: {
          additional_info: string | null
          cargo_type: string | null
          city: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          coordinates: unknown | null
          created_at: string
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          schedule: string | null
          status: string | null
          user_id: string | null
          vehicle_type: string | null
        }
        Insert: {
          additional_info?: string | null
          cargo_type?: string | null
          city: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          coordinates?: unknown | null
          created_at?: string
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          schedule?: string | null
          status?: string | null
          user_id?: string | null
          vehicle_type?: string | null
        }
        Update: {
          additional_info?: string | null
          cargo_type?: string | null
          city?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          coordinates?: unknown | null
          created_at?: string
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          schedule?: string | null
          status?: string | null
          user_id?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      help_request_assignments: {
        Row: {
          assigned_at: string | null
          help_request_id: number
          id: number
          people_count: number | null
          phone_number: string
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          help_request_id: number
          id?: number
          people_count?: number | null
          phone_number: string
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          help_request_id?: number
          id?: number
          people_count?: number | null
          phone_number?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_help_request"
            columns: ["help_request_id"]
            isOneToOne: false
            referencedRelation: "help_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      help_requests: {
        Row: {
          additional_info: Json | null
          contact_info: string | null
          coordinates: unknown | null
          created_at: string | null
          description: string | null
          help_type: Database["public"]["Enums"]["help_type_enum"][] | null
          id: number
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string | null
          number_of_people: number | null
          other_help: string | null
          people_needed: number | null
          resources: Json | null
          status: string | null
          town_id: number | null
          type: string | null
          urgency: string | null
          user_id: string | null
        }
        Insert: {
          additional_info?: Json | null
          contact_info?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          description?: string | null
          help_type?: Database["public"]["Enums"]["help_type_enum"][] | null
          id?: number
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string | null
          number_of_people?: number | null
          other_help?: string | null
          people_needed?: number | null
          resources?: Json | null
          status?: string | null
          town_id?: number | null
          type?: string | null
          urgency?: string | null
          user_id?: string | null
        }
        Update: {
          additional_info?: Json | null
          contact_info?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          description?: string | null
          help_type?: Database["public"]["Enums"]["help_type_enum"][] | null
          id?: number
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string | null
          number_of_people?: number | null
          other_help?: string | null
          people_needed?: number | null
          resources?: Json | null
          status?: string | null
          town_id?: number | null
          type?: string | null
          urgency?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "help_requests_town_id_fkey"
            columns: ["town_id"]
            isOneToOne: false
            referencedRelation: "towns"
            referencedColumns: ["id"]
          },
        ]
      }
      missing_persons: {
        Row: {
          additional_info: Json | null
          age: number | null
          clothing_description: string | null
          coordinates: unknown | null
          created_at: string | null
          description: string | null
          gender: string | null
          height: number | null
          id: number
          last_seen_date: string | null
          last_seen_location: string | null
          medical_conditions: string | null
          name: string | null
          reporter_contact: string | null
          reporter_name: string | null
          reporter_relationship: string | null
          secondary_contact: string | null
          status: string | null
        }
        Insert: {
          additional_info?: Json | null
          age?: number | null
          clothing_description?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          description?: string | null
          gender?: string | null
          height?: number | null
          id?: number
          last_seen_date?: string | null
          last_seen_location?: string | null
          medical_conditions?: string | null
          name?: string | null
          reporter_contact?: string | null
          reporter_name?: string | null
          reporter_relationship?: string | null
          secondary_contact?: string | null
          status?: string | null
        }
        Update: {
          additional_info?: Json | null
          age?: number | null
          clothing_description?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          description?: string | null
          gender?: string | null
          height?: number | null
          id?: number
          last_seen_date?: string | null
          last_seen_location?: string | null
          medical_conditions?: string | null
          name?: string | null
          reporter_contact?: string | null
          reporter_name?: string | null
          reporter_relationship?: string | null
          secondary_contact?: string | null
          status?: string | null
        }
        Relationships: []
      }
      towns: {
        Row: {
          created_at: string
          help_needed: number | null
          id: number
          name: string | null
          people_helping: number | null
        }
        Insert: {
          created_at?: string
          help_needed?: number | null
          id?: number
          name?: string | null
          people_helping?: number | null
        }
        Update: {
          created_at?: string
          help_needed?: number | null
          id?: number
          name?: string | null
          people_helping?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: number
          role: Database["public"]["Enums"]["roles"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          role?: Database["public"]["Enums"]["roles"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          role?: Database["public"]["Enums"]["roles"] | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      distinct_collection_cities: {
        Row: {
          city: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      help_type_enum:
        | "limpieza"
        | "alojamiento"
        | "evacuacion"
        | "distribucion"
        | "rescate"
        | "medica"
        | "psicologico"
        | "logistico"
        | "otros"
        | "reparto"
        | "donaciones"
      roles: "user" | "moderator" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

