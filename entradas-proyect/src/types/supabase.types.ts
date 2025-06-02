export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      asientos: {
        Row: {
          entrada_id: string | null
          fila: string | null
          id: string
          numero: string | null
          ocupado: boolean | null
        }
        Insert: {
          entrada_id?: string | null
          fila?: string | null
          id?: string
          numero?: string | null
          ocupado?: boolean | null
        }
        Update: {
          entrada_id?: string | null
          fila?: string | null
          id?: string
          numero?: string | null
          ocupado?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "asientos_entrada_id_fkey"
            columns: ["entrada_id"]
            isOneToOne: true
            referencedRelation: "entradas"
            referencedColumns: ["id"]
          },
        ]
      }
      entradas: {
        Row: {
          created_at: string | null
          estado: string | null
          id: string
          metadata_uri: string
          qr_code: string
          qr_image_uri: string | null
          tipo_entrada_id: string | null
          token: string
          tx_hash: string | null
          wallet: string
        }
        Insert: {
          created_at?: string | null
          estado?: string | null
          id?: string
          metadata_uri: string
          qr_code: string
          qr_image_uri?: string | null
          tipo_entrada_id?: string | null
          token: string
          tx_hash?: string | null
          wallet: string
        }
        Update: {
          created_at?: string | null
          estado?: string | null
          id?: string
          metadata_uri?: string
          qr_code?: string
          qr_image_uri?: string | null
          tipo_entrada_id?: string | null
          token?: string
          tx_hash?: string | null
          wallet?: string
        }
        Relationships: [
          {
            foreignKeyName: "entradas_tipo_entrada_id_fkey"
            columns: ["tipo_entrada_id"]
            isOneToOne: false
            referencedRelation: "tipo_entrada"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos: {
        Row: {
          created_at: string | null
          descripcion: string | null
          fecha: string
          id: string
          imagen_uri: string | null
          lugar: string
          organizador_id: string | null
          status: string | null
          titulo: string
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          fecha: string
          id?: string
          imagen_uri?: string | null
          lugar: string
          organizador_id?: string | null
          status?: string | null
          titulo: string
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          fecha?: string
          id?: string
          imagen_uri?: string | null
          lugar?: string
          organizador_id?: string | null
          status?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventos_organizador_id_fkey"
            columns: ["organizador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      tipo_entrada: {
        Row: {
          cantidad: number
          descripcion: string | null
          evento_id: string | null
          id: string
          nombre: string
          precio: number
          zona: string | null
        }
        Insert: {
          cantidad: number
          descripcion?: string | null
          evento_id?: string | null
          id?: string
          nombre: string
          precio: number
          zona?: string | null
        }
        Update: {
          cantidad?: number
          descripcion?: string | null
          evento_id?: string | null
          id?: string
          nombre?: string
          precio?: number
          zona?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tipo_entrada_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          email: string | null
          id: string
          nombre: string | null
          rol: string
          wallet: string
        }
        Insert: {
          email?: string | null
          id?: string
          nombre?: string | null
          rol: string
          wallet: string
        }
        Update: {
          email?: string | null
          id?: string
          nombre?: string | null
          rol?: string
          wallet?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
