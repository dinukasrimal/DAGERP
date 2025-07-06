import { supabase } from '../lib/supabase'
import { SalesOrder } from '../types'

export interface OrderStyleConfiguration {
  styleId: string
  packQuantity: number
  unitPrice: number
  colors: { color: string; packs: number }[]
  sizes: { size: string; quantity: number }[]
}

export class OrderService {
  static async getAll(): Promise<SalesOrder[]> {
    const { data, error } = await supabase
      .from('sales_orders')
      .select(`
        *,
        customers (
          id,
          name,
          email,
          phone,
          address
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      throw error
    }

    return data.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      customerId: order.customer_id,
      customer: order.customers ? {
        id: order.customers.id,
        name: order.customers.name,
        email: order.customers.email,
        phone: order.customers.phone,
        address: order.customers.address,
        createdAt: new Date(),
        updatedAt: new Date(),
      } : undefined,
      supplierReference: order.supplier_reference || undefined,
      orderDate: new Date(order.order_date),
      deliveryDate: order.delivery_date ? new Date(order.delivery_date) : undefined,
      totalAmount: order.total_amount,
      status: order.status as any,
      branchId: order.branch_id,
      createdAt: new Date(order.created_at),
      updatedAt: new Date(order.updated_at),
      purchaseOrders: [],
      styles: [],
    }))
  }

  static async create(orderData: {
    orderNumber: string
    customerId: string
    supplierReference?: string
    orderDate: string
    deliveryDate?: string
    totalAmount: number
    status: string
    branchId: string
    styles: OrderStyleConfiguration[]
  }): Promise<SalesOrder> {
    // Start a transaction
    const { data: order, error: orderError } = await supabase
      .from('sales_orders')
      .insert({
        order_number: orderData.orderNumber,
        customer_id: orderData.customerId,
        supplier_reference: orderData.supplierReference,
        order_date: orderData.orderDate,
        delivery_date: orderData.deliveryDate,
        total_amount: orderData.totalAmount,
        status: orderData.status as any,
        branch_id: orderData.branchId,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      throw orderError
    }

    // Create order styles
    for (const style of orderData.styles) {
      const { data: orderStyle, error: orderStyleError } = await supabase
        .from('order_styles')
        .insert({
          sales_order_id: order.id,
          style_id: style.styleId,
          pack_quantity: style.packQuantity,
          unit_price: style.unitPrice,
        })
        .select()
        .single()

      if (orderStyleError) {
        console.error('Error creating order style:', orderStyleError)
        throw orderStyleError
      }

      // Create color allocations
      for (const color of style.colors) {
        const { error: colorError } = await supabase
          .from('color_allocations')
          .insert({
            order_style_id: orderStyle.id,
            color: color.color,
            packs: color.packs,
          })

        if (colorError) {
          console.error('Error creating color allocation:', colorError)
          throw colorError
        }
      }

      // Create size allocations
      for (const size of style.sizes) {
        const { error: sizeError } = await supabase
          .from('size_allocations')
          .insert({
            order_style_id: orderStyle.id,
            size: size.size,
            quantity: size.quantity,
          })

        if (sizeError) {
          console.error('Error creating size allocation:', sizeError)
          throw sizeError
        }
      }
    }

    return {
      id: order.id,
      orderNumber: order.order_number,
      customerId: order.customer_id,
      supplierReference: order.supplier_reference || undefined,
      orderDate: new Date(order.order_date),
      deliveryDate: order.delivery_date ? new Date(order.delivery_date) : undefined,
      totalAmount: order.total_amount,
      status: order.status as any,
      branchId: order.branch_id,
      createdAt: new Date(order.created_at),
      updatedAt: new Date(order.updated_at),
      purchaseOrders: [],
      styles: [],
    }
  }

  static async getById(id: string): Promise<SalesOrder | null> {
    const { data, error } = await supabase
      .from('sales_orders')
      .select(`
        *,
        customers (
          id,
          name,
          email,
          phone,
          address
        ),
        order_styles (
          *,
          styles (
            id,
            style_code,
            style_name,
            description
          ),
          color_allocations (*),
          size_allocations (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      console.error('Error fetching order:', error)
      throw error
    }

    return {
      id: data.id,
      orderNumber: data.order_number,
      customerId: data.customer_id,
      customer: data.customers ? {
        id: data.customers.id,
        name: data.customers.name,
        email: data.customers.email,
        phone: data.customers.phone,
        address: data.customers.address,
        createdAt: new Date(),
        updatedAt: new Date(),
      } : undefined,
      supplierReference: data.supplier_reference || undefined,
      orderDate: new Date(data.order_date),
      deliveryDate: data.delivery_date ? new Date(data.delivery_date) : undefined,
      totalAmount: data.total_amount,
      status: data.status as any,
      branchId: data.branch_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      purchaseOrders: [],
      styles: data.order_styles?.map((orderStyle: any) => ({
        id: orderStyle.id,
        salesOrderId: orderStyle.sales_order_id,
        styleId: orderStyle.style_id,
        style: orderStyle.styles ? {
          id: orderStyle.styles.id,
          styleCode: orderStyle.styles.style_code,
          styleName: orderStyle.styles.style_name,
          description: orderStyle.styles.description,
          availableSizes: [],
          availableColors: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } : undefined,
        packConfiguration: orderStyle.pack_quantity,
        unitPrice: orderStyle.unit_price,
        colorAllocations: (orderStyle.color_allocations || []).map((c: any) => ({
          id: c.id,
          orderStyleId: c.order_style_id,
          color: c.color,
          packQuantity: c.packs,
          createdAt: new Date(c.created_at),
          updatedAt: new Date(c.updated_at),
        })),
        sizeAllocations: (orderStyle.size_allocations || []).map((s: any) => ({
          id: s.id,
          orderStyleId: s.order_style_id,
          size: s.size,
          quantity: s.quantity,
          createdAt: new Date(s.created_at),
          updatedAt: new Date(s.updated_at),
        })),
        createdAt: new Date(orderStyle.created_at),
        updatedAt: new Date(orderStyle.updated_at),
      })) || [],
    }
  }

  static async update(id: string, orderData: {
    orderNumber?: string
    customerId?: string
    supplierReference?: string
    orderDate?: string
    deliveryDate?: string
    totalAmount?: number
    status?: string
    branchId?: string
  }): Promise<SalesOrder> {
    const { data, error } = await supabase
      .from('sales_orders')
      .update({
        ...(orderData.orderNumber && { order_number: orderData.orderNumber }),
        ...(orderData.customerId && { customer_id: orderData.customerId }),
        ...(orderData.supplierReference && { supplier_reference: orderData.supplierReference }),
        ...(orderData.orderDate && { order_date: orderData.orderDate }),
        ...(orderData.deliveryDate && { delivery_date: orderData.deliveryDate }),
        ...(orderData.totalAmount !== undefined && { total_amount: orderData.totalAmount }),
        ...(orderData.status && { status: orderData.status as any }),
        ...(orderData.branchId && { branch_id: orderData.branchId }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating order:', error)
      throw error
    }

    return {
      id: data.id,
      orderNumber: data.order_number,
      customerId: data.customer_id,
      orderDate: new Date(data.order_date),
      totalAmount: data.total_amount,
      status: data.status as any,
      branchId: data.branch_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      purchaseOrders: [],
      styles: [],
    }
  }

  static async updateStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('sales_orders')
      .update({ 
        status: status as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('sales_orders')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting order:', error)
      throw error
    }
  }
}