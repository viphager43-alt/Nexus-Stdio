import React, { useState } from 'react';
import { 
  Bot, 
  Globe, 
  Smartphone, 
  Sparkles, 
  ArrowLeft, 
  Terminal, 
  Layers, 
  Code2, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';
import { UserProfile } from '../types';

interface BotAppWizardProps {
  onGenerateFromWizard: (prompt: string, title: string, category: 'website' | 'bot' | 'app') => void;
  currentUser: UserProfile;
}

export const BotAppWizard: React.FC<BotAppWizardProps> = ({
  onGenerateFromWizard,
  currentUser,
}) => {
  const [targetType, setTargetType] = useState<'bot' | 'website' | 'app'>('bot');
  const [projectName, setProjectName] = useState('');
  const [techStack, setTechStack] = useState('python');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures(prev => [...prev, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== idx));
  };

  const handleQuickPreset = (type: 'bot' | 'website' | 'app') => {
    setTargetType(type);
    if (type === 'bot') {
      setProjectName('Telegram Gemini AI Bot');
      setTechStack('python');
      setDescription('بوت تيليجرام ذكي يجيب على أسئلة المستخدمين، يحلل الصور والنصوص، ويدير القنوات باحترافية.');
      setFeatures(['الرد الذكي عبر Gemini API', 'أوامر /start و /help و /ask', 'دعم الأزرار التفاعلية Inline Keyboards', 'ملف requirements.txt وتجهيز الاستضافة']);
    } else if (type === 'website') {
      setProjectName('Modern Crypto & Finance Tracker');
      setTechStack('html-tailwind');
      setDescription('لوحة تحكم موقع ويب تفاعلية حديثة بمظهر أنيق، متابعة أسعار حية، رسوم بيانية ومحولة سريعة.');
      setFeatures(['واجهة Dark Mode عصرية', 'بطاقات إحصائيات تفاعلية', 'محولة أسعار فورية', 'تصميم متوافق مع كافة الشاشات']);
    } else {
      setProjectName('E-Commerce Flutter Store App');
      setTechStack('flutter');
      setDescription('تطبيق متجر إلكتروني للموبايل لعرض وشراء المنتجات مع سلة تسوق وإشعار عند إتمام الطلب.');
      setFeatures(['قائمة منتجات مع تصفية وفلترة', 'سلة تسوق وتفاصيل الطلب', 'خطوات إعداد بيئة العمل واستخراج APK', 'كود main.dart كامل']);
    }
  };

  const handleGenerate = () => {
    let prompt = '';
    const name = projectName.trim() || (targetType === 'bot' ? 'Smart Bot' : targetType === 'website' ? 'Web App' : 'Mobile App');
    const desc = description.trim() || 'مشروع متكامل احترافي بأفضل الممارسات';

    if (targetType === 'bot') {
      prompt = `أريد بناء ${name}:
الوصف: ${desc}
اللغة / التقنية: ${techStack}
الميزات المطلوبة:
${features.map(f => `- ${f}`).join('\n')}

المطلوب بدقة واحترافية:
1. إرسال الكود في صيغة ملف برمجي كامل (مثال: bot.py أو index.js) وتحته الكود الكامل بدون اختصار.
2. ملف المتطلبات (requirements.txt أو package.json).
3. طريقة الإعداد والتشغيل خطوة بخطوة.
4. محاكاة ردود البوت وكيفية اختباره.`;
    } else if (targetType === 'website') {
      prompt = `أريد بناء موقع ويب تفاعلي كامل ${name}:
الوصف: ${desc}
التقنية: ملف HTML متكامل يدمج التصميم والجافاسكريبت (Single-file HTML with Tailwind/CSS & JS).
الميزات المطلوبة:
${features.map(f => `- ${f}`).join('\n')}

المطلوب بدقة:
1. إرسال الكود في صيغة ملف index.html وتحته الكود الكامل ليمكن تشغيله مباشرة في اللوحة التفاعلية.
2. تصميم احترافي، أنيق، وجذاب يدعم اللغة العربية ومناسب للموبايل والكمبيوتر.`;
    } else {
      prompt = `أريد بناء تطبيق هاتف ${name}:
الوصف: ${desc}
التقنية: ${techStack === 'flutter' ? 'Flutter / Dart' : 'React Native'}
الميزات المطلوبة:
${features.map(f => `- ${f}`).join('\n')}

المطلوب بدقة:
1. دليل تفصيلي لكيفية إنشاء التطبيق من الصفر خطوة بخطوة.
2. هيكل مجلدات المشروع (Project Structure).
3. ملف الكود الأساسي (main.dart أو App.js) كاملاً.
4. أوامر بناء واستخراج ملف APK النهائي للهاتف وتثبيته.`;
    }

    onGenerateFromWizard(prompt, name, targetType);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#131314] text-right">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-[#2d2f31] pb-4">
          <div className="flex items-center gap-2 text-[#8ab4f8] text-xs font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>معمار المشاريع الذكية (Bot & App Studio)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">توليد بوت، موقع، أو تطبيق متكامل كملف تنفيذي</h2>
          <p className="text-xs sm:text-sm text-[#9aa0a6] mt-1">
            حدد مواصفات مشروعك وسيقوم النظام ببنائه، وتوفير الملف البرمجي للتحميل المباشر مع تشغيله في اللوحة التفاعلية.
          </p>
        </div>

        {/* Quick Type Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#bdc1c6] mb-2">نوع المشروع المطلوب:</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleQuickPreset('bot')}
              className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between ${
                targetType === 'bot'
                  ? 'bg-[#1e2433] border-[#1a73e8] text-white shadow-md shadow-[#1a73e8]/20'
                  : 'bg-[#1e1f20] border-[#2d2f31] text-[#bdc1c6] hover:border-[#3c4043]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">بوت ذكي (Bot)</span>
                <Bot className="w-5 h-5 text-[#8ab4f8]" />
              </div>
              <p className="text-[11px] text-[#9aa0a6]">Telegram / Discord / WhatsApp في Python أو Node.js كملف جاهز مع محاكي تفاعلي.</p>
            </button>

            <button
              onClick={() => handleQuickPreset('website')}
              className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between ${
                targetType === 'website'
                  ? 'bg-[#1e2e22] border-[#34a853] text-white shadow-md shadow-[#34a853]/20'
                  : 'bg-[#1e1f20] border-[#2d2f31] text-[#bdc1c6] hover:border-[#3c4043]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">موقع ويب تفاعلي</span>
                <Globe className="w-5 h-5 text-[#34a853]" />
              </div>
              <p className="text-[11px] text-[#9aa0a6]">صفحة HTML/CSS/JS متكاملة تعمل مباشرة داخل اللوحة التفاعلية وقابلة للتنزيل.</p>
            </button>

            <button
              onClick={() => handleQuickPreset('app')}
              className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between ${
                targetType === 'app'
                  ? 'bg-[#2a2415] border-[#fbbc04] text-white shadow-md shadow-[#fbbc04]/20'
                  : 'bg-[#1e1f20] border-[#2d2f31] text-[#bdc1c6] hover:border-[#3c4043]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">تطبيق هاتف (Mobile App)</span>
                <Smartphone className="w-5 h-5 text-[#fbbc04]" />
              </div>
              <p className="text-[11px] text-[#9aa0a6]">Flutter أو React Native مع شرح كامل لكيفية إنشائه وأوامر استخراج ملف APK.</p>
            </button>
          </div>
        </div>

        {/* Project Details Form */}
        <div className="bg-[#1a1b1d] border border-[#2d2f31] rounded-2xl p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#bdc1c6] mb-1.5">اسم المشروع المقترح:</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="مثال: Smart Telegram Bot, Portfolio Web, Flutter Delivery App"
              className="w-full bg-[#202124] text-xs sm:text-sm text-white px-3 py-2.5 rounded-xl border border-[#3c4043] focus:border-[#8ab4f8] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#bdc1c6] mb-1.5">التقنية أو لغة البرمجة المفضلة:</label>
            <select
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full bg-[#202124] text-xs sm:text-sm text-white px-3 py-2.5 rounded-xl border border-[#3c4043] focus:border-[#8ab4f8] focus:outline-none"
            >
              {targetType === 'bot' && (
                <>
                  <option value="python">بايثون (Python - python-telegram-bot / discord.py)</option>
                  <option value="nodejs">نود جي اس (Node.js - Telegraf / Discord.js)</option>
                </>
              )}
              {targetType === 'website' && (
                <>
                  <option value="html-tailwind">HTML5 + Tailwind CSS + Vanilla JS (جاهز للتشغيل الفوري)</option>
                  <option value="react">React / Next.js Component</option>
                </>
              )}
              {targetType === 'app' && (
                <>
                  <option value="flutter">Flutter / Dart (يدعم تصدير ملف APK لأندرويد و iOS)</option>
                  <option value="react-native">React Native / Expo</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#bdc1c6] mb-1.5">وصف الفكرة واحتياجاتك:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="اكتب ماذا تريد أن يفعل البوت أو الموقع أو التطبيق بالتفصيل..."
              className="w-full bg-[#202124] text-xs sm:text-sm text-white px-3 py-2.5 rounded-xl border border-[#3c4043] focus:border-[#8ab4f8] focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Features Tag Input */}
          <div>
            <label className="block text-xs font-semibold text-[#bdc1c6] mb-1.5">الميزات الإضافية المطلوبة:</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                placeholder="أضف ميزة (مثال: زر مشاركة، استخراج APK، دعم اللغة العربية)..."
                className="flex-1 bg-[#202124] text-xs text-white px-3 py-2 rounded-lg border border-[#3c4043] focus:border-[#8ab4f8] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-2 bg-[#282a2c] hover:bg-[#323639] text-white text-xs rounded-lg transition-colors"
              >
                + إضافة
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-[#202124] border border-[#3c4043] text-xs text-[#8ab4f8] flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#34a853]" />
                  <span>{feat}</span>
                  <button
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-[#9aa0a6] hover:text-[#ea4335] text-xs ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-[#9aa0a6]">
            {currentUser.isVip ? (
              <span className="text-[#fbbc04]">👑 متاح لك توليد شامل وعميق بدون حدود في صيغة ملفات جاهزة.</span>
            ) : (
              <span className="text-[#34a853]">✅ متاح للاستخدام المجاني غير المحدود 24/7.</span>
            )}
          </div>

          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1a73e8] to-[#174ea6] hover:from-[#1b66c9] hover:to-[#1a73e8] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#1a73e8]/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>توليد وبناء المشروع كملف وكود فوراً</span>
          </button>
        </div>
      </div>
    </div>
  );
};
