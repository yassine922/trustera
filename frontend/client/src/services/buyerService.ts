export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface AuthData {
  email: string;
  password: string;
}

export async function loginBuyer(data: AuthData): Promise<{ success: boolean; message?: string }> {
  await new Promise(r => setTimeout(r, 800));
  if (!data.email.includes('@')) return { success: false, message: 'البريد الإلكتروني غير صحيح' };
  return { success: true };
}

export async function registerBuyer(data: AuthData & { name: string }): Promise<{ success: boolean; message?: string }> {
  await new Promise(r => setTimeout(r, 1000));
  if (!data.email.includes('@')) return { success: false, message: 'البريد الإلكتروني غير صحيح' };
  return { success: true };
}
