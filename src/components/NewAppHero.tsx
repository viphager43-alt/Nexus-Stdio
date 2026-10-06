import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Mic, 
  Calendar, 
  Mail, 
  FileSpreadsheet, 
  Cloud, 
  Smartphone, 
  Bot, 
  Globe, 
  ArrowLeft,
  Send
} from 'lucide-react';
import { UserProfile } from '../types';

interface NewAppHeroProps {
  onStartGenerating: (promptText: string) => void;
  onBrowseGallery: () => void;
  currentUser: UserProfile;
}

export const NewAppHero: React.FC<NewAppHeroProps> = ({
  onStartGenerating,
  onBrowseGallery,
  currentUser,
}) => {
  const [prompt, setPrompt] = useState('');

  const luckyPrompts = [
    'أنشئ لي تطبيق ويب تفاعلي كامل حاسبة ذكية ومحولة عملات مع واجهة عصرية في ملف HTML واحد',
    'أريد كود بوت تيليجرام كامل في بايثون مع محاكي تفاعلي وملف requirements.txt',
    'أنشئ تطبيق متجر إلكتروني للموبايل بفلاتر (Flutter) مع الأكواد ودليل استخراج ملف APK',
    'أريد موقع إدارة مهام وإنتاجية متطور مع حفظ المهام محلياً وتصميم أنيق',
    'أنشئ أداة تفاعلية لتحليل النصوص وتوليد المحتوى الإبداعي متجاوبة مع كافة الشاشات',
  ];

  const handleFeelingLucky = () => {
    const random = luckyPrompts[Math.floor(Math.random() * luckyPrompts.length)];
    setPrompt(random);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onStartGenerating(prompt.trim());
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#11141d] text-right flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-3xl w-full mx-auto my-auto space-y-6 pt-4">
        {/* Center Sparkle & Heading (Screenshot 1: "طوّر أفكارك مع جيميني") */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-gradient-to-tr from-[#2563eb]/20 via-[#60a5fa]/20 to-[#818cf8]/20 border border-[#3b82f6]/30 shadow-lg shadow-[#2563eb]/10 mb-1">
            <Sparkles className="w-8 h-8 text-[#60a5fa]" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            <span>طوّر أفكارك مع جيميني</span>
          </h1>
        </div>

        {/* Big Glowing Rounded Prompt Container (Screenshot 1) */}
        <form 
          onSubmit={handleSubmit}
          className="relative rounded-2xl bg-[#181d2a] border-2 border-transparent bg-clip-padding transition-all focus-within:shadow-[0_0_35px_rgba(59,130,246,0.3)] shadow-xl"
          style={{
            backgroundImage: 'linear-gradient(#181d2a, #181d2a), linear-gradient(135deg, #3b82f6 0%, #818cf8 50%, #f59e0b 100%)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          <div className="p-4 sm:p-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="صف تطبيقًا ودع جيميني يتولى الباقي"
              rows={4}
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-[#64748b] focus:outline-none resize-none leading-relaxed text-right"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>

          {/* Prompt Toolbar at bottom of box matching Screenshot 1 */}
          <div className="px-4 py-3 bg-[#141824]/90 border-t border-[#262f44] rounded-b-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-full text-[#94a3b8] hover:text-white hover:bg-[#202738] transition-colors"
                title="إرفاق ملف أو صورة"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-full text-[#94a3b8] hover:text-white hover:bg-[#202738] transition-colors"
                title="تسجيل صوتي"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleFeelingLucky}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e2434] hover:bg-[#262f44] text-xs font-semibold text-[#60a5fa] border border-[#283248] transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#60a5fa]" />
                <span>أشعر بأنني محظوظ ✨</span>
              </button>

              <button
                type="submit"
                disabled={!prompt.trim()}
                className={`p-2 rounded-xl transition-all ${
                  prompt.trim()
                    ? 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-md'
                    : 'bg-[#262f44] text-[#64748b] cursor-not-allowed'
                }`}
                title="إرسال وبدء التطوير"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </form>

        {/* Integration Pills below Prompt (Screenshot 1) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            onClick={() => setPrompt('أنشئ لي تطبيق متصل بـ تقويم وأجندة ذكية لتنظيم المواعيد والمهام اليومية')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181d2a] hover:bg-[#202738] text-[#94a3b8] hover:text-white border border-[#262f44] shrink-0 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span>تقويم ذكي</span>
          </button>

          <button
            onClick={() => setPrompt('أنشئ لي أداة تنظيم ومسودات رسائل بريد جيميل ذكية')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181d2a] hover:bg-[#202738] text-[#94a3b8] hover:text-white border border-[#262f44] shrink-0 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#ef4444]" />
            <span>جيميل</span>
          </button>

          <button
            onClick={() => setPrompt('أنشئ لي أداة جداول بيانات تفاعلية لاستيراد وتحليل الملفات')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181d2a] hover:bg-[#202738] text-[#94a3b8] hover:text-white border border-[#262f44] shrink-0 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#10b981]" />
            <span>جداول بيانات</span>
          </button>

          <button
            onClick={() => setPrompt('أنشئ لي نظام إدارة ملفات وتخزين سحابي مثل جوجل درايف')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181d2a] hover:bg-[#202738] text-[#94a3b8] hover:text-white border border-[#262f44] shrink-0 transition-colors"
          >
            <Cloud className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>جوجل درايف</span>
          </button>

          <button
            onClick={() => setPrompt('أريد بناء تطبيق أندرويد متكامل باستخدام Flutter مع شرح استخراج ملف APK')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181d2a] hover:bg-[#202738] text-[#10b981] border border-[#262f44] shrink-0 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#10b981]" />
            <span>قم بإنشاء تطبيق أندرويد</span>
          </button>

          <button
            onClick={() => setPrompt('أريد بناء بوت تيليجرام تفاعلي في بايثون مع محاكي لاختباره')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181d2a] hover:bg-[#202738] text-[#60a5fa] border border-[#262f44] shrink-0 transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-[#60a5fa]" />
            <span>بوت تيليجرام تفاعلي</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer Section (Screenshot 1: "اكتشف أفكار التطبيقات وأعد مزجها") */}
      <div className="max-w-4xl w-full mx-auto pt-6 border-t border-[#232838] flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white">اكتشف أفكار التطبيقات وأعد مزجها</h3>
        <button
          onClick={onBrowseGallery}
          className="flex items-center gap-1.5 text-xs text-[#60a5fa] hover:text-white px-3 py-1.5 rounded-xl border border-[#283248] hover:border-[#3b82f6] transition-colors"
        >
          <span>تصفح تطبيقاتي</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
