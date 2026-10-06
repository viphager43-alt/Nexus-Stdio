import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Coins, 
  Crown, 
  Key, 
  Plus, 
  Trash2, 
  Check, 
  Copy, 
  Megaphone, 
  Sliders, 
  RefreshCw, 
  Search, 
  Sparkles, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  UserCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { UserProfile, PromoCode, AppSettings, AdminStats } from '../types';
import { 
  getAdminOverview, 
  massAddCredits, 
  massUpgradeVip, 
  adminUpdateUser, 
  createPromoCode, 
  toggleOrDeleteCode, 
  updateSystemSettings 
} from '../services/api';

interface AdminPanelProps {
  onBackToPlayground: () => void;
  onRefreshUserProfile: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToPlayground,
  onRefreshUserProfile,
}) => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<AdminStats>({
    totalUsers: 0,
    totalVipUsers: 0,
    totalCreditsDistributed: 0,
    totalPromptsHandled: 0,
    activePromoCodes: 0,
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    globalAnnouncement: '',
    announcementActive: false,
    defaultCredits: 100,
    unlimitedFreeAccess: true,
    systemName: 'Nexus Studio',
  });

  const [activeTab, setActiveTab] = useState<'users' | 'mass-actions' | 'codes' | 'settings'>('mass-actions');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Mass credits input
  const [massAmount, setMassAmount] = useState('500');

  // Single user modal / state
  const [searchUser, setSearchUser] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [userCreditAmount, setUserCreditAmount] = useState('100');

  // New Code inputs
  const [newCodeName, setNewCodeName] = useState('');
  const [newCodeType, setNewCodeType] = useState<'vip_lifetime' | 'vip_30days' | 'credits'>('vip_lifetime');
  const [newCodeCredits, setNewCodeCredits] = useState('1000');
  const [newCodeMaxUses, setNewCodeMaxUses] = useState('20');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Settings inputs
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementActive, setAnnouncementActive] = useState(false);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const data = await getAdminOverview();
      setMetrics(data.metrics);
      setUsers(data.users);
      setCodes(data.codes);
      setSettings(data.settings);
      setAnnouncementText(data.settings.globalAnnouncement);
      setAnnouncementActive(data.settings.announcementActive);
    } catch (err: any) {
      console.error(err);
      showFeedback('فشل تحميل بيانات لوحة الإدارة', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // 1. Mass Add Credits (إضافة رصيد لجميع المستخدمين دفعة واحدة)
  const handleMassAddCredits = async (amount: number) => {
    try {
      const res = await massAddCredits(amount);
      showFeedback(res.message, 'success');
      setUsers(res.users);
      fetchOverview();
      onRefreshUserProfile();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // 2. Mass Upgrade to VIP (ترقية جميع المستخدمين للنسخة المدفوعة VIP دفعة واحدة)
  const handleMassUpgradeVip = async (status: boolean) => {
    try {
      const res = await massUpgradeVip(status);
      showFeedback(res.message, 'success');
      setUsers(res.users);
      fetchOverview();
      onRefreshUserProfile();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // 3. Single User Update
  const handleSingleUserUpdate = async (userId: string, updates: any) => {
    try {
      const res = await adminUpdateUser({ userId, ...updates });
      showFeedback(res.message, 'success');
      setEditingUser(null);
      fetchOverview();
      onRefreshUserProfile();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // 4. Create Promo / Activation Code
  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createPromoCode({
        code: newCodeName.trim() || undefined,
        type: newCodeType,
        creditsAmount: Number(newCodeCredits) || 0,
        maxUses: Number(newCodeMaxUses) || 1,
      });
      showFeedback(res.message, 'success');
      setNewCodeName('');
      fetchOverview();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // 5. Toggle or Delete Code
  const handleToggleOrDeleteCode = async (codeId: string, deleteAction = false) => {
    try {
      const res = await toggleOrDeleteCode(codeId, deleteAction);
      showFeedback(res.message, 'success');
      fetchOverview();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  // 6. Save Settings & Announcement
  const handleSaveSettings = async () => {
    try {
      const res = await updateSystemSettings({
        globalAnnouncement: announcementText,
        announcementActive,
      });
      showFeedback(res.message, 'success');
      fetchOverview();
    } catch (err: any) {
      showFeedback(err.message, 'error');
    }
  };

  const handleCopyCode = (codeStr: string, id: string) => {
    navigator.clipboard.writeText(codeStr);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.id.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#11141d] p-4 md:p-8 text-right">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with return button */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#262f44] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white">لوحة تحكم المدير العام</h1>
            </div>
            <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
              إدارة الأرصدة الجماعية، ترقية المستخدمين لـ VIP، توليد أكواد التفعيل، وبث الإعلانات العامة للنظام.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOverview}
              className="p-2 rounded-xl bg-[#181d2a] hover:bg-[#262f44] text-[#94a3b8] hover:text-white border border-[#262f44] transition-colors"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onBackToPlayground}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-semibold transition-all shadow-md"
            >
              <span>العودة للاستوديو</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>

        {/* Feedback alert */}
        {feedbackMsg && (
          <div className={`p-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-between transition-all ${
            feedbackMsg.type === 'success'
              ? 'bg-[#1e2e22] text-[#34a853] border-[#34a853]/40'
              : 'bg-[#2e1d1d] text-[#ea4335] border-[#ea4335]/40'
          }`}>
            <span>{feedbackMsg.text}</span>
            <button onClick={() => setFeedbackMsg(null)} className="text-xs px-2 py-0.5 rounded bg-black/20">×</button>
          </div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#1a1b1d] p-4 rounded-2xl border border-[#2d2f31] space-y-1">
            <div className="flex items-center justify-between text-[#9aa0a6] text-xs">
              <span>إجمالي المستخدمين</span>
              <Users className="w-4 h-4 text-[#8ab4f8]" />
            </div>
            <div className="text-2xl font-bold text-white">{metrics.totalUsers}</div>
            <span className="text-[10px] text-[#34a853]">نشطين ومسجلين</span>
          </div>

          <div className="bg-[#1a1b1d] p-4 rounded-2xl border border-[#2d2f31] space-y-1">
            <div className="flex items-center justify-between text-[#9aa0a6] text-xs">
              <span>مستخدمو VIP Pro</span>
              <Crown className="w-4 h-4 text-[#fbbc04]" />
            </div>
            <div className="text-2xl font-bold text-[#fbbc04]">{metrics.totalVipUsers}</div>
            <span className="text-[10px] text-[#fbbc04]">نسخة مدفوعة كاملة</span>
          </div>

          <div className="bg-[#1a1b1d] p-4 rounded-2xl border border-[#2d2f31] space-y-1">
            <div className="flex items-center justify-between text-[#9aa0a6] text-xs">
              <span>الأرصدة الموزعة</span>
              <Coins className="w-4 h-4 text-[#34a853]" />
            </div>
            <div className="text-2xl font-bold text-white">{metrics.totalCreditsDistributed}</div>
            <span className="text-[10px] text-[#8ab4f8]">نقطة ائتمان</span>
          </div>

          <div className="bg-[#1a1b1d] p-4 rounded-2xl border border-[#2d2f31] space-y-1">
            <div className="flex items-center justify-between text-[#9aa0a6] text-xs">
              <span>أكواد التفعيل النشطة</span>
              <Key className="w-4 h-4 text-[#c58af9]" />
            </div>
            <div className="text-2xl font-bold text-white">{metrics.activePromoCodes}</div>
            <span className="text-[10px] text-[#c58af9]">جاهزة للشحن</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-[#1a1b1d] p-1.5 rounded-xl border border-[#2d2f31] overflow-x-auto text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('mass-actions')}
            className={`px-4 py-2 rounded-lg font-medium transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'mass-actions' ? 'bg-[#1a73e8] text-white shadow-sm' : 'text-[#9aa0a6] hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>العمليات الجماعية (شحن للجميع / ترقية VIP)</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'users' ? 'bg-[#1a73e8] text-white shadow-sm' : 'text-[#9aa0a6] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>إدارة المستخدمين ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('codes')}
            className={`px-4 py-2 rounded-lg font-medium transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'codes' ? 'bg-[#1a73e8] text-white shadow-sm' : 'text-[#9aa0a6] hover:text-white'
            }`}
          >
            <Key className="w-4 h-4 text-[#fbbc04]" />
            <span>أكواد التفعيل VIP ({codes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg font-medium transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'settings' ? 'bg-[#1a73e8] text-white shadow-sm' : 'text-[#9aa0a6] hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4 text-[#34a853]" />
            <span>الإعلانات وإعدادات النظام</span>
          </button>
        </div>

        {/* Tab 1: Mass Actions (العمليات الجماعية) */}
        {activeTab === 'mass-actions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mass Add Credits Card */}
            <div className="bg-[#1a1b1d] border border-[#2d2f31] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#34a853]">
                <Coins className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">إضافة أرصدة لجميع المستخدمين دفعة واحدة</h3>
              </div>
              <p className="text-xs text-[#9aa0a6] leading-relaxed">
                هذا الخيار يضيف رصيداً إضافياً فورياً إلى حساب كل مستخدم مسجل في المنصة في نفس اللحظة.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#bdc1c6] mb-2">أزرار سريعة للإضافة:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 500, 1000, 5000].map(val => (
                    <button
                      key={val}
                      onClick={() => handleMassAddCredits(val)}
                      className="py-2 px-3 rounded-lg bg-[#202124] hover:bg-[#34a853]/20 hover:text-[#34a853] hover:border-[#34a853]/40 border border-[#3c4043] text-xs font-bold text-white transition-all"
                    >
                      +{val} رصيد
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#2d2f31]">
                <label className="block text-xs font-semibold text-[#bdc1c6] mb-1.5">أو إدخال رصيد مخصص:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={massAmount}
                    onChange={(e) => setMassAmount(e.target.value)}
                    placeholder="أدخل عدد النقاط..."
                    className="flex-1 bg-[#202124] text-xs text-white px-3 py-2.5 rounded-xl border border-[#3c4043] focus:border-[#34a853] focus:outline-none"
                  />
                  <button
                    onClick={() => handleMassAddCredits(Number(massAmount) || 100)}
                    className="px-5 py-2.5 bg-[#34a853] hover:bg-[#2d9249] text-white text-xs font-bold rounded-xl shadow-md shadow-[#34a853]/20 transition-all"
                  >
                    إضافة للجميع الآن
                  </button>
                </div>
              </div>
            </div>

            {/* Mass VIP Upgrade Card */}
            <div className="bg-[#1a1b1d] border border-[#2d2f31] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#fbbc04]">
                <Crown className="w-5 h-5 fill-[#fbbc04]" />
                <h3 className="font-bold text-white text-base">ترقية جميع المستخدمين للنسخة المدفوعة VIP</h3>
              </div>
              <p className="text-xs text-[#9aa0a6] leading-relaxed">
                منح كافة المستخدمين عضوية VIP الاحترافية بحرية تامة دون أي قيود، مع تفعيل أعلى مستوى استدلال وجودة ردود.
              </p>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => handleMassUpgradeVip(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-yellow-500/20 transition-all cursor-pointer"
                >
                  <Crown className="w-4 h-4 fill-white" />
                  <span>ترقية جميع المستخدمين لـ VIP الآن (دائم)</span>
                </button>

                <button
                  onClick={() => handleMassUpgradeVip(false)}
                  className="w-full py-2 px-3 rounded-xl bg-[#202124] hover:bg-[#282a2c] text-[#ea4335] border border-[#ea4335]/30 text-xs font-medium transition-colors"
                >
                  إلغاء اشتراك VIP الجماعي
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users Management (إدارة المستخدمين) */}
        {activeTab === 'users' && (
          <div className="bg-[#1a1b1d] border border-[#2d2f31] rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-white text-base">قائمة المستخدمين وتعديل الأرصدة الفردية</h3>
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-[#9aa0a6] absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="بحث باسم المستخدم أو البريد..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full bg-[#202124] text-xs text-white pr-9 pl-3 py-2 rounded-xl border border-[#3c4043] focus:border-[#8ab4f8] focus:outline-none"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto border border-[#2d2f31] rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#202124] text-[#9aa0a6] border-b border-[#2d2f31]">
                  <tr>
                    <th className="p-3">المستخدم</th>
                    <th className="p-3">الحالة والنوع</th>
                    <th className="p-3">الرصيد المتاح</th>
                    <th className="p-3">الطلبات المنفذة</th>
                    <th className="p-3 text-center">إجراءات المدير السريعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2d2f31]">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-[#202124]/50 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-[11px] text-[#9aa0a6] font-mono">{user.email}</div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          user.isVip
                            ? 'bg-[#fbbc04]/20 text-[#fbbc04] border border-[#fbbc04]/40'
                            : 'bg-[#1a73e8]/20 text-[#8ab4f8] border border-[#1a73e8]/40'
                        }`}>
                          {user.isVip ? '👑 VIP مدفوع' : 'مجاني غير محدود'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-[#34a853] text-sm">{user.credits}</span>
                        <span className="text-[10px] text-[#9aa0a6] mr-1">نقطة</span>
                      </td>
                      <td className="p-3 text-[#bdc1c6] font-mono">{user.totalPrompts}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Toggle VIP */}
                          <button
                            onClick={() => handleSingleUserUpdate(user.id, { setVip: !user.isVip })}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                              user.isVip
                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20'
                                : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-yellow-500'
                            }`}
                            title="تبديل عضوية VIP"
                          >
                            {user.isVip ? 'إلغاء VIP' : 'ترقية لـ VIP'}
                          </button>

                          {/* Quick Add 500 Credits */}
                          <button
                            onClick={() => handleSingleUserUpdate(user.id, { creditsToAdd: 500 })}
                            className="px-2 py-1 rounded-lg text-[11px] bg-[#34a853]/15 text-[#34a853] border border-[#34a853]/30 hover:bg-[#34a853]/25"
                            title="إضافة 500 رصيد فوراً"
                          >
                            +500 رصيد
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setUserCreditAmount(String(user.credits));
                            }}
                            className="px-2 py-1 rounded-lg text-[11px] bg-[#282a2c] text-[#8ab4f8] hover:text-white border border-[#3c4043]"
                          >
                            تعديل مخصص
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit User Modal */}
            {editingUser && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-[#1e1f20] border border-[#3c4043] rounded-2xl p-6 max-w-md w-full space-y-4 text-right">
                  <h3 className="font-bold text-white text-base">تعديل بيانات المستخدم: {editingUser.name}</h3>

                  <div>
                    <label className="block text-xs text-[#bdc1c6] mb-1">الرصيد المباشر:</label>
                    <input
                      type="number"
                      value={userCreditAmount}
                      onChange={(e) => setUserCreditAmount(e.target.value)}
                      className="w-full bg-[#131314] text-xs text-white p-2.5 rounded-lg border border-[#3c4043]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        handleSingleUserUpdate(editingUser.id, {
                          setCreditsDirect: Number(userCreditAmount) || 0,
                        });
                      }}
                      className="px-5 py-2 bg-[#1a73e8] hover:bg-[#1b66c9] text-white text-xs font-bold rounded-lg"
                    >
                      حفظ التغييرات
                    </button>
                    <button
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 bg-[#282a2c] text-[#9aa0a6] hover:text-white text-xs rounded-lg"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Activation Codes Manager (أكواد التفعيل) */}
        {activeTab === 'codes' && (
          <div className="space-y-6">
            {/* Create Code Form */}
            <div className="bg-[#1a1b1d] border border-[#2d2f31] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#fbbc04]">
                <Key className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">إنشاء كود تفعيل جديد للمستخدمين (VIP أو أرصدة)</h3>
              </div>
              <p className="text-xs text-[#9aa0a6]">
                يمكنك إنشاء أكواد حصرية ومشاركتها مع المستخدمين ليشحنوها في حساباتهم ويحصلوا على ترقية VIP أو رصيد فوري.
              </p>

              <form onSubmit={handleCreateCode} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#bdc1c6] mb-1">رمز الكود (اختياري أو اتركه تلقائي):</label>
                  <input
                    type="text"
                    value={newCodeName}
                    onChange={(e) => setNewCodeName(e.target.value.toUpperCase())}
                    placeholder="مثال: VIP-SPECIAL-2026"
                    className="w-full bg-[#202124] text-xs font-mono text-white px-3 py-2.5 rounded-xl border border-[#3c4043] focus:border-[#8ab4f8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#bdc1c6] mb-1">نوع الكود:</label>
                  <select
                    value={newCodeType}
                    onChange={(e) => setNewCodeType(e.target.value as any)}
                    className="w-full bg-[#202124] text-xs text-white px-3 py-2.5 rounded-xl border border-[#3c4043] focus:border-[#8ab4f8] focus:outline-none"
                  >
                    <option value="vip_lifetime">👑 ترقية VIP مدى الحياة (كامل الصلاحيات)</option>
                    <option value="vip_30days">🌟 ترقية VIP لمدة 30 يوماً</option>
                    <option value="credits">🪙 رصيد نقاط فقط</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#bdc1c6] mb-1">مقدار الرصيد الممنوح:</label>
                  <input
                    type="number"
                    value={newCodeCredits}
                    onChange={(e) => setNewCodeCredits(e.target.value)}
                    className="w-full bg-[#202124] text-xs text-white px-3 py-2.5 rounded-xl border border-[#3c4043] focus:border-[#8ab4f8] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#bdc1c6] mb-1">الحد الأقصى للمستخدمين:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newCodeMaxUses}
                      onChange={(e) => setNewCodeMaxUses(e.target.value)}
                      className="w-full bg-[#202124] text-xs text-white px-3 py-2.5 rounded-xl border border-[#3c4043] focus:border-[#8ab4f8] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#fbbc04] hover:bg-[#e2a800] text-black text-xs font-bold rounded-xl whitespace-nowrap shadow-sm transition-all"
                    >
                      + إنشاء
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Codes List */}
            <div className="bg-[#1a1b1d] border border-[#2d2f31] rounded-2xl p-4 sm:p-6 space-y-4">
              <h3 className="font-bold text-white text-base">الأكواد المنشأة حالياً</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {codes.map((c) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                      c.active
                        ? 'bg-[#202124] border-[#3c4043]'
                        : 'bg-[#18191a] border-[#2d2f31] opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#fbbc04]">{c.code}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          c.type.startsWith('vip') ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {c.type === 'vip_lifetime' ? 'VIP دائم' : c.type === 'vip_30days' ? 'VIP شهر' : 'أرصدة'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#9aa0a6] mt-1 space-x-3 space-x-reverse">
                        <span>الرصيد: +{c.creditsAmount}</span>
                        <span>• الاستخدام: {c.usedCount} من {c.maxUses}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyCode(c.code, c.id)}
                        className="p-1.5 rounded-lg bg-[#282a2c] text-[#8ab4f8] hover:text-white"
                        title="نسخ الكود"
                      >
                        {copiedCodeId === c.id ? <Check className="w-4 h-4 text-[#34a853]" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleToggleOrDeleteCode(c.id, false)}
                        className={`p-1.5 rounded-lg text-xs font-medium ${
                          c.active ? 'text-[#34a853] hover:text-[#ea4335]' : 'text-[#ea4335] hover:text-[#34a853]'
                        }`}
                        title={c.active ? 'تعطيل الكود' : 'تفعيل الكود'}
                      >
                        {c.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={() => handleToggleOrDeleteCode(c.id, true)}
                        className="p-1.5 rounded-lg text-[#9aa0a6] hover:text-[#ea4335] hover:bg-[#282a2c]"
                        title="حذف الكود نهائياً"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: System Announcements & Settings */}
        {activeTab === 'settings' && (
          <div className="bg-[#1a1b1d] border border-[#2d2f31] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#34a853]">
              <Megaphone className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">إعلان النظام العام للمستخدمين</h3>
            </div>
            <p className="text-xs text-[#9aa0a6]">
              اكتب إعلاناً أو رسالة تظهر كشريط في أعلى الشاشة لجميع المستخدمين عند فتح الموقع.
            </p>

            <div className="space-y-3">
              <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                rows={3}
                placeholder="مثال: 🎉 تم فتح النسخة المدفوعة VIP لجميع المستخدمين مجاناً بمناسبة التحديث الجديد!"
                className="w-full bg-[#202124] text-xs sm:text-sm text-white p-3 rounded-xl border border-[#3c4043] focus:border-[#34a853] focus:outline-none"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcementActive}
                    onChange={(e) => setAnnouncementActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#34a853] focus:ring-0"
                  />
                  <span>تفعيل ظهور شريط الإعلان لجميع المستخدمين الآن</span>
                </label>

                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 bg-[#34a853] hover:bg-[#2d9249] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#34a853]/20"
                >
                  حفظ ونشر الإعلان
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
