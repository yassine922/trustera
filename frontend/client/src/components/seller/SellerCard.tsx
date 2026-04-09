/**
 * Seller Card Component
 * بطاقة عرض بيانات البائع مع إحصائياته
 */

import { SellerProfile } from '@/services/sellerService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, TrendingUp, Clock } from 'lucide-react';

interface SellerCardProps {
  seller: SellerProfile;
  onContact?: () => void;
  onBrowse?: () => void;
}

export default function SellerCard({ seller, onContact, onBrowse }: SellerCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="bg-primary/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg">
            {seller.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{seller.name}</h3>
              {seller.verified && (
                <Badge variant="default" className="text-xs">
                  ✓ موثق
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y">
          <div className="text-center">
            <div className="font-bold text-lg text-primary">{seller.sales}</div>
            <div className="text-xs text-muted-foreground">المبيعات</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-primary">{seller.reviews}</div>
            <div className="text-xs text-muted-foreground">تقييمات</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-primary">{seller.responseRate}%</div>
            <div className="text-xs text-muted-foreground">الاستجابة</div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(seller.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="font-bold">{seller.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({seller.reviews} تقييم)</span>
        </div>

        {/* Info Badges */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>مبيعات: {seller.sales}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>وقت الاستجابة: {seller.responseRate}% سريع</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={onContact}
            className="flex-1"
            size="sm"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            تواصل
          </Button>
          <Button
            onClick={onBrowse}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            تصفح المتجر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
