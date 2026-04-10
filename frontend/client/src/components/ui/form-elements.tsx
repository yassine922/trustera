import * as React from 'react';
import { cn } from '@/lib/utils';

/* ===== INPUT ===== */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50', className)}
    style={{ fontFamily: 'Cairo, sans-serif', border: '1px solid #dde1e7', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none', width: '100%', ...props.style }}
    ref={ref}
    {...props}
  />
));
Input.displayName = 'Input';
export { Input };

/* ===== LABEL ===== */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
    style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px', display: 'block', ...props.style }}
    {...props}
  />
));
Label.displayName = 'Label';
export { Label };

/* ===== SELECT ===== */
export interface SelectProps { value?: string; onValueChange?: (v: string) => void; children?: React.ReactNode; }
export function Select({ value, onValueChange, children }: SelectProps) {
  return <div data-value={value} data-onchange={onValueChange} style={{ position: 'relative' }}>{children}</div>;
}
export function SelectTrigger({ children, id }: { children?: React.ReactNode; id?: string }) {
  return <div id={id} style={{ border: '1px solid #dde1e7', borderRadius: '8px', padding: '8px 12px', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>{children}</div>;
}
export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span style={{ color: '#6b7280' }}>{placeholder}</span>;
}
export function SelectContent({ children }: { children?: React.ReactNode }) {
  return <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #dde1e7', borderRadius: '8px', zIndex: 50, marginTop: '4px' }}>{children}</div>;
}
export function SelectItem({ value, children }: { value: string; children?: React.ReactNode }) {
  return <div data-value={value} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px' }} className="select-item">{children}</div>;
}

/* ===== CARD ===== */
export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)} style={{ background: 'white', borderRadius: '12px', border: '1px solid #eef0f3', ...props.style }} {...props}>{children}</div>;
}
export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} style={{ padding: '16px 20px', borderBottom: '1px solid #eef0f3', ...props.style }} {...props}>{children}</div>;
}
export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} style={{ fontSize: '16px', fontWeight: 800, ...props.style }} {...props}>{children}</h3>;
}
export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} style={{ padding: '16px 20px', ...props.style }} {...props}>{children}</div>;
}
