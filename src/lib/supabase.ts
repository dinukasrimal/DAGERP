import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      branches: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          email: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone: string
          email: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          email?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          address: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          created_at?: string
          updated_at?: string
        }
      }
      styles: {
        Row: {
          id: string
          style_code: string
          style_name: string
          description: string
          available_sizes: string[]
          available_colors: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          style_code: string
          style_name: string
          description: string
          available_sizes: string[]
          available_colors: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          style_code?: string
          style_name?: string
          description?: string
          available_sizes?: string[]
          available_colors?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      sales_orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string
          supplier_reference: string | null
          order_date: string
          delivery_date: string | null
          total_amount: number
          status: 'PENDING' | 'APPROVED' | 'IN_PRODUCTION' | 'COMPLETED' | 'CANCELLED'
          branch_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_id: string
          supplier_reference?: string | null
          order_date: string
          delivery_date?: string | null
          total_amount: number
          status?: 'PENDING' | 'APPROVED' | 'IN_PRODUCTION' | 'COMPLETED' | 'CANCELLED'
          branch_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string
          supplier_reference?: string | null
          order_date?: string
          delivery_date?: string | null
          total_amount?: number
          status?: 'PENDING' | 'APPROVED' | 'IN_PRODUCTION' | 'COMPLETED' | 'CANCELLED'
          branch_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_styles: {
        Row: {
          id: string
          sales_order_id: string
          style_id: string
          pack_quantity: number
          unit_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sales_order_id: string
          style_id: string
          pack_quantity: number
          unit_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sales_order_id?: string
          style_id?: string
          pack_quantity?: number
          unit_price?: number
          created_at?: string
          updated_at?: string
        }
      }
      color_allocations: {
        Row: {
          id: string
          order_style_id: string
          color: string
          packs: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_style_id: string
          color: string
          packs: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_style_id?: string
          color?: string
          packs?: number
          created_at?: string
          updated_at?: string
        }
      }
      size_allocations: {
        Row: {
          id: string
          order_style_id: string
          size: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_style_id: string
          size: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_style_id?: string
          size?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
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
  }
}