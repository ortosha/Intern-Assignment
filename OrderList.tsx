import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/storage';
import { Order } from '@/types';
import { formatDistanceToNow } from 'date-fns';

const OrderList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingOrders, setProcessingOrders] = useState<Set<string>>(new Set());

  const loadOrders = () => {
    if (user?.role === 'admin') {
      setOrders(db.getOrders());
    } else if (user?.merchantId) {
      setOrders(db.getOrdersByMerchant(user.merchantId));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
    
    // Refresh orders every 5 seconds to simulate real-time updates
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const simulatePaymentConfirmation = async (orderId: string) => {
    setProcessingOrders(prev => new Set(prev).add(orderId));
    
    toast({
      title: "Processing payment",
      description: "Simulating payment confirmation...",
    });

    // Simulate async payment processing (5 seconds)
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate
      const newStatus = success ? 'paid' : 'failed';
      
      db.updateOrderStatus(orderId, newStatus);
      loadOrders();
      
      setProcessingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });

      toast({
        title: success ? "Payment confirmed" : "Payment failed",
        description: success 
          ? "Order has been marked as paid" 
          : "Payment processing failed. Please try again.",
        variant: success ? "default" : "destructive",
      });
    }, 5000);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, className: 'border-yellow-200 text-yellow-800 bg-yellow-50' },
      paid: { variant: 'default' as const, className: 'bg-green-100 text-green-800 border-green-200' },
      failed: { variant: 'destructive' as const, className: '' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-gray-600">Monitor and manage customer orders</p>
        </div>
        <Button onClick={loadOrders} variant="outline">
          Refresh Orders
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                    <CardDescription>
                      {order.product} × {order.quantity} • KES {order.totalAmount.toLocaleString()}
                    </CardDescription>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer</p>
                    <p className="text-sm">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                    <p className="text-sm capitalize">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-sm">{formatDistanceToNow(new Date(order.createdAt))} ago</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-sm">{formatDistanceToNow(new Date(order.updatedAt))} ago</p>
                  </div>
                </div>
                
                {order.status === 'pending' && (
                  <Button
                    onClick={() => simulatePaymentConfirmation(order.id)}
                    disabled={processingOrders.has(order.id)}
                    size="sm"
                    className="w-full md:w-auto"
                  >
                    {processingOrders.has(order.id) 
                      ? 'Processing Payment...' 
                      : 'Simulate Payment Confirmation'
                    }
                  </Button>
                )}

                {order.status === 'paid' && order.paymentConfirmedAt && (
                  <p className="text-sm text-green-600">
                    ✓ Payment confirmed {formatDistanceToNow(new Date(order.paymentConfirmedAt))} ago
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
