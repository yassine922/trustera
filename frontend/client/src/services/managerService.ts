export interface PlatformStats {
  totalUsers: number;
  totalSellers: number;
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  pendingOrders: number;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  await new Promise(r => setTimeout(r, 500));
  return { totalUsers: 50000, totalSellers: 3000, totalOrders: 100000, totalRevenue: 850000000, activeOrders: 1240, pendingOrders: 87 };
}
