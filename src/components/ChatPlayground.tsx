import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Play, 
  Copy, 
  Check, 
  FileCode, 
  Bot, 
  Globe, 
  Smartphone, 
  RefreshCw, 
  Layers,
  Crown,
  Plus,
  CheckCircle2,
  ListOrdered,
  Settings2,
  Wand2
} from 'lucide-react';
import { ChatMessage, FileArtifact, UserProfile } from '../types';

interface ChatPlaygroundProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  systemInstruction: string;
  onUpdateSystemInstruction: (val: string) => void;
  currentUser: UserProfile;
  onOpenSandboxWithArtifact: (artifact: FileArtifact) => void;
  onOpenParameters: () => void;
  modelName: string;
}

export const ChatPlayground: React.FC<ChatPlaygroundProps> = ({
  messages,
  onSendMessage,
  isLoading,
  systemInstruction,
  onUpdateSystemInstruction,
  currentUser,
  onOpenSandboxWithArtifact,
  onOpenParameters,
  modelName,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [actionHistoryOpen, setActionHistoryOpen] = useState(true);
  const [systemOpen, setSystemOpen] = useState(false);
  const [editingSysPrompt, setEditingSysPrompt] = useState(systemInstruction);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditingSysPrompt(systemInstruction);
  }, [systemInstruction]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;
    onSendMessage(inputPrompt);
    setInputPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSaveSystem = () => {
    onUpdateSystemInstruction(editingSysPrompt);
    setSystemOpen(false);
  };

  const quickPrompts = [
    { label: '🤖 بوت تيليجرام تفاعلي كامل بالبايثون', prompt: 'أنشئ لي كود بوت تيليجرام تفاعلي كامل بالبايثون مع ملف requirements.txt ومحاكي أوامر.' },
    { label: '🌐 موقع ويب تفاعلي مع لوحة تحكم وحاسبة', prompt: 'أنشئ لي تطبيق ويب تفاعلي كامل بتصميم عصري وأدوات تفاعلية في ملف HTML واحد جاهز للمعاينة.' },
    { label: '📱 تطبيق موبايل فلاتر مع خطوات استخراج APK', prompt: 'أنشئ لي تطبيق متجر إلكتروني للموبايل بفلاتر (Flutter) مع الكود الكامل ودليل استخراج ملف APK.' },
    { label: '⚡ لعبة تفاعلية في ملف واحد', prompt: 'أنشئ لي لعبة ويب تفاعلية ممتعة ومميزة في ملف HTML/JS واحد تعمل في اللوحة التفاعلية.' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#12151e] overflow-hidden border-l border-[#232838]">
      {/* Top Model Chip matching Screenshot 3 */}
      <div className="px-4 py-2 bg-[#171b26] border-b border-[#232838] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c2130] text-[#60a5fa] border border-[#283046] font-mono text-[11px] shadow-xs">
            <Sparkles className="w-3 h-3 text-[#60a5fa]" />
            <span>Gemini 3.8 Flash</span>
            <span className="text-[#64748b]">•</span>
            <span className="text-[#10b981] font-sans font-medium">نشط وبلا حدود</span>
          </div>

          <button
            onClick={() => setSystemOpen(!systemOpen)}
            className="hidden sm:flex items-center gap-1 text-[#94a3b8] hover:text-white px-2 py-1 rounded-lg hover:bg-[#1c2130] transition-colors text-[11px]"
            title="تعليمات النظام (System Prompt)"
          >
            <Settings2 className="w-3 h-3 text-[#818cf8]" />
            <span>تعليمات النظام</span>
          </button>
        </div>

        <button
          onClick={onOpenParameters}
          className="flex items-center gap-1 text-[#94a3b8] hover:text-white px-2.5 py-1 rounded-lg bg-[#1c2130] hover:bg-[#242a3d] border border-[#283046] text-[11px] transition-colors"
          title="الإعدادات المتقدمة"
        >
          <Sliders className="w-3 h-3 text-[#60a5fa]" />
          <span>المعلمات</span>
        </button>
      </div>

      {/* System Instruction Collapsible Drawer */}
      {systemOpen && (
        <div className="p-3 bg-[#171b26] border-b border-[#232838] space-y-2 text-right text-xs animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#cbd5e1] text-[11px]">System Instructions (تعليمات النظام للموديل):</span>
            <button
              onClick={handleSaveSystem}
              className="px-2.5 py-1 rounded-lg bg-[#2563eb] text-white text-[10px] font-bold"
            >
              حفظ
            </button>
          </div>
          <textarea
            value={editingSysPrompt}
            onChange={(e) => setEditingSysPrompt(e.target.value)}
            rows={2}
            className="w-full bg-[#11141d] text-xs text-white p-2 rounded-lg border border-[#262f44] focus:border-[#3b82f6] focus:outline-none"
            placeholder="اكتب تعليمات النظام المخصصة..."
          />
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Empty state with quick starters */}
        {messages.length === 0 && (
          <div className="py-8 text-center space-y-6 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2563eb] to-[#818cf8] flex items-center justify-center mx-auto shadow-lg shadow-[#2563eb]/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">مرحباً بك في Nexus Studio</h3>
              <p className="text-xs text-[#94a3b8] mt-1.5 leading-relaxed">
                اطلب فكرة بوت، موقع، أو تطبيق، وسيقوم الذكاء الاصطناعي ببنائه كملف كامل مع كوده الخاص ومعاينته الحية فوراً بدون قيود يومية.
              </p>
            </div>

            {/* Quick starter prompt chips */}
            <div className="space-y-2 text-right">
              <span className="text-[11px] font-semibold text-[#64748b] block pr-1">أفكار سريعة للبدء:</span>
              <div className="grid grid-cols-1 gap-2">
                {quickPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(item.prompt)}
                    className="p-2.5 rounded-xl bg-[#171b26] hover:bg-[#1f2433] border border-[#232838] hover:border-[#3b82f6] text-xs text-[#cbd5e1] hover:text-white transition-all text-right flex items-center justify-between group shadow-xs"
                  >
                    <span>{item.label}</span>
                    <Wand2 className="w-3.5 h-3.5 text-[#60a5fa] opacity-60 group-hover:opacity-100 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action history box matching Screenshot 3 */}
        {messages.length > 0 && (
          <div className="rounded-2xl border border-[#262f44] bg-[#181d2a] overflow-hidden text-right shadow-xs">
            <button
              onClick={() => setActionHistoryOpen(!actionHistoryOpen)}
              className="w-full px-3.5 py-2.5 bg-[#1e2434] flex items-center justify-between text-xs font-semibold text-[#cbd5e1] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <ListOrdered className="w-3.5 h-3.5 text-[#60a5fa]" />
                <span>سجل الإجراءات (Action history)</span>
              </div>
              {actionHistoryOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {actionHistoryOpen && (
              <div className="p-3.5 text-[11px] text-[#94a3b8] space-y-2 bg-[#181d2a]">
                <p className="text-white mb-2 font-medium">العمليات المنفذة للتطبيق:</p>
                <div className="flex items-center justify-between py-1 border-b border-[#262f44]/60">
                  <span className="font-mono text-[#93c5fd]">⚡ Processed via Gemini 3.8 Flash</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-mono text-[#10b981]">📁 Code Artifact Generated & Runnable</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                </div>
              </div>
            )}
          </div>
        )}

        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            onOpenSandboxWithArtifact={onOpenSandboxWithArtifact}
          />
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 text-right">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2563eb] to-[#60a5fa] flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
            </div>
            <div className="bg-[#171b26] border border-[#283046] rounded-2xl p-3.5 text-xs text-[#cbd5e1] space-y-1 max-w-md shadow-md">
              <div className="flex items-center gap-2 text-[#60a5fa] font-semibold">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>جاري بناء التطبيق وتجهيز الملفات البرمجية...</span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">
                يتم استخراج الأكواد وتهيئتها للمعاينة الحية داخل اللوحة التفاعلية.
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area matching Screenshot 3 */}
      <div className="p-3 bg-[#171b26] border-t border-[#232838]">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="صف ما تريد تعديله أو إضافته للتطبيق... (أو اكتب فكرة جديدة)"
            rows={2}
            disabled={isLoading}
            className="w-full bg-[#11141d] text-xs sm:text-sm text-white placeholder-[#64748b] pr-4 pl-12 py-2.5 rounded-xl border border-[#262f44] focus:border-[#3b82f6] focus:outline-none resize-none leading-relaxed text-right"
          />

          <div className="absolute left-2.5 bottom-2.5 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className={`p-1.5 rounded-lg transition-all ${
                inputPrompt.trim() && !isLoading
                  ? 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-md'
                  : 'bg-[#1e2434] text-[#64748b] cursor-not-allowed'
              }`}
              title="إرسال الطلب (Enter)"
            >
              <Send className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface MessageItemProps {
  message: ChatMessage;
  onOpenSandboxWithArtifact: (artifact: FileArtifact) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onOpenSandboxWithArtifact,
}) => {
  const isUser = message.role === 'user';
  const [copiedText, setCopiedText] = useState(false);

  const handleCopyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className={`flex items-start gap-2.5 text-right ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
        isUser ? 'bg-[#2563eb] text-white' : 'bg-gradient-to-tr from-[#2563eb] to-[#818cf8] text-white'
      }`}>
        {isUser ? 'أنت' : <Sparkles className="w-3.5 h-3.5 text-white" />}
      </div>

      <div className={`max-w-[88%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
          isUser
            ? 'bg-[#1e2434] text-white rounded-tl-none border border-[#2b354d]'
            : 'bg-[#171b26] text-[#e2e8f0] rounded-tr-none border border-[#232838]'
        }`}>
          <div className="whitespace-pre-wrap break-words">{message.content}</div>

          <div className="flex items-center justify-end mt-2 pt-2 border-t border-[#232838]/80">
            <button
              onClick={handleCopyContent}
              className="text-[10px] text-[#94a3b8] hover:text-white flex items-center gap-1 transition-colors"
            >
              {copiedText ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedText ? 'تم النسخ' : 'نسخ النص'}</span>
            </button>
          </div>
        </div>

        {/* Generated File Artifacts */}
        {message.artifacts && message.artifacts.length > 0 && (
          <div className="space-y-2.5 pt-1 w-full">
            {message.artifacts.map((artifact, idx) => (
              <ArtifactCard
                key={idx}
                artifact={artifact}
                onOpenSandbox={() => onOpenSandboxWithArtifact(artifact)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ArtifactCardProps {
  artifact: FileArtifact;
  onOpenSandbox: () => void;
}

const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, onOpenSandbox }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [showCode, setShowCode] = useState(true);

  const handleDownload = () => {
    const blob = new Blob([artifact.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = artifact.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(artifact.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[#283046] bg-[#161a26] overflow-hidden shadow-md text-right">
      {/* File Header */}
      <div className="p-2.5 bg-[#1c2130] border-b border-[#232838] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#141722] border border-[#283046]">
            {artifact.category === 'bot' ? <Bot className="w-3.5 h-3.5 text-[#60a5fa]" /> : <Globe className="w-3.5 h-3.5 text-[#10b981]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs font-mono">{artifact.fileName}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#2563eb]/20 text-[#60a5fa]">
                {artifact.title}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {artifact.runnable && (
            <button
              onClick={onOpenSandbox}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>تشغيل في اللوحة</span>
            </button>
          )}

          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Download className="w-3 h-3" />
            <span>تحميل الملف</span>
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="bg-[#11141d]">
        <div className="px-3 py-1.5 bg-[#171b26] border-b border-[#232838] flex items-center justify-between text-xs">
          <button
            onClick={() => setShowCode(!showCode)}
            className="text-[10px] text-[#60a5fa] hover:text-white flex items-center gap-1"
          >
            <span>كود الملف البرمجي ({artifact.fileType})</span>
            {showCode ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 text-[10px] text-[#94a3b8] hover:text-white"
          >
            {copiedCode ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
            <span>{copiedCode ? 'تم النسخ' : 'نسخ الكود'}</span>
          </button>
        </div>

        {showCode && (
          <div className="p-3 max-h-60 overflow-y-auto">
            <pre className="font-mono text-xs text-[#93c5fd] whitespace-pre-wrap break-all dir-ltr text-left selection:bg-blue-600">
              {artifact.code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
