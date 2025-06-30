
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/layout/AppLayout';
import PaymentConfigForm from '@/components/merchant/PaymentConfigForm';
import OrderList from '@/components/orders/OrderList';
import CreateOrderForm from '@/components/orders/CreateOrderForm';
import StatsCards from '@/components/dashboard/StatsCards';
import { db } from '@/lib/storage';
import { Order } from '@/types';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadOrders = () => {
    if (user?.role === 'admin') {
      setOrders(db.getOrders());
    } else if (user?.merchantId) {
      setOrders(db.getOrdersByMerchant(user.merchantId));
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user, refreshKey]);

  const handleOrderCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {user?.role === 'admin' 
              ? 'Manage all merchants and orders across the platform' 
              : 'Manage your store and track customer orders'
            }
          </p>
        </div>

        <StatsCards orders={orders} />

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            {user?.role === 'merchant' && (
              <TabsTrigger value="settings">Payment Settings</TabsTrigger>
            )}
            <TabsTrigger value="create-order">Create Order</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <OrderList />
          </TabsContent>

          {user?.role === 'merchant' && (
            <TabsContent value="settings" className="space-y-4">
              <PaymentConfigForm />
            </TabsContent>
          )}

          <TabsContent value="create-order" className="space-y-4">
            <CreateOrderForm onOrderCreated={handleOrderCreated} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
