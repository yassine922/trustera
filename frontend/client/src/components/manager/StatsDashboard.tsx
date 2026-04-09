/**
 * Stats Dashboard Component
 * لوحة إحصائيات المنصة للمدير
 */

import { useEffect, useState } from 'react';
import { PlatformStats, getPlatformStats } from '@/services/managerService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Store, ShoppingCart, TrendingUp, Loader2 } from 'lucide-react';

export default function StatsDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getPlatformStats();
        setStats(data);
      } catch (error) {
        console.error('خطأ في تحميل الإحصائيات:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">فشل تحميل الإحصائيات</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'إجمالي المستخدمين',
      value: `+${(stats.totalUsers / 1000).toFixed(0)}K`,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'إجمالي البائعين',
      value: `+${(stats.totalSellers / 1000).toFixed(0)}K`,
      icon: Store,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'إجمالي الطلبات',
      value: `+${(stats.totalOrders / 1000).toFixed(0)}K`,
      icon: ShoppingCart,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      title: 'الإيرادات الكلية',
      value: `${(stats.totalRevenue / 1000000).toFixed(1)}M دج`,
      icon: TrendingUp,
      color: 'bg-orange-500/10 text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground mt-1">إحصائيات المنصة العامة</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Orders Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الطلبات النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary mb-2">
              {stats.activeOrders}
            </div>
            <p className="text-sm text-muted-foreground">
              طلب قيد المعالجة والشحن
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الطلبات المعلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {stats.pendingOrders}
            </div>
            <p className="text-sm text-muted-foreground">
              طلب بانتظار التأكيد
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>ملخص الأداء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">متوسط قيمة الطلب</span>
              <span className="font-bold">
                {(stats.totalRevenue / stats.totalOrders).toLocaleString('ar-DZ')} دج
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">نسبة البائعين</span>
              <span className="font-bold">
                {((stats.totalSellers / stats.totalUsers) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">متوسط الطلبات لكل بائع</span>
              <span className="font-bold">
                {(stats.totalOrders / stats.totalSellers).toFixed(0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
