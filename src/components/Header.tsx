import React, { useState } from 'react';
import { 
  Sparkles, 
  Share2, 
  Crown, 
  Key, 
  Coins, 
  Menu, 
  Check, 
  RotateCw, 
  Upload, 
  Settings, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentTitle: string;
  onUpdateTitle: (title: string) => void;
  currentUser: UserProfile;
  onOpenGetCode: () => void;
  onOpenRedeem: () => void;
  onOpenAdminSecret: () => void;
  onToggleSidebar: () => void;
  onBackToStart: () => void;
  onRemix?: () => void;
  isWorkspaceView: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTitle,
  onUpdateTitle,
  currentUser,
  onOpenGetCode,
  onOpenRedeem,
  onOpenAdminSecret,
  onToggleSidebar,
  onBackToStart,
  onRemix,
  isWorkspaceView,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(currentTitle);
  const [copiedShare, setCopiedShare] = useState(false);
  const [published, setPublished] = useState(false);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handlePublish = () => {
    setPublished(true);
    setTimeout(() => setPublished(false), 2500);
  };

  return (
    <header className="h-14 border-b border-[#232838] bg-[#161a26] px-3 md:px-5 flex items-center justify-between z-30 select-none">
      {/* Left side: Back to start (Screenshot 3) OR Logo + Sidebar toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1c2130] transition-colors"
          title="القائمة الجانبية"
        >
          <Menu className="w-5 h-5" />
        </button>

        {isWorkspaceView ? (
          <button
            onClick={onBackToStart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c2130] hover:bg-[#242a3d] text-xs font-semibold text-white border border-[#283046] transition-colors shadow-xs"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للرئيسية (Back to start)</span>
          </button>
        ) : (
          <div 
            onClick={onBackToStart}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2563eb] via-[#60a5fa] to-[#818cf8] flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-[15px] tracking-tight">Nexus Studio</span>
          </div>
        )}

        <span className="text-[#283046] hidden md:inline">|</span>

        {/* Project Title matching Screenshot 3: Nexus Studio Pro */}
        <div className="flex items-center">
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex items-center">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                autoFocus
                className="bg-[#1c2130] text-xs sm:text-sm text-white px-2.5 py-1 rounded-lg border border-[#3b82f6] focus:outline-none w-44 font-bold"
              />
            </form>
          ) : (
            <button
              onClick={() => {
                setTitleInput(currentTitle);
                setIsEditingTitle(true);
              }}
              className="text-xs sm:text-sm text-[#f1f5f9] hover:text-[#60a5fa] font-bold max-w-[150px] sm:max-w-[240px] truncate px-2 py-1 rounded hover:bg-[#1c2130] transition-colors text-right tracking-tight"
              title="انقر لتعديل عنوان المشروع"
            >
              {currentTitle || 'Nexus Studio Pro'}
            </button>
          )}
        </div>
      </div>

      {/* Right side: Actions matching Screenshot 3 (Remix, Share, Publish, VIP status) */}
      <div className="flex items-center gap-2">
        {isWorkspaceView && (
          <>
            {/* Remix Button (Screenshot 3) */}
            <button
              onClick={onRemix}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1c2130] hover:bg-[#242a3d] text-[#60a5fa] border border-[#283046] transition-colors shadow-xs"
              title="إعادة مزج وتطوير المشروع"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Remix</span>
            </button>

            {/* Share Button (Screenshot 3) */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1c2130] hover:bg-[#242a3d] text-white border border-[#283046] transition-colors shadow-xs"
              title="مشاركة المشروع"
            >
              {copiedShare ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedShare ? 'تم النسخ' : 'Share'}</span>
            </button>

            {/* Publish Button (Screenshot 3) */}
            <button
              onClick={handlePublish}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-md transition-colors"
              title="نشر التطبيق"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{published ? 'تم النشر بنجاح!' : 'Publish'}</span>
            </button>
          </>
        )}

        {/* VIP Status Pill */}
        <div
          onClick={onOpenRedeem}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs cursor-pointer transition-all ${
            currentUser.isVip
              ? 'bg-[#2a2215] border-[#f59e0b]/40 text-[#f59e0b] hover:border-[#f59e0b]'
              : 'bg-[#1c2130] border-[#283046] text-[#94a3b8] hover:border-[#3b82f6]'
          }`}
          title="شحن كود التفعيل والترقية لـ VIP"
        >
          {currentUser.isVip ? (
            <>
              <Crown className="w-3.5 h-3.5 fill-[#f59e0b]" />
              <span className="font-semibold">VIP دائم</span>
            </>
          ) : (
            <>
              <Coins className="w-3.5 h-3.5 text-[#60a5fa]" />
              <span className="hidden sm:inline">رصيد: {currentUser.credits}</span>
              <span className="text-[10px] text-[#10b981] bg-[#10b981]/15 px-1 rounded font-medium">غير محدود</span>
            </>
          )}
        </div>

        {/* Secret Admin trigger - discrete settings icon with secret shortcut */}
        <button
          onClick={onOpenAdminSecret}
          className="p-2 rounded-xl text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1c2130] transition-colors"
          title="الإعدادات"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Avatar badge */}
        <div 
          onClick={onOpenRedeem}
          className="w-7 h-7 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow-sm hover:ring-2 hover:ring-[#3b82f6]/40 transition-all"
          title="حسابك - انقر لتفعيل كود VIP"
        >
          H
        </div>
      </div>
    </header>
  );
};
