import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  LayoutGrid, 
  List, 
  Pin, 
  Trash2, 
  ExternalLink, 
  Clock, 
  FolderPlus,
  Sparkles,
  Layers
} from 'lucide-react';
import { ChatSession } from '../types';

interface MyAppsViewProps {
  sessions: ChatSession[];
  onOpenSession: (sessionId: string) => void;
  onNewApp: () => void;
  onDeleteSession: (sessionId: string) => void;
  onTogglePinSession: (sessionId: string) => void;
}

export const MyAppsView: React.FC<MyAppsViewProps> = ({
  sessions,
  onOpenSession,
  onNewApp,
  onDeleteSession,
  onTogglePinSession,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pinned'>('all');
  const [isGridView, setIsGridView] = useState(false);

  // Strictly ONLY the current user's actual sessions (No external or dummy projects!)
  const userApps = sessions.map((s, idx) => {
    const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600'];
    const color = colors[idx % colors.length];
    return {
      id: s.id,
      letter: s.title ? s.title.charAt(0) : 'ت',
      color,
      title: s.title || 'مشروع جديد',
      desc: s.messages.length > 0 
        ? s.messages[s.messages.length - 1].content.slice(0, 110) 
        : 'مشروع قيد التطوير والتخصيص.',
      updatedAt: new Date(s.updatedAt || s.createdAt).toLocaleDateString('ar-EG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      createdAt: new Date(s.createdAt).toLocaleDateString('ar-EG', {
        day: 'numeric',
        month: 'long'
      }),
      isPinned: Boolean(s.isPinned),
      messageCount: s.messages.length,
    };
  });

  const filteredApps = userApps
    .filter(app => filter === 'all' || (filter === 'pinned' && app.isPinned))
    .filter(app =>
      app.title.toLowerCase().includes(search.toLowerCase()) ||
      app.desc.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="flex-1 overflow-y-auto bg-[#11141d] text-right p-4 sm:p-8 space-y-6">
      {/* Top Header matching Screenshot 2 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">تطبيقاتي الخاصة</h1>
          <p className="text-xs text-[#94a3b8] mt-1">
            جميع المشاريع هنا خاصة بحسابك فقط ومحمية بشكل كامل.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative w-56 sm:w-72">
            <Search className="w-4 h-4 text-[#64748b] absolute right-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في مشاريعك..."
              className="w-full bg-[#181d2a] text-xs text-white pr-9 pl-3 py-2 rounded-xl border border-[#262f44] focus:border-[#3b82f6] focus:outline-none"
            />
          </div>

          {/* Plus Add Button */}
          <button
            onClick={onNewApp}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-md transition-colors"
            title="إنشاء تطبيق جديد"
          >
            <Plus className="w-4 h-4" />
            <span>تطبيق جديد</span>
          </button>

          {/* Grid / List toggle */}
          <div className="flex items-center bg-[#181d2a] p-1 rounded-xl border border-[#262f44]">
            <button
              onClick={() => setIsGridView(false)}
              className={`p-1.5 rounded-lg transition-colors ${!isGridView ? 'bg-[#262f44] text-white' : 'text-[#64748b] hover:text-white'}`}
              title="عرض قائمة"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsGridView(true)}
              className={`p-1.5 rounded-lg transition-colors ${isGridView ? 'bg-[#262f44] text-white' : 'text-[#64748b] hover:text-white'}`}
              title="عرض شبكي"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#181d2a] p-1 rounded-xl border border-[#262f44] text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-[#262f44] text-white font-medium' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              الكل ({userApps.length})
            </button>
            <button
              onClick={() => setFilter('pinned')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filter === 'pinned' ? 'bg-[#262f44] text-white font-medium' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              المثبتة 📌
            </button>
          </div>
        </div>
      </div>

      {/* Applications View */}
      {filteredApps.length === 0 ? (
        <div className="bg-[#181d2a] border border-[#262f44] rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#262f44] flex items-center justify-center mx-auto text-[#60a5fa]">
            <FolderPlus className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">لا توجد تطبيقات حتى الآن</h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            أنشئ تطبيقك الأول أو صف فكرة بوت أو موقع وسيقوم Nexus Studio ببنائه فوراً.
          </p>
          <button
            onClick={onNewApp}
            className="px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md"
          >
            + ابدأ الآن
          </button>
        </div>
      ) : isGridView ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              onClick={() => onOpenSession(app.id)}
              className="bg-[#181d2a] border border-[#262f44] hover:border-[#3b82f6] p-5 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-lg hover:shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${app.color} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                    {app.letter}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePinSession(app.id);
                    }}
                    className={`p-1.5 rounded-lg hover:bg-[#262f44] transition-colors ${
                      app.isPinned ? 'text-[#f59e0b]' : 'text-[#64748b] group-hover:text-[#94a3b8]'
                    }`}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm group-hover:text-[#60a5fa] transition-colors line-clamp-1">
                    {app.title}
                  </h3>
                  <p className="text-xs text-[#94a3b8] line-clamp-2 mt-1 leading-relaxed">
                    {app.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#262f44] flex items-center justify-between text-[11px] text-[#64748b]">
                <span>{app.updatedAt}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(app.id);
                  }}
                  className="p-1 text-[#64748b] hover:text-[#ef4444] transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#181d2a] border border-[#262f44] rounded-2xl overflow-hidden shadow-xl">
          <div className="px-4 py-3 bg-[#1e2434] border-b border-[#262f44] flex items-center justify-between text-xs font-semibold text-[#94a3b8]">
            <span>اسم التطبيق</span>
            <span className="hidden sm:inline">تاريخ التحديث</span>
          </div>

          <div className="divide-y divide-[#262f44]">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => onOpenSession(app.id)}
                className="p-4 hover:bg-[#1e2434] transition-colors cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl ${app.color} text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm`}>
                    {app.letter}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-xs sm:text-sm group-hover:text-[#60a5fa] transition-colors truncate">
                      {app.title}
                    </h3>
                    <p className="text-[11px] text-[#94a3b8] line-clamp-1 mt-0.5">
                      {app.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs text-[#94a3b8]">
                  <div className="hidden sm:flex flex-col items-end text-[11px]">
                    <span className="text-white font-medium">{app.updatedAt}</span>
                    <span className="text-[#64748b] text-[10px]">الإنشاء: {app.createdAt}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePinSession(app.id);
                    }}
                    className={`p-1.5 rounded-lg hover:bg-[#262f44] transition-colors ${
                      app.isPinned ? 'text-[#f59e0b]' : 'text-[#64748b] group-hover:text-[#94a3b8]'
                    }`}
                    title={app.isPinned ? 'مثبت' : 'تثبيت'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(app.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-[#262f44] text-[#64748b] hover:text-[#ef4444] transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 bg-[#1e2434] border-t border-[#262f44] flex items-center justify-between text-xs text-[#94a3b8]">
            <span>عدد تطبيقاتك: {filteredApps.length}</span>
            <span>خاص ومحمي 🔒</span>
          </div>
        </div>
      )}
    </div>
  );
};
