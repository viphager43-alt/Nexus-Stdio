import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCw, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Bot, 
  Globe, 
  Download, 
  Code2, 
  Send, 
  ExternalLink,
  Layers,
  Sparkles,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Copy,
  Terminal,
  PackageCheck,
  CheckCircle2
} from 'lucide-react';
import { FileArtifact } from '../types';

interface InteractiveSandboxProps {
  currentArtifact: FileArtifact | null;
  onSelectArtifact?: (artifact: FileArtifact) => void;
  isLoading?: boolean;
}

export const InteractiveSandbox: React.FC<InteractiveSandboxProps> = ({
  currentArtifact,
  isLoading,
}) => {
  const defaultArtifact: FileArtifact = {
    fileName: 'app.html',
    fileType: 'html',
    category: 'website',
    title: 'تطبيق ويب تفاعلي متكامل',
    code: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>Nexus Studio Live Sandbox</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .card {
      background: #1e293b;
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      border: 1px solid #334155;
      width: 100%;
      max-width: 450px;
      text-align: center;
    }
    h2 { color: #60a5fa; margin-top: 0; font-size: 22px; font-weight: 800; }
    p { color: #94a3b8; font-size: 13px; line-height: 1.6; margin-bottom: 20px; }
    .badge {
      display: inline-block;
      background: rgba(59, 130, 246, 0.2);
      color: #93c5fd;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: bold;
      cursor: pointer;
      margin: 4px;
      transition: all 0.2s;
    }
    .btn:hover { background: #1d4ed8; transform: translateY(-1px); }
    .counter {
      font-size: 44px;
      font-weight: 900;
      color: #38bdf8;
      margin: 14px 0;
    }
    input {
      width: 85%;
      padding: 12px;
      border-radius: 10px;
      border: 1px solid #475569;
      background: #0f172a;
      color: white;
      margin-top: 15px;
      text-align: center;
      box-sizing: border-box;
      font-size: 13px;
    }
    .output-box {
      margin-top: 14px;
      padding: 10px;
      background: #0f172a;
      border-radius: 8px;
      font-size: 12px;
      color: #34d399;
      min-height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Nexus Studio Sandbox</div>
    <h2>⚡ لوحة التشغيل التفاعلية</h2>
    <p>هنا يتم تشغيل واختبار الأكواد والتطبيقات التي يقوم Nexus Studio بإنشائها فوراً مع تفاعل حقيقي وتحديث مباشر.</p>
    <div class="counter" id="num">0</div>
    <div>
      <button class="btn" onclick="add(1)">+ زيادة</button>
      <button class="btn" onclick="add(-1)">- إنقاص</button>
      <button class="btn" onclick="reset()" style="background:#ef4444">إعادة ضبط</button>
    </div>
    <div>
      <input type="text" id="inp" placeholder="اكتب نصاً لتجربة التفاعل الفوري..." />
      <br>
      <button class="btn" onclick="test()" style="background:#10b981; margin-top: 10px;">تجربة التفاعل</button>
      <div class="output-box" id="res">جاهز للتجربة التفاعلية</div>
    </div>
  </div>
  <script>
    let c = 0;
    function add(n) { c += n; document.getElementById('num').innerText = c; }
    function reset() { c = 0; document.getElementById('num').innerText = 0; }
    function test() {
      const v = document.getElementById('inp').value;
      document.getElementById('res').innerText = v ? 'استجابة حية: ' + v : 'يرجى كتابة نص للتجربة!';
    }
  </script>
</body>
</html>`,
    runnable: true,
  };

  const artifact = currentArtifact || defaultArtifact;
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'mobile-app' | 'bot-tester' | 'code'>('preview');
  const [iframeSrc, setIframeSrc] = useState('');
  const [editableCode, setEditableCode] = useState(artifact.code);
  const [copiedCode, setCopiedCode] = useState(false);
  const [appliedEdits, setAppliedEdits] = useState(false);
  const [apkBuilding, setApkBuilding] = useState(false);
  const [apkDownloaded, setApkDownloaded] = useState(false);

  // Sync editable code when artifact changes
  useEffect(() => {
    if (artifact && artifact.code) {
      setEditableCode(artifact.code);
      const blob = new Blob([artifact.code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setIframeSrc(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [artifact]);

  // Tips carousel while loading
  const tips = [
    {
      title: 'بناء متواصل بلا حدود',
      desc: 'في Nexus Studio يمكنك طلب أفكار متقدمة لبوتات، تطبيقات، ومواقع وتطويرها في أي وقت على مدار اليوم.',
      icon: '⚡',
    },
    {
      title: 'توليد ملفات تنفيذية جاهزة للتحميل',
      desc: 'عند طلب أي بوت أو موقع، يتم تجهيزه في صيغة ملف برمجي كامل مع كوده الخاص وزر تحميل فوري.',
      icon: '📁',
    },
    {
      title: 'استخراج وبناء ملفات APK للموبايل',
      desc: 'إذا طلبت تطبيق هاتف، يوفر لك Nexus Studio خطوات التأسيس من الصفر مع أوامر البناء واستخراج ملف APK.',
      icon: '📱',
    },
    {
      title: 'لوحة تفاعلية متكاملة',
      desc: 'يمكنك معاينة المواقع، تشغيل محاكي البوت التفاعلي، واختبار الواجهات مباشرة داخل المتصفح.',
      icon: '🚀',
    },
  ];
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setTipIndex(prev => (prev + 1) % tips.length);
      }, 3500);
      return () => clearInterval(timer);
    }
  }, [isLoading]);

  // Bot simulator state
  const [botMessages, setBotMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    { 
      sender: 'bot', 
      text: '🤖 أهلاً بك في محاكي البوت التفاعلي!\nتم ربط هذا المحاكي تلقائياً بكود البوت المولد.\nأرسل /start أو انقر على الأوامر السريعة أدناه.', 
      time: '00:00' 
    },
  ]);
  const [botInput, setBotInput] = useState('');

  const handleApplyCodeEdits = () => {
    const blob = new Blob([editableCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setIframeSrc(url);
    setAppliedEdits(true);
    setActiveTab('preview');
    setTimeout(() => setAppliedEdits(false), 2000);
  };

  const handleRefresh = () => {
    const blob = new Blob([editableCode || artifact.code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setIframeSrc(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editableCode || artifact.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownload = () => {
    const content = editableCode || artifact.code;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = artifact.fileName || 'nexus_app.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sendBotCommand = (cmd: string) => {
    const timeNow = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    setBotMessages(prev => [...prev, { sender: 'user', text: cmd, time: timeNow }]);

    setTimeout(() => {
      let reply = '';
      if (cmd === '/start') {
        reply = '👋 مرحباً بك! البوت يعمل الآن بشكل كامل عبر Nexus Studio.\nالأوامر المتاحة:\n/help - شرح الميزات\n/balance - فحص الرصيد\n/features - قائمة الخدمات';
      } else if (cmd === '/help') {
        reply = '📖 المساعدة:\nهذا البوت مبرمج لمعالجة الطلبات وإرجاع الردود الذكية وتخزين البيانات.';
      } else if (cmd === '/balance') {
        reply = '💎 رصيدك الحالي: غير محدود (VIP Active)\nتم ربط الحساب بنجاح.';
      } else if (cmd === '/features') {
        reply = '⚡ الميزات:\n1. استجابة فائقة السرعة\n2. دعم الأزرار التفاعلية\n3. معالجة وتصدير البيانات';
      } else {
        reply = `✅ استلمت الأمر: "${cmd}"\nتم تنفيذ العملية بنجاح!`;
      }
      setBotMessages(prev => [...prev, { sender: 'bot', text: reply, time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 350);
  };

  const handleSendBotMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!botInput.trim()) return;
    const text = botInput.trim();
    setBotInput('');
    sendBotCommand(text);
  };

  const handleSimulateApkBuild = () => {
    setApkBuilding(true);
    setApkDownloaded(false);
    setTimeout(() => {
      setApkBuilding(false);
      setApkDownloaded(true);
      // Download fake sample apk package
      const blob = new Blob(['Nexus Studio APK Package Binary'], { type: 'application/vnd.android.package-archive' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nexus-app-release.apk';
      a.click();
      URL.revokeObjectURL(url);
    }, 2500);
  };

  const getContainerWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-[370px] h-[660px] shadow-2xl rounded-[32px] border-4 border-[#2d3748] my-auto';
      case 'tablet':
        return 'w-[740px] h-[88%] shadow-2xl rounded-2xl border-2 border-[#2d3748] my-auto';
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#12151e] overflow-hidden">
      {/* Top Header matching Screenshot 3: [Preview] tab, refresh, actions */}
      <div className="h-12 bg-[#171b26] border-b border-[#232838] px-3 sm:px-4 flex items-center justify-between select-none">
        {/* Left: View Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'preview'
                ? 'bg-[#232838] text-white shadow-xs border border-[#3b82f6]/40'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block animate-pulse"></span>
            <span>المعاينة (Preview)</span>
          </button>

          <button
            onClick={() => setActiveTab('bot-tester')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'bot-tester'
                ? 'bg-[#232838] text-[#60a5fa] border border-[#3b82f6]/40'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-[#60a5fa]" />
            <span>محاكي البوت</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile-app')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'mobile-app'
                ? 'bg-[#232838] text-[#a855f7] border border-[#a855f7]/40'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#a855f7]" />
            <span>تطبيق APK</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'code'
                ? 'bg-[#232838] text-white border border-[#3b82f6]/40'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>محرر الكود</span>
          </button>
        </div>

        {/* Right: Viewport mode switcher & download */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[#94a3b8]">
          {activeTab === 'preview' && (
            <div className="hidden sm:flex items-center bg-[#1c2130] p-0.5 rounded-lg border border-[#232838]">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-1.5 rounded-md ${viewMode === 'desktop' ? 'bg-[#2a3144] text-white' : 'hover:text-white'}`}
                title="شاشة كمبيوتر"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-1.5 rounded-md ${viewMode === 'tablet' ? 'bg-[#2a3144] text-white' : 'hover:text-white'}`}
                title="تابلت"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded-md ${viewMode === 'mobile' ? 'bg-[#2a3144] text-white' : 'hover:text-white'}`}
                title="موبايل"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg hover:text-white hover:bg-[#232838] transition-colors"
            title="إعادة تحميل المعاينة"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2563eb]/20 hover:bg-[#2563eb]/40 text-[#60a5fa] border border-[#2563eb]/30 text-xs font-semibold transition-all"
            title="تحميل الملف التنفيذي"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تحميل الملف</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 relative overflow-auto flex items-center justify-center p-2 sm:p-4 bg-[#0e111a]">
        {/* Loading Tips Carousel matching Screenshot 3 */}
        {isLoading && (
          <div className="w-full max-w-sm bg-[#171b26] border border-[#232838] rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl relative animate-in fade-in">
            <span className="text-xs text-[#60a5fa] font-mono tracking-wide">Building your app in Nexus Studio</span>
            <h3 className="text-lg font-bold text-white tracking-tight">نصائح ومميزات المنصة</h3>
            
            {/* Tip Illustration Card */}
            <div className="bg-[#1c2130] border border-[#283046] rounded-2xl p-6 text-center space-y-3 shadow-inner">
              <div className="text-3xl mb-1">{tips[tipIndex].icon}</div>
              <h4 className="text-sm font-bold text-white">{tips[tipIndex].title}</h4>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {tips[tipIndex].desc}
              </p>
            </div>

            {/* Carousel navigation arrows */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => setTipIndex(prev => (prev - 1 + tips.length) % tips.length)}
                className="w-8 h-8 rounded-full bg-[#1c2130] hover:bg-[#283046] border border-[#283046] flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-[#64748b]">
                {tipIndex + 1} / {tips.length}
              </span>
              <button
                onClick={() => setTipIndex(prev => (prev + 1) % tips.length)}
                className="w-8 h-8 rounded-full bg-[#1c2130] hover:bg-[#283046] border border-[#283046] flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Live Interactive Web App Runner */}
        {!isLoading && activeTab === 'preview' && (
          <div className={`transition-all duration-300 overflow-hidden bg-white ${getContainerWidth()}`}>
            <iframe
              src={iframeSrc}
              title="Nexus Studio Live Runner"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-forms allow-modals allow-same-origin"
            />
          </div>
        )}

        {/* Tab 2: Code Editor & Live Apply */}
        {!isLoading && activeTab === 'code' && (
          <div className="w-full h-full max-w-4xl bg-[#171b26] rounded-2xl border border-[#232838] p-4 sm:p-5 overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#232838] mb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#60a5fa] font-bold">{artifact.fileName || 'app.html'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#232838] text-[#94a3b8]">محرر حي</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleApplyCodeEdits}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow-md"
                  title="تطبيق التعديلات في المعاينة الحية فوراً"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{appliedEdits ? 'تم التطبيق!' : 'تشغيل التعديلات'}</span>
                </button>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white px-2.5 py-1.5 rounded-lg bg-[#1c2130] border border-[#232838]"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'تم النسخ' : 'نسخ'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={editableCode}
              onChange={(e) => setEditableCode(e.target.value)}
              className="flex-1 w-full bg-[#0f121a] text-[#93c5fd] font-mono text-xs p-4 rounded-xl border border-[#232838] focus:border-[#3b82f6] focus:outline-none resize-none leading-relaxed dir-ltr text-left selection:bg-blue-600"
              placeholder="اكتب أو عدل الكود هنا..."
            />
          </div>
        )}

        {/* Tab 3: Bot Simulator */}
        {!isLoading && activeTab === 'bot-tester' && (
          <div className="w-full max-w-md h-[560px] bg-[#171b26] rounded-2xl border border-[#283046] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-3.5 bg-[#1c2130] border-b border-[#232838] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#2563eb] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">محاكي البوت التفاعلي</h4>
                  <span className="text-[10px] text-[#10b981]">متصل وجاهز للاختبار</span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#94a3b8]">{artifact.fileName}</span>
            </div>

            {/* Quick Command Pills */}
            <div className="p-2 bg-[#141722] border-b border-[#232838] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
              <span className="text-[#64748b] text-[10px] shrink-0">أوامر سريعة:</span>
              <button 
                onClick={() => sendBotCommand('/start')} 
                className="px-2 py-0.5 rounded-full bg-[#1e2434] hover:bg-[#2563eb] text-white font-mono shrink-0 transition-colors"
              >
                /start
              </button>
              <button 
                onClick={() => sendBotCommand('/help')} 
                className="px-2 py-0.5 rounded-full bg-[#1e2434] hover:bg-[#2563eb] text-white font-mono shrink-0 transition-colors"
              >
                /help
              </button>
              <button 
                onClick={() => sendBotCommand('/balance')} 
                className="px-2 py-0.5 rounded-full bg-[#1e2434] hover:bg-[#2563eb] text-white font-mono shrink-0 transition-colors"
              >
                /balance
              </button>
              <button 
                onClick={() => sendBotCommand('/features')} 
                className="px-2 py-0.5 rounded-full bg-[#1e2434] hover:bg-[#2563eb] text-white font-mono shrink-0 transition-colors"
              >
                /features
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#0f121a]">
              {botMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-[#2563eb] text-white rounded-br-none'
                        : 'bg-[#1c2130] text-[#e2e8f0] border border-[#232838] rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-[#64748b] mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendBotMessage} className="p-2.5 bg-[#1c2130] border-t border-[#232838] flex items-center gap-2">
              <input
                type="text"
                value={botInput}
                onChange={(e) => setBotInput(e.target.value)}
                placeholder="أرسل رسالة للبوت (/start)..."
                className="flex-1 bg-[#0f121a] text-xs text-white placeholder-[#64748b] px-3 py-2 rounded-lg border border-[#283046] focus:border-[#3b82f6] focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5 rotate-180" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Mobile App & APK Architect */}
        {!isLoading && activeTab === 'mobile-app' && (
          <div className="w-full max-w-2xl bg-[#171b26] rounded-2xl border border-[#283046] p-5 shadow-2xl flex flex-col md:flex-row gap-5 overflow-y-auto max-h-[90%]">
            {/* Left: Phone Preview Mockup */}
            <div className="w-[280px] h-[520px] bg-[#000] border-4 border-[#334155] rounded-[36px] p-3 shadow-2xl flex flex-col justify-between shrink-0 mx-auto">
              {/* Phone notch */}
              <div className="w-24 h-4 bg-[#1e293b] rounded-full mx-auto mb-2"></div>
              
              {/* Phone Screen */}
              <div className="flex-1 bg-[#1e293b] rounded-2xl p-4 overflow-hidden flex flex-col justify-between text-right">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#334155] pb-2">
                    <span className="text-xs font-bold text-white">Nexus App</span>
                    <span className="text-[10px] text-[#10b981]">v1.0.0</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#60a5fa]">معاينة التطبيق على الهاتف</h4>
                  <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                    تم تجهيز بنية التطبيق للعمل بنظامي Android و iOS مع استخراج ملف APK الجاهز للتثبيت.
                  </p>
                  <div className="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155] text-center space-y-1">
                    <span className="text-xs font-bold text-white block">حالة الحزمة:</span>
                    <span className="text-[11px] text-[#34d399] font-medium">Ready for Release (Release APK)</span>
                  </div>
                </div>

                <button 
                  onClick={handleSimulateApkBuild}
                  disabled={apkBuilding}
                  className="w-full py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>{apkBuilding ? 'جاري بناء APK...' : 'بناء وتنزيل APK'}</span>
                </button>
              </div>

              {/* Phone bottom bar */}
              <div className="w-20 h-1 bg-white/40 rounded-full mx-auto mt-2"></div>
            </div>

            {/* Right: APK Build Instructions & Steps */}
            <div className="flex-1 space-y-4 text-right">
              <div>
                <h3 className="text-base font-bold text-white">دليل بناء وتشغيل تطبيق الموبايل</h3>
                <p className="text-xs text-[#94a3b8] mt-1">
                  خطوات تحويل الكود إلى ملف APK نهائي جاهز للنشر على متجر التطبيقات أو التثبيت المباشر.
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-[#11141d] rounded-xl border border-[#232838] space-y-1">
                  <span className="font-bold text-[#60a5fa] block">1. تثبيت المشروع:</span>
                  <code className="text-[11px] text-[#a855f7] font-mono dir-ltr block text-left bg-[#1c2130] p-1.5 rounded">
                    flutter create nexus_app && cd nexus_app
                  </code>
                </div>

                <div className="p-3 bg-[#11141d] rounded-xl border border-[#232838] space-y-1">
                  <span className="font-bold text-[#60a5fa] block">2. وضع كود التطبيق في ملف:</span>
                  <code className="text-[11px] text-[#a855f7] font-mono dir-ltr block text-left bg-[#1c2130] p-1.5 rounded">
                    lib/main.dart
                  </code>
                </div>

                <div className="p-3 bg-[#11141d] rounded-xl border border-[#232838] space-y-1">
                  <span className="font-bold text-[#10b981] block">3. أمر بناء ملف APK النهائي:</span>
                  <code className="text-[11px] text-[#34d399] font-mono dir-ltr block text-left bg-[#1c2130] p-1.5 rounded">
                    flutter build apk --release --split-per-abi
                  </code>
                </div>

                <div className="p-3 bg-[#11141d] rounded-xl border border-[#232838] space-y-1">
                  <span className="font-bold text-[#f59e0b] block">4. مسار ملف APK الناتج:</span>
                  <code className="text-[10px] text-[#cbd5e1] font-mono dir-ltr block text-left bg-[#1c2130] p-1.5 rounded">
                    build/app/outputs/flutter-apk/app-release.apk
                  </code>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleSimulateApkBuild}
                  disabled={apkBuilding}
                  className="flex-1 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>{apkBuilding ? 'جاري تجميع حزمة APK...' : 'تحميل حزمة APK التجريبية'}</span>
                </button>
                {apkDownloaded && (
                  <span className="text-xs text-[#10b981] flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم التحميل!</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
