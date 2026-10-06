import React, { useState } from 'react';
import { ShieldAlert, Key, X, Lock, Check } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Secret Admin PIN
    if (pin.trim() === 'admin123' || pin.trim() === 'nexus2026' || pin.trim() === 'vip777') {
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[#181d2a] border border-[#262f44] rounded-2xl max-w-sm w-full p-6 text-right space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Lock className="w-4 h-4 text-[#60a5fa]" />
            <span>التحقق من صلاحية المدير</span>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748b] hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#94a3b8] leading-relaxed">
          هذه اللوحة خاصة ومحمية للمدير العام فقط لإدارة الأرصدة والأكواد. أدخل رمز المرور السري للدخول.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="رمز المرور (PIN)..."
              autoFocus
              className="w-full bg-[#11141d] text-sm text-center text-white px-3 py-2.5 rounded-xl border border-[#262f44] focus:border-[#3b82f6] focus:outline-none font-mono"
            />
            {error && (
              <p className="text-[11px] text-[#ef4444] mt-1.5 font-medium">رمز المرور غير صحيح!</p>
            )}
          </div>

          <div className="pt-1 flex items-center justify-between gap-2">
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md"
            >
              دخول المدير
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1e2434] text-[#94a3b8] hover:text-white text-xs"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
