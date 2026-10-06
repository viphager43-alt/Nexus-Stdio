import React from 'react';
import { 
  Plus, 
  LayoutGrid, 
  Image as GalleryIcon, 
  FileText, 
  History, 
  HelpCircle, 
  Search, 
  Bell, 
  Settings, 
  Key, 
  X,
  ChevronLeft,
  Sparkles,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: 'new-app' | 'apps' | 'workspace' | 'gallery' | 'admin' | 'docs';
  onChangeView: (view: 'new-app' | 'apps' | 'workspace' | 'gallery' | 'admin' | 'docs') => void;
  onOpenRedeem: () => void;
  onOpenAdminSecret: () => void;
  onOpenHistory: () => void;
  currentUser: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeView,
  onChangeView,
  onOpenRedeem,
  onOpenAdminSecret,
  onOpenHistory,
  currentUser,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 right-0 z-40
        w-64 bg-[#161a26] border-l border-[#232838] flex flex-col justify-between
        transition-transform duration-300 ease-in-out select-none
        ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-64'}
      `}>
        {/* Top Header & Brand */}
        <div className="p-3 border-b border-[#232838]">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => { onChangeView('new-app'); if (window.innerWidth < 768) onClose(); }}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2563eb] via-[#60a5fa] to-[#818cf8] flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-[15px] tracking-tight">Nexus Studio</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-[#2563eb]/20 text-[#60a5fa] border border-[#2563eb]/30">
                  Pro
                </span>
              </div>
            </div>

            <button onClick={onClose} className="p-1 text-[#94a3b8] hover:text-white md:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Sections matching Screenshot 1 & 2 */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-5 text-xs">
          {/* قسم: يستكشف */}
          <div className="space-y-1">
            <span className="px-3 text-[11px] font-semibold text-[#64748b] block text-right">يستكشف</span>
            
            <button
              onClick={() => { onChangeView('workspace'); if (window.innerWidth < 768) onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-right font-medium transition-colors ${
                activeView === 'workspace'
                  ? 'bg-[#232838] text-white shadow-xs'
                  : 'text-[#94a3b8] hover:bg-[#1c2130] hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-[#64748b]" />
              <span>ملعب (Playground)</span>
            </button>

            <button
              onClick={() => { onOpenHistory(); if (window.innerWidth < 768) onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-right font-medium text-[#94a3b8] hover:bg-[#1c2130] hover:text-white transition-colors"
            >
              <History className="w-4 h-4 text-[#64748b]" />
              <span>تاريخ (History)</span>
            </button>
          </div>

          {/* قسم: يبني */}
          <div className="space-y-1">
            <span className="px-3 text-[11px] font-semibold text-[#64748b] block text-right">يبني</span>

            <button
              onClick={() => { onChangeView('new-app'); if (window.innerWidth < 768) onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-right font-medium transition-colors ${
                activeView === 'new-app'
                  ? 'bg-[#232838] text-white font-semibold shadow-xs'
                  : 'text-[#94a3b8] hover:bg-[#1c2130] hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4 text-[#60a5fa]" />
              <span>تطبيق جديد</span>
            </button>

            <button
              onClick={() => { onChangeView('apps'); if (window.innerWidth < 768) onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-right font-medium transition-colors ${
                activeView === 'apps'
                  ? 'bg-[#232838] text-white font-semibold shadow-xs'
                  : 'text-[#94a3b8] hover:bg-[#1c2130] hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-[#64748b]" />
              <span>تطبيقاتي</span>
            </button>

            <button
              onClick={() => { onChangeView('gallery'); if (window.innerWidth < 768) onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-right font-medium transition-colors ${
                activeView === 'gallery'
                  ? 'bg-[#232838] text-white font-semibold shadow-xs'
                  : 'text-[#94a3b8] hover:bg-[#1c2130] hover:text-white'
              }`}
            >
              <GalleryIcon className="w-4 h-4 text-[#64748b]" />
              <span>معرض</span>
            </button>
          </div>

          {/* قسم: يدير (Clean without public admin panel) */}
          <div className="space-y-1">
            <span className="px-3 text-[11px] font-semibold text-[#64748b] block text-right">يدير</span>

            <button
              onClick={() => { onChangeView('docs'); if (window.innerWidth < 768) onClose(); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-right font-medium transition-colors ${
                activeView === 'docs'
                  ? 'bg-[#232838] text-white font-semibold shadow-xs'
                  : 'text-[#94a3b8] hover:bg-[#1c2130] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#64748b]" />
                <span>الوثائق (Docs)</span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-[#475569]" />
            </button>

            <button
              onClick={onOpenRedeem}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-right font-medium text-[#94a3b8] hover:bg-[#1c2130] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-[#f59e0b]" />
                <span>شحن كود التفعيل</span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 text-[#475569]" />
            </button>
          </div>
        </div>

        {/* Bottom Section matching Screenshot 1 & 2 */}
        <div className="p-3 border-t border-[#232838] bg-[#12151e] space-y-3">
          {/* Upgrade to VIP Card */}
          <div 
            onClick={onOpenRedeem}
            className="p-3 rounded-2xl bg-[#1c2130] border border-[#283046] hover:border-[#3b82f6] transition-all cursor-pointer text-right space-y-1 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">قم بالترقية لفتح المزيد</span>
              {currentUser.isVip ? (
                <span className="text-[10px] text-[#f59e0b] font-semibold">VIP مفعل</span>
              ) : (
                <span className="text-[10px] text-[#10b981] font-semibold">غير محدود 24/7</span>
              )}
            </div>
            <p className="text-[10px] text-[#94a3b8] leading-relaxed">
              يمكنك الوصول إلى حدود أعلى، ونماذج احترافية، والمزيد.
            </p>
          </div>

          {/* Quick Icon Actions (Bell, Settings, Search, Key) */}
          <div className="flex items-center justify-around text-[#64748b] pt-1">
            <button 
              onClick={onOpenRedeem} 
              className="p-1.5 rounded-lg hover:text-white hover:bg-[#1c2130] transition-colors"
              title="كود التفعيل"
            >
              <Key className="w-4 h-4 text-[#f59e0b]" />
            </button>
            <button 
              onClick={onOpenHistory} 
              className="p-1.5 rounded-lg hover:text-white hover:bg-[#1c2130] transition-colors"
              title="البحث في المشاريع"
            >
              <Search className="w-4 h-4" />
            </button>
            <button 
              onClick={onOpenAdminSecret} 
              className="p-1.5 rounded-lg hover:text-white hover:bg-[#1c2130] transition-colors"
              title="الإعدادات والأمان"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button 
              className="p-1.5 rounded-lg hover:text-white hover:bg-[#1c2130] transition-colors"
              title="الإشعارات"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile Pill matching Screenshot 1 */}
          <div className="pt-2 border-t border-[#232838] flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                H
              </div>
              <span className="text-xs text-[#94a3b8] truncate font-mono">
                {currentUser.email || 'viphager43@gmail.com'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
