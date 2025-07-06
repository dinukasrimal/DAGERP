import { supabase } from '../lib/supabase'
import { Customer } from '../types'

export class CustomerService {
  static async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching customers:', error)
      throw error
    }

    return data.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      createdAt: new Date(customer.created_at),
      updatedAt: new Date(customer.updated_at),
    }))
  }

  static async create(customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating customer:', error)
      throw error
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }

  static async update(id: string, customerData: Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .update({
        ...(customerData.name && { name: customerData.name }),
        ...(customerData.email && { email: customerData.email }),
        ...(customerData.phone && { phone: customerData.phone }),
        ...(customerData.address && { address: customerData.address }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating customer:', error)
      throw error
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting customer:', error)
      throw error
    }
  }

  static async getById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      console.error('Error fetching customer:', error)
      throw error
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }
}