import { Merchant, Order, User, OrderStatus } from '@/types';

// Mock database using localStorage
export class MockDatabase {
  private static instance: MockDatabase;
  
  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  // Users
  getUsers(): User[] {
    const users = localStorage.getItem('ghala_users');
    return users ? JSON.parse(users) : [];
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem('ghala_users', JSON.stringify(users));
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.email === email) || null;
  }

  // Merchants
  getMerchants(): Merchant[] {
    const merchants = localStorage.getItem('ghala_merchants');
    return merchants ? JSON.parse(merchants) : [];
  }

  saveMerchant(merchant: Merchant): void {
    const merchants = this.getMerchants();
    const existingIndex = merchants.findIndex(m => m.id === merchant.id);
    
    if (existingIndex >= 0) {
      merchants[existingIndex] = merchant;
    } else {
      merchants.push(merchant);
    }
    
    localStorage.setItem('ghala_merchants', JSON.stringify(merchants));
  }

  getMerchantById(id: string): Merchant | null {
    const merchants = this.getMerchants();
    return merchants.find(m => m.id === id) || null;
  }

  // Orders
  getOrders(): Order[] {
    const orders = localStorage.getItem('ghala_orders');
    return orders ? JSON.parse(orders) : [];
  }

  saveOrder(order: Order): void {
    const orders = this.getOrders();
    const existingIndex = orders.findIndex(o => o.id === order.id);
    
    if (existingIndex >= 0) {
      orders[existingIndex] = order;
    } else {
      orders.push(order);
    }
    
    localStorage.setItem('ghala_orders', JSON.stringify(orders));
  }

  getOrdersByMerchant(merchantId: string): Order[] {
    const orders = this.getOrders();
    return orders.filter(o => o.merchantId === merchantId);
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex >= 0) {
      orders[orderIndex] = {
        ...orders[orderIndex],
        status,
        updatedAt: new Date().toISOString(),
        ...(status === 'paid' && { paymentConfirmedAt: new Date().toISOString() })
      };
      localStorage.setItem('ghala_orders', JSON.stringify(orders));
    }
  }

  // Initialize sample data
  initializeSampleData(): void {
    const existingUsers = this.getUsers();
    if (existingUsers.length === 0) {
      // Create sample admin user
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@ghala.com',
        name: 'Ghala Admin',
        role: 'admin'
      };

      // Create sample merchant user
      const merchantUser: User = {
        id: 'merchant-1',
        email: 'merchant@example.com',
        name: 'Sample Merchant',
        role: 'merchant',
        merchantId: 'merchant-1'
      };

      this.saveUser(adminUser);
      this.saveUser(merchantUser);

      // Create sample merchant
      const sampleMerchant: Merchant = {
        id: 'merchant-1',
        name: 'Sample Store',
        email: 'merchant@example.com',
        preferredPaymentMethod: 'mobile',
        paymentConfig: {
          mobile: {
            provider: 'M-Pesa',
            accountNumber: '+254700123456',
            accountName: 'Sample Store'
          }
        },
        commissionRate: 0.03,
        createdAt: new Date().toISOString()
      };

      this.saveMerchant(sampleMerchant);

      // Create sample orders
      const sampleOrders: Order[] = [
        {
          id: 'order-1',
          merchantId: 'merchant-1',
          customerName: 'John Doe',
          customerPhone: '+254700987654',
          product: 'Wireless Headphones',
          quantity: 1,
          totalAmount: 5000,
          status: 'pending',
          paymentMethod: 'mobile',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'order-2',
          merchantId: 'merchant-1',
          customerName: 'Jane Smith',
          customerPhone: '+254700111222',
          product: 'Smartphone Case',
          quantity: 2,
          totalAmount: 1500,
          status: 'paid',
          paymentMethod: 'mobile',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          updatedAt: new Date(Date.now() - 7000000).toISOString(),
          paymentConfirmedAt: new Date(Date.now() - 7000000).toISOString()
        }
      ];

      sampleOrders.forEach(order => this.saveOrder(order));
    }
  }
}

export const db = MockDatabase.getInstance();
