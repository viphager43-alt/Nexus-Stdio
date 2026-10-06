/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NewAppHero } from './components/NewAppHero';
import { MyAppsView } from './components/MyAppsView';
import { ChatPlayground } from './components/ChatPlayground';
import { InteractiveSandbox } from './components/InteractiveSandbox';
import { AdminPanel } from './components/AdminPanel';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ModelParameters } from './components/ModelParameters';
import { GetCodeModal } from './components/GetCodeModal';
import { RedeemModal } from './components/RedeemModal';
import { 
  ChatSession, 
  ChatMessage, 
  UserProfile, 
  FileArtifact 
} from './types';
import { generateAiResponse, getUserProfile } from './services/api';
import { Megaphone, X } from 'lucide-react';

const getSessionStorageKey = (userId: string) => `nexus_studio_user_sessions_${userId}`;
const STORAGE_KEY_USER_ID = 'nexus_studio_current_user_id';

export default function App() {
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_USER_ID) || 'user-default';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user-default',
    name: 'viphager43',
    email: 'viphager43@gmail.com',
    credits: 100,
    isVip: false,
    totalPrompts: 12,
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: 'active',
  });

  // Current View:
  // 'new-app' = Screenshot 1 (Hero with "طوّر أفكارك مع جيميني")
  // 'apps' = Screenshot 2 (Private apps list)
  // 'workspace' = Screenshot 3 (Split Editor with AI Chat & Live Interactive Sandbox)
  // 'admin' = Secret Admin Dashboard (Protected)
  const [currentView, setCurrentView] = useState<'new-app' | 'apps' | 'workspace' | 'gallery' | 'admin' | 'docs'>('new-app');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [parametersOpen, setParametersOpen] = useState(false);
  const [getCodeOpen, setGetCodeOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [adminAuthOpen, setAdminAuthOpen] = useState(false);

  // Global Announcement
  const [announcement, setAnnouncement] = useState<{ text: string; active: boolean }>({
    text: 'مرحباً بك في Nexus Studio! المنصة تعمل بكامل طاقتها 24/7 دون قيود يومية.',
    active: true,
  });
  const [hideAnnouncement, setHideAnnouncement] = useState(false);

  // Private User Sessions (Strictly isolated per user)
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(getSessionStorageKey(currentUserId));
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse sessions', e);
    }
    return [
      {
        id: 'session-nexus',
        title: 'Nexus Studio Pro',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
        systemInstruction: 'أنت مهندس برمجيات محترف في Nexus Studio. عند طلب بوت أو موقع أو تطبيق ترسل الكود في صيغة ملف تنفيذي كامل وتحته الكود الكامل وشرح طريقة تشغيله أو استخراج APK.',
        model: 'gemini-3.8-flash',
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        isPinned: true,
      },
    ];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'session-nexus';
  });

  const [sandboxArtifact, setSandboxArtifact] = useState<FileArtifact | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Load User Profile & Settings
  const refreshUserProfile = async () => {
    try {
      const user = await getUserProfile(currentUserId);
      setCurrentUser(user);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setAnnouncement({
            text: data.settings.globalAnnouncement,
            active: data.settings.announcementActive,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  useEffect(() => {
    refreshUserProfile();
    fetchSettings();
  }, [currentUserId]);

  useEffect(() => {
    try {
      localStorage.setItem(getSessionStorageKey(currentUserId), JSON.stringify(sessions));
    } catch (err) {
      console.error('Failed to save sessions', err);
    }
  }, [sessions, currentUserId]);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

  // Automatically restore latest artifact from the selected session to the Interactive Sandbox
  useEffect(() => {
    if (currentSession?.messages?.length) {
      const lastWithArtifact = [...currentSession.messages].reverse().find(m => m.artifacts && m.artifacts.length > 0);
      if (lastWithArtifact?.artifacts && lastWithArtifact.artifacts.length > 0) {
        setSandboxArtifact(lastWithArtifact.artifacts[0]);
      }
    }
  }, [currentSessionId, currentSession]);

  const handleUpdateTitle = (newTitle: string) => {
    setSessions(prev =>
      prev.map(s => (s.id === currentSessionId ? { ...s, title: newTitle, updatedAt: new Date().toISOString() } : s))
    );
  };

  const handleUpdateSystemInstruction = (newInstruction: string) => {
    setSessions(prev =>
      prev.map(s => (s.id === currentSessionId ? { ...s, systemInstruction: newInstruction } : s))
    );
  };

  // Start new project from Hero (Screenshot 1)
  const handleStartFromHero = (promptText: string) => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: promptText.slice(0, 32) || 'مشروع جديد',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
      systemInstruction: 'أنت مهندس برمجيات محترف في Nexus Studio. عند طلب بوت أو موقع أو تطبيق ترسل الكود في صيغة ملف تنفيذي كامل وتحته الكود الكامل وشرح طريقة تشغيله أو استخراج APK.',
      model: 'gemini-3.8-flash',
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      isPinned: false,
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setCurrentView('workspace');

    setTimeout(() => {
      handleSendMessage(promptText);
    }, 120);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoadingAi) return;

    // Secret backdoor for owner: typing /admin or /لوحة opens admin modal
    const trimmed = text.trim().toLowerCase();
    if (trimmed === '/admin' || trimmed === '/root' || trimmed === 'admin' || trimmed === 'لوحة الادمن') {
      setAdminAuthOpen(true);
      return;
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...(currentSession?.messages || []), userMsg];
    setSessions(prev =>
      prev.map(s =>
        s.id === currentSessionId
          ? {
              ...s,
              messages: updatedMessages,
              title: s.messages.length === 0 ? text.slice(0, 30) : s.title,
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );

    setIsLoadingAi(true);

    try {
      const aiResult = await generateAiResponse({
        prompt: text,
        messages: updatedMessages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        systemInstruction: currentSession?.systemInstruction,
        model: currentSession?.model || 'gemini-3.8-flash',
        temperature: currentSession?.temperature || 0.7,
        topP: currentSession?.topP || 0.95,
        topK: currentSession?.topK || 40,
        userId: currentUser.id,
        isVipRequested: currentUser.isVip,
      });

      const modelMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'model',
        content: aiResult.reply,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: aiResult.model,
        artifacts: aiResult.artifacts,
        isVipGeneration: aiResult.isVip,
      };

      setSessions(prev =>
        prev.map(s =>
          s.id === currentSessionId
            ? { ...s, messages: [...updatedMessages, modelMsg], updatedAt: new Date().toISOString() }
            : s
        )
      );

      if (aiResult.artifacts && aiResult.artifacts.length > 0) {
        setSandboxArtifact(aiResult.artifacts[0]);
      }

      setCurrentUser(prev => ({
        ...prev,
        credits: aiResult.remainingCredits,
        totalPrompts: prev.totalPrompts + 1,
      }));
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'model',
        content: `⚠️ خطأ: ${err.message || 'يرجى المحاولة مجدداً'}`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      setSessions(prev =>
        prev.map(s =>
          s.id === currentSessionId
            ? { ...s, messages: [...updatedMessages, errorMsg] }
            : s
        )
      );
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleRemix = () => {
    if (currentSession?.messages.length) {
      const lastUserMsg = [...currentSession.messages].reverse().find(m => m.role === 'user');
      if (lastUserMsg) {
        handleSendMessage(`أريد إعادة تحسين ومزج هذا التطبيق بإضافة أدوات وميزات متقدمة: ${lastUserMsg.content}`);
      }
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleTogglePinSession = (sessionId: string) => {
    setSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, isPinned: !s.isPinned } : s))
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#11141d] text-[#e2e8f0]">
      {/* Global Announcement Banner */}
      {announcement.active && !hideAnnouncement && (
        <div className="bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#6366f1] text-white px-4 py-1.5 flex items-center justify-between text-xs font-medium z-50 shadow-md">
          <div className="flex items-center gap-2 max-w-4xl mx-auto truncate text-center">
            <Megaphone className="w-3.5 h-3.5 shrink-0 animate-bounce" />
            <span className="truncate">{announcement.text}</span>
          </div>
          <button
            onClick={() => setHideAnnouncement(true)}
            className="p-1 hover:bg-black/20 rounded text-white/90"
            title="إغلاق"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Header matching Screenshot 3: Nexus Studio Pro */}
      <Header
        currentTitle={currentSession?.title || 'Nexus Studio Pro'}
        onUpdateTitle={handleUpdateTitle}
        currentUser={currentUser}
        onOpenGetCode={() => setGetCodeOpen(true)}
        onOpenRedeem={() => setRedeemOpen(true)}
        onOpenAdminSecret={() => setAdminAuthOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onBackToStart={() => setCurrentView('new-app')}
        onRemix={handleRemix}
        isWorkspaceView={currentView === 'workspace'}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar matching Screenshot 1 & 2 */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeView={currentView}
          onChangeView={(v) => {
            setCurrentView(v);
            if (v === 'new-app') setSidebarOpen(false);
          }}
          onOpenRedeem={() => setRedeemOpen(true)}
          onOpenAdminSecret={() => setAdminAuthOpen(true)}
          onOpenHistory={() => setCurrentView('apps')}
          currentUser={currentUser}
        />

        {/* Center Content based on View */}
        <main className="flex-1 flex overflow-hidden">
          {/* View 1: New App Hero (Screenshot 1) */}
          {currentView === 'new-app' && (
            <NewAppHero
              onStartGenerating={handleStartFromHero}
              onBrowseGallery={() => setCurrentView('apps')}
              currentUser={currentUser}
            />
          )}

          {/* View 2: Private Applications List (Screenshot 2) */}
          {(currentView === 'apps' || currentView === 'gallery') && (
            <MyAppsView
              sessions={sessions}
              onOpenSession={(id) => {
                setCurrentSessionId(id);
                setCurrentView('workspace');
              }}
              onNewApp={() => setCurrentView('new-app')}
              onDeleteSession={handleDeleteSession}
              onTogglePinSession={handleTogglePinSession}
            />
          )}

          {/* View 3: Split Workspace Editor (Screenshot 3) */}
          {currentView === 'workspace' && (
            <div className="flex-1 flex flex-col md:flex-row h-full w-full overflow-hidden">
              {/* Left Column: AI Assistant Chat & Action history */}
              <div className="w-full md:w-[48%] h-full flex flex-col">
                <ChatPlayground
                  messages={currentSession?.messages || []}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoadingAi}
                  systemInstruction={currentSession?.systemInstruction || ''}
                  onUpdateSystemInstruction={handleUpdateSystemInstruction}
                  currentUser={currentUser}
                  onOpenSandboxWithArtifact={(art) => setSandboxArtifact(art)}
                  onOpenParameters={() => setParametersOpen(true)}
                  modelName={currentSession?.model || 'gemini-3.8-flash'}
                />
              </div>

              {/* Right Column: Live Interactive Sandbox with Preview & Tips Carousel */}
              <div className="w-full md:w-[52%] h-full flex flex-col border-r border-[#232838]">
                <InteractiveSandbox
                  currentArtifact={sandboxArtifact}
                  isLoading={isLoadingAi}
                />
              </div>
            </div>
          )}

          {/* View 4: Secret Protected Admin Dashboard */}
          {currentView === 'admin' && (
            <AdminPanel
              onBackToPlayground={() => setCurrentView('workspace')}
              onRefreshUserProfile={refreshUserProfile}
            />
          )}

          {/* View 5: Docs */}
          {currentView === 'docs' && (
            <div className="flex-1 p-6 overflow-y-auto text-right space-y-4 max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-white">وثائق Nexus Studio</h2>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                منصة Nexus Studio تتيح لك بناء وتطوير تطبيقات الويب، بوتات التيليجرام والديسكورد، وتطبيقات الموبايل وتصديرها كملفات جاهزة مع معاينة حية بدون أي قيود يومية.
              </p>
              <div className="bg-[#181d2a] p-4 rounded-xl border border-[#262f44] text-xs space-y-2">
                <h4 className="font-bold text-[#60a5fa]">شحن الأكواد:</h4>
                <p className="text-[#94a3b8]">
                  استخدم كود <code className="text-[#f59e0b] font-mono">VIP-PRO-UNLIMITED</code> للحصول على صلاحيات VIP الدائمة الفورية.
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Model Parameters Drawer */}
        <ModelParameters
          isOpen={parametersOpen}
          onClose={() => setParametersOpen(false)}
          model={currentSession?.model || 'gemini-3.8-flash'}
          onChangeModel={(m) => {
            setSessions(prev =>
              prev.map(s => (s.id === currentSessionId ? { ...s, model: m } : s))
            );
          }}
          temperature={currentSession?.temperature ?? 0.7}
          onChangeTemperature={(t) => {
            setSessions(prev =>
              prev.map(s => (s.id === currentSessionId ? { ...s, temperature: t } : s))
            );
          }}
          topP={currentSession?.topP ?? 0.95}
          onChangeTopP={(p) => {
            setSessions(prev =>
              prev.map(s => (s.id === currentSessionId ? { ...s, topP: p } : s))
            );
          }}
          topK={currentSession?.topK ?? 40}
          onChangeTopK={(k) => {
            setSessions(prev =>
              prev.map(s => (s.id === currentSessionId ? { ...s, topK: k } : s))
            );
          }}
          currentUser={currentUser}
        />
      </div>

      {/* Secret Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={adminAuthOpen}
        onClose={() => setAdminAuthOpen(false)}
        onSuccess={() => {
          setCurrentView('admin');
        }}
      />

      {/* Get Code Export Modal */}
      <GetCodeModal
        isOpen={getCodeOpen}
        onClose={() => setGetCodeOpen(false)}
        promptText={currentSession?.messages.slice(-1)[0]?.content || ''}
        systemInstruction={currentSession?.systemInstruction || ''}
        model={currentSession?.model || 'gemini-3.8-flash'}
        temperature={currentSession?.temperature ?? 0.7}
      />

      {/* Redeem Promo Code Modal */}
      <RedeemModal
        isOpen={redeemOpen}
        onClose={() => setRedeemOpen(false)}
        currentUser={currentUser}
        onSuccess={(updatedUser) => {
          setCurrentUser(updatedUser);
          refreshUserProfile();
        }}
      />
    </div>
  );
}
