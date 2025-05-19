// src/services/orderService.ts
import axios from 'axios';
import { PaymentStatus } from './paymentService';

// Order status enum
export enum OrderStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  PREPARING = 'Preparing',
  READY_FOR_PICKUP = 'ReadyForPickup',
  ON_THE_WAY = 'OnTheWay',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

// Order item interface
export interface OrderItem {
  productId: number;
  quantity: number;
}

// Order request interface
export interface CreateOrderRequest {
  restaurantId: number;
  deliveryAddressId: number;
  items: OrderItem[];
  paymentMethod: string;
  deliveryInstructions?: string;
  promoCode?: string;
}

// Order response interface
export interface OrderResponse {
  id: number;
  userId: number;
  restaurantId: number;
  deliveryAddressId: number;
  status: OrderStatus;
  items: any[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  estimatedDeliveryTime: string;
  createdAt: string;
  updatedAt: string;
  payment: {
    id: number;
    status: PaymentStatus;
    method: string;
    transactionId?: string;
  };
}

/**
 * Order Service - Handles all order-related operations
 */
export const orderService = {
  /**
   * Create a new order
   */
  async createOrder(orderRequest: CreateOrderRequest): Promise<OrderResponse> {
    try {
      // In a real application, this would make an API call
      // For now, we'll simulate an API response
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generate a random order ID
      const orderId = Math.floor(10000 + Math.random() * 90000);
      
      // Calculate order costs (in a real app this would be done server-side)
      const subtotal = 59.97; // This would be calculated based on items
      const deliveryFee = 3.99;
      const tax = subtotal * 0.16; // 16% tax
      const total = subtotal + deliveryFee + tax;
      
      // Create mock response
      return {
        id: orderId,
        userId: 1,
        restaurantId: orderRequest.restaurantId,
        deliveryAddressId: orderRequest.deliveryAddressId,
        status: OrderStatus.PENDING,
        items: orderRequest.items.map(item => ({
          ...item,
          name: 'Product Name', // In a real app, this would come from the database
          price: 19.99 // Placeholder price
        })),
        subtotal,
        deliveryFee,
        tax,
        total,
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        payment: {
          id: orderId + 1000,
          status: PaymentStatus.PENDING,
          method: orderRequest.paymentMethod
        }
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  /**
   * Get an order by ID
   */
  async getOrderById(orderId: number): Promise<OrderResponse> {
    try {
      // In a real application, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response
      return {
        id: orderId,
        userId: 1,
        restaurantId: 123,
        deliveryAddressId: 456,
        status: OrderStatus.PREPARING,
        items: [
          {
            productId: 101,
            name: 'Hamburguesa Clásica',
            quantity: 2,
            price: 12.99
          },
          {
            productId: 102,
            name: 'Papas Fritas',
            quantity: 1,
            price: 4.99
          }
        ],
        subtotal: 30.97,
        deliveryFee: 3.99,
        tax: 4.96,
        total: 39.92,
        estimatedDeliveryTime: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        payment: {
          id: orderId + 1000,
          status: PaymentStatus.COMPLETED,
          method: 'card',
          transactionId: 'TXN_' + (orderId + 10000)
        }
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },
  
  /**
   * Get all orders for the current user
   */
  async getUserOrders(): Promise<OrderResponse[]> {
    try {
      // In a real application, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock responses for 3 orders
      return [
        {
          id: 12345,
          userId: 1,
          restaurantId: 123,
          deliveryAddressId: 456,
          status: OrderStatus.DELIVERED,
          items: [
            {
              productId: 101,
              name: 'Hamburguesa Clásica',
              quantity: 2,
              price: 12.99
            },
            {
              productId: 102,
              name: 'Papas Fritas',
              quantity: 1,
              price: 4.99
            }
          ],
          subtotal: 30.97,
          deliveryFee: 3.99,
          tax: 4.96,
          total: 39.92,
          estimatedDeliveryTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          payment: {
            id: 22345,
            status: PaymentStatus.COMPLETED,
            method: 'card',
            transactionId: 'TXN_22345'
          }
        },
        {
          id: 12346,
          userId: 1,
          restaurantId: 124,
          deliveryAddressId: 456,
          status: OrderStatus.ON_THE_WAY,
          items: [
            {
              productId: 201,
              name: 'Pizza Margherita',
              quantity: 1,
              price: 15.99
            },
            {
              productId: 202,
              name: 'Refresco Cola',
              quantity: 2,
              price: 2.49
            }
          ],
          subtotal: 20.97,
          deliveryFee: 2.99,
          tax: 3.36,
          total: 27.32,
          estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          payment: {
            id: 22346,
            status: PaymentStatus.COMPLETED,
            method: 'card',
            transactionId: 'TXN_22346'
          }
        },
        {
          id: 12347,
          userId: 1,
          restaurantId: 125,
          deliveryAddressId: 457,
          status: OrderStatus.CANCELLED,
          items: [
            {
              productId: 301,
              name: 'Ensalada César',
              quantity: 1,
              price: 9.99
            }
          ],
          subtotal: 9.99,
          deliveryFee: 3.99,
          tax: 1.60,
          total: 15.58,
          estimatedDeliveryTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          payment: {
            id: 22347,
            status: PaymentStatus.REFUNDED,
            method: 'paypal',
            transactionId: 'TXN_22347'
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },
  
  /**
   * Update the status of an order
   */
  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<boolean> {
    try {
      // In a real application, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate a successful update
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },
  
  /**
   * Cancel an order
   */
  async cancelOrder(orderId: number): Promise<boolean> {
    try {
      // In a real application, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update order status to cancelled
      await this.updateOrderStatus(orderId, OrderStatus.CANCELLED);
      
      return true;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }
};

export default orderService;