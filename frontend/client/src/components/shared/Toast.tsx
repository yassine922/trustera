import { useApp } from '../../contexts/AppContext';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const icons: Record<string, string> = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const colors: Record<string, string> = {
    success: '#2e7d32', error: '#d32f2f', warning: '#f59e0b', info: '#0284c7'
  };
  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      background: colors[toast.type] || colors.success, color: 'white',
      padding: '12px 24px', borderRadius: '10px', fontFamily: 'Cairo, sans-serif',
      fontWeight: 700, fontSize: '14px', zIndex: 9999, display: 'flex',
      alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      animation: 'slideUp 0.3s ease',
    }}>
      <span>{toast.icon || icons[toast.type] || '✅'}</span>
      {toast.msg}
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}
