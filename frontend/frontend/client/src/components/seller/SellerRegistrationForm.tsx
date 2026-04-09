/**
 * Seller Registration Form Component
 * نموذج تسجيل بائع جديد على المنصة
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { registerSeller } from '@/services/sellerService';
import { Store, User, Phone, Mail, ShoppingBag, Lock } from 'lucide-react';

interface FormData {
  storeName: string;
  fullName: string;
  phone: string;
  email: string;
  category: string;
  password: string;
}

export default function SellerRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    storeName: '',
    fullName: '',
    phone: '',
    email: '',
    category: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: 'electronics', label: 'إلكترونيات' },
    { value: 'fashion', label: 'أزياء' },
    { value: 'home', label: 'منزل' },
    { value: 'beauty', label: 'جمال' },
    { value: 'sports', label: 'رياضة' },
    { value: 'other', label: 'أخرى' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await registerSeller(formData);
      if (result.success) {
        setSuccess(true);
        setFormData({
          storeName: '',
          fullName: '',
          phone: '',
          email: '',
          category: '',
          password: '',
        });
      } else {
        setError(result.message || 'فشل التسجيل');
      }
    } catch (err) {
      setError('حدث خطأ أثناء التسجيل');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">تم إنشاء حسابك بنجاح!</h2>
        <p className="text-muted-foreground mb-6">مرحباً بك في عائلة البائعين على ترسترا</p>
        <Button onClick={() => setSuccess(false)}>العودة للتسجيل</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🚀</div>
        <h1 className="text-3xl font-bold mb-2">ابدأ البيع على ترسترا</h1>
        <p className="text-muted-foreground">وصل لآلاف المشترين في الجزائر</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Store Name */}
      <div className="space-y-2">
        <Label htmlFor="storeName" className="flex items-center gap-2">
          <Store className="w-4 h-4" />
          اسم المتجر
        </Label>
        <Input
          id="storeName"
          name="storeName"
          placeholder="مثال: Tech Store DZ"
          value={formData.storeName}
          onChange={handleChange}
          required
        />
      </div>

      {/* Full Name and Phone */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            الاسم الكامل
          </Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="اسمك الكامل"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            رقم الهاتف
          </Label>
          <Input
            id="phone"
            name="phone"
            placeholder="06 XX XX XX XX"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          البريد الإلكتروني
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          قسم المنتجات
        </Label>
        <Select value={formData.category} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category">
            <SelectValue placeholder="اختر القسم" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          كلمة المرور
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 text-base font-bold"
      >
        {loading ? 'جاري التسجيل...' : 'إنشاء حساب البائع'}
      </Button>
    </form>
  );
}
