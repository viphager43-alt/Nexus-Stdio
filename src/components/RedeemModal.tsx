import React, { useState } from 'react';
import { X, Key, Crown, Coins, CheckCircle2, AlertCircle } from 'lucide-react';
import { redeemCode } from '../services/api';
import { UserProfile } from '../types';

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSuccess: (updatedUser: UserProfile) => void;
}

export const RedeemModal: React.FC<RedeemModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await redeemCode(currentUser.id, code.trim());
      setSuccessMsg(res.message);
      onSuccess(res.user);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'فشل تفعيل الكود، يرجى التأكد من صحة الرمز.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[#181d2a] border border-[#262f44] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl text-right">
        {/* Header */}
        <div className="p-4 border-b border-[#262f44] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#f59e0b]" />
            <h3 className="font-bold text-white text-base">تفعيل كود VIP أو شحن الرصيد</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748b] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            إذا حصلت على كود تفعيل من الإدارة، قم بكتابته هنا لترقية حسابك فوراً إلى النسخة المدفوعة VIP بحرية تامة أو إضافة أرصدة ضخمة.
          </p>

          {/* Quick Demo Hint */}
          <div className="p-3 rounded-xl bg-[#1e2434] border border-[#283248] text-[11px] text-[#cbd5e1] space-y-1">
            <span className="font-bold text-[#60a5fa] block">💡 أكواد تجريبية جاهزة من النظام:</span>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-[#f59e0b]">
              <span onClick={() => setCode('VIP-PRO-UNLIMITED')} className="cursor-pointer bg-[#262f44] px-2 py-0.5 rounded border border-[#333f5c] hover:border-[#f59e0b]">
                VIP-PRO-UNLIMITED
              </span>
              <span onClick={() => setCode('FREE-500-CREDITS')} className="cursor-pointer bg-[#262f44] px-2 py-0.5 rounded border border-[#333f5c] hover:border-[#f59e0b]">
                FREE-500-CREDITS
              </span>
            </div>
          </div>

          <form onSubmit={handleRedeem} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5">أدخل رمز الكود:</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="مثال: VIP-PRO-UNLIMITED"
                disabled={loading}
                className="w-full bg-[#11141d] text-sm font-mono text-white px-3 py-2.5 rounded-xl border border-[#283248] focus:border-[#f59e0b] focus:outline-none uppercase"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#2e1d1d] border border-[#ea4335]/40 text-xs text-[#ea4335] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-[#1e2e22] border border-[#34a853]/40 text-xs text-[#34a853] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                code.trim() && !loading
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white shadow-md shadow-yellow-500/20 cursor-pointer'
                  : 'bg-[#282a2c] text-[#5f6368] cursor-not-allowed'
              }`}
            >
              {loading ? 'جاري التحقق والتفعيل...' : 'تأكيد وشحن الكود الآن'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
