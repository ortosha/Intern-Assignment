
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Order } from '@/types';

interface StatsCardsProps {
  orders: Order[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ orders }) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const paidOrders = orders.filter(o => o.status === 'paid').length;
  const failedOrders = orders.filter(o => o.status === 'failed').length;
  
  const totalRevenue = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      description: 'All time orders'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders.toString(),
      description: 'Awaiting payment'
    },
    {
      title: 'Successful Orders',
      value: paidOrders.toString(),
      description: 'Completed payments'
    },
    {
      title: 'Total Revenue',
      value: `KES ${totalRevenue.toLocaleString()}`,
      description: 'From paid orders'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
