import React from 'react';
import { 
  X, 
  Sliders, 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  Info, 
  Zap, 
  Cpu 
} from 'lucide-react';
import { UserProfile } from '../types';

interface ModelParametersProps {
  isOpen: boolean;
  onClose: () => void;
  model: string;
  onChangeModel: (val: string) => void;
  temperature: number;
  onChangeTemperature: (val: number) => void;
  topP: number;
  onChangeTopP: (val: number) => void;
  topK: number;
  onChangeTopK: (val: number) => void;
  currentUser: UserProfile;
}

export const ModelParameters: React.FC<ModelParametersProps> = ({
  isOpen,
  onClose,
  model,
  onChangeModel,
  temperature,
  onChangeTemperature,
  topP,
  onChangeTopP,
  topK,
  onChangeTopK,
  currentUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 w-80 bg-[#161a26] border-r border-[#232838] z-40 flex flex-col justify-between shadow-2xl text-right animate-in slide-in-from-left duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#232838] flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Sliders className="w-4 h-4 text-[#60a5fa]" />
          <span>إعدادات النموذج (Parameters)</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-[#94a3b8] hover:text-white rounded-lg hover:bg-[#1c2130]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
        {/* Model Selection */}
        <div>
          <label className="block font-bold text-[#f1f5f9] mb-2 flex items-center justify-between">
            <span>النموذج (Model)</span>
            {currentUser.isVip && (
              <span className="text-[10px] text-[#f59e0b] font-semibold flex items-center gap-1">
                <Crown className="w-3 h-3 fill-[#f59e0b]" />
                <span>VIP متاح Pro</span>
              </span>
            )}
          </label>
          <select
            value={model}
            onChange={(e) => onChangeModel(e.target.value)}
            className="w-full bg-[#1c2130] text-xs text-white p-2.5 rounded-xl border border-[#283046] focus:border-[#3b82f6] focus:outline-none"
          >
            <option value="gemini-3.8-flash">Gemini 3.8 Flash (الافتراضي - فائق السرعة وبلا حدود)</option>
            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (الاستدلال والتفكير العميق)</option>
            <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (خفيف واقتصادي)</option>
          </select>
          <p className="text-[11px] text-[#94a3b8] mt-1.5 leading-relaxed">
            النموذج يعمل بدون انقطاع أو حدود يومية لكافة المستخدمين.
          </p>
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-semibold text-[#f1f5f9]">
            <span>درجة الحرارة (Temperature):</span>
            <span className="font-mono text-[#60a5fa]">{temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={temperature}
            onChange={(e) => onChangeTemperature(parseFloat(e.target.value))}
            className="w-full accent-[#2563eb] bg-[#283046] h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#94a3b8]">
            <span>دقيق ومحدد (0.0)</span>
            <span>متوازن (1.0)</span>
            <span>إبداعي ومرن (2.0)</span>
          </div>
        </div>

        {/* Top P */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-semibold text-[#f1f5f9]">
            <span>Top P (أخذ العينات):</span>
            <span className="font-mono text-[#60a5fa]">{topP.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={topP}
            onChange={(e) => onChangeTopP(parseFloat(e.target.value))}
            className="w-full accent-[#2563eb] bg-[#283046] h-1.5 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-[#94a3b8]">يحدد احتمالية اختيار الكلمات الأكثر ملاءمة.</p>
        </div>

        {/* Top K */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-semibold text-[#f1f5f9]">
            <span>Top K:</span>
            <span className="font-mono text-[#60a5fa]">{topK}</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={topK}
            onChange={(e) => onChangeTopK(parseInt(e.target.value))}
            className="w-full accent-[#2563eb] bg-[#283046] h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Safety Settings Info */}
        <div className="p-3.5 rounded-2xl bg-[#1c2130] border border-[#283046] space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <span>إعدادات الأمان (Safety Settings)</span>
          </div>
          <p className="text-[11px] text-[#94a3b8] leading-relaxed">
            تم ضبط الأمان ليكون مرناً ومفتوحاً للبرمجة وتوليد الأكواد والبوتات والتطبيقات دون قيود رقابية تعسفية.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#232838] bg-[#12151e] text-[11px] text-[#94a3b8] space-y-1">
        <div className="flex items-center gap-1 text-[#60a5fa] font-bold">
          <Cpu className="w-3.5 h-3.5" />
          <span>محرك الذكاء الاصطناعي: Nexus GenAI</span>
        </div>
        <p>محدث لأحدث نماذج الذكاء الاصطناعي والاستدلال البرمجي.</p>
      </div>
    </div>
  );
};
