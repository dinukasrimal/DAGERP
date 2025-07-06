import { supabase } from '../lib/supabase'
import { Style } from '../types'

export class StyleService {
  static async getAll(): Promise<Style[]> {
    const { data, error } = await supabase
      .from('styles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching styles:', error)
      throw error
    }

    return data.map(style => ({
      id: style.id,
      styleCode: style.style_code,
      styleName: style.style_name,
      description: style.description,
      availableSizes: style.available_sizes,
      availableColors: style.available_colors,
      createdAt: new Date(style.created_at),
      updatedAt: new Date(style.updated_at),
    }))
  }

  static async create(styleData: Omit<Style, 'id' | 'createdAt' | 'updatedAt'>): Promise<Style> {
    const { data, error } = await supabase
      .from('styles')
      .insert({
        style_code: styleData.styleCode,
        style_name: styleData.styleName,
        description: styleData.description,
        available_sizes: styleData.availableSizes,
        available_colors: styleData.availableColors,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating style:', error)
      throw error
    }

    return {
      id: data.id,
      styleCode: data.style_code,
      styleName: data.style_name,
      description: data.description,
      availableSizes: data.available_sizes,
      availableColors: data.available_colors,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }

  static async update(id: string, styleData: Partial<Omit<Style, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Style> {
    const { data, error } = await supabase
      .from('styles')
      .update({
        ...(styleData.styleCode && { style_code: styleData.styleCode }),
        ...(styleData.styleName && { style_name: styleData.styleName }),
        ...(styleData.description !== undefined && { description: styleData.description }),
        ...(styleData.availableSizes && { available_sizes: styleData.availableSizes }),
        ...(styleData.availableColors && { available_colors: styleData.availableColors }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating style:', error)
      throw error
    }

    return {
      id: data.id,
      styleCode: data.style_code,
      styleName: data.style_name,
      description: data.description,
      availableSizes: data.available_sizes,
      availableColors: data.available_colors,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('styles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting style:', error)
      throw error
    }
  }

  static async getById(id: string): Promise<Style | null> {
    const { data, error } = await supabase
      .from('styles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      console.error('Error fetching style:', error)
      throw error
    }

    return {
      id: data.id,
      styleCode: data.style_code,
      styleName: data.style_name,
      description: data.description,
      availableSizes: data.available_sizes,
      availableColors: data.available_colors,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }
}