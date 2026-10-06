import { FileArtifact, UserProfile, PromoCode, AppSettings, AdminStats } from '../types';

export function extractArtifactsFromText(text: string): FileArtifact[] {
  const artifacts: FileArtifact[] = [];

  // 1. Detect HTML / Website blocks
  const htmlRegex = /```html\s*([\s\S]*?)```/gi;
  let htmlMatch;
  while ((htmlMatch = htmlRegex.exec(text)) !== null) {
    const code = htmlMatch[1].trim();
    if (code.includes('<!DOCTYPE') || code.includes('<html') || code.includes('<body') || code.includes('<div') || code.includes('<style')) {
      artifacts.push({
        fileName: 'index.html',
        fileType: 'html',
        category: 'website',
        title: 'صفحة الويب التفاعلية (Web Application)',
        code,
        runnable: true,
        instructions: 'يمكنك تشغيل هذا الكود مباشرة داخل اللوحة التفاعلية أو تحميل الملف وفتحه في أي متصفح.',
      });
    }
  }

  // 2. Detect Python / Bot blocks
  const pyRegex = /```(?:python|py)\s*([\s\S]*?)```/gi;
  let pyMatch;
  while ((pyMatch = pyRegex.exec(text)) !== null) {
    const code = pyMatch[1].trim();
    const isBot = code.toLowerCase().includes('bot') || code.toLowerCase().includes('telegram') || code.toLowerCase().includes('discord') || code.toLowerCase().includes('client');
    artifacts.push({
      fileName: isBot ? 'bot.py' : 'script.py',
      fileType: 'python',
      category: isBot ? 'bot' : 'script',
      title: isBot ? 'كود البوت البرمجي (Telegram / Discord Bot)' : 'سكريبت بايثون التنفيذي',
      code,
      runnable: isBot,
      instructions: 'قم بتثبيت المتطلبات عبر: pip install python-telegram-bot أو discord.py ثم شغل الملف: python bot.py',
    });
  }

  // 3. Detect JavaScript / Node.js blocks
  const jsRegex = /```(?:javascript|js|typescript|ts)\s*([\s\S]*?)```/gi;
  let jsMatch;
  while ((jsMatch = jsRegex.exec(text)) !== null) {
    const code = jsMatch[1].trim();
    const isBot = code.toLowerCase().includes('bot') || code.toLowerCase().includes('telegraf') || code.toLowerCase().includes('discord.js');
    artifacts.push({
      fileName: isBot ? 'bot.js' : 'app.js',
      fileType: 'javascript',
      category: isBot ? 'bot' : 'app',
      title: isBot ? 'كود بوت نود جي اس (Node.js Bot)' : 'ملف جافاسكريبت التطبيقي',
      code,
      runnable: isBot,
      instructions: 'قم بتثبيت الحزم عبر npm install ثم شغل الملف عبر: node bot.js',
    });
  }

  // 4. Detect Flutter / Dart blocks
  const dartRegex = /```(?:dart|flutter)\s*([\s\S]*?)```/gi;
  let dartMatch;
  while ((dartMatch = dartRegex.exec(text)) !== null) {
    const code = dartMatch[1].trim();
    artifacts.push({
      fileName: 'main.dart',
      fileType: 'dart',
      category: 'app',
      title: 'كود تطبيق الهاتف (Flutter Mobile App)',
      code,
      runnable: false,
      instructions: 'ضعه داخل lib/main.dart في مشروع فلاتر جديد، وشغل الأمر: flutter run أو flutter build apk',
      buildRoadmap: {
        techStack: ['Flutter SDK 3.x', 'Dart', 'Android Studio / VS Code'],
        prerequisites: ['تثبيت Flutter SDK', 'إعداد Java JDK 17', 'Android SDK Command-line Tools'],
        steps: [
          'أنشئ مشروعاً جديداً عبر: flutter create my_app',
          'استبدل محتوى ملف lib/main.dart بالكود المرفق',
          'ثبت الحزم عبر: flutter pub get',
          'قم بتشغيل المحاكي عبر: flutter run',
        ],
        buildCommands: [
          'flutter build apk --release (لبناء ملف تثبيت أندرويد APK)',
          'flutter build appbundle (للنشر على متجر Google Play)',
        ],
      },
    });
  }

  return artifacts;
}

export async function generateAiResponse(params: {
  prompt?: string;
  messages?: any[];
  systemInstruction?: string;
  model?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  userId?: string;
  isVipRequested?: boolean;
}): Promise<{
  reply: string;
  model: string;
  isVip: boolean;
  remainingCredits: number;
  artifacts: FileArtifact[];
}> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: 'فشل الاتصال بالخادم.' }));
    throw new Error(errData.error || `خطأ في الخادم (${res.status})`);
  }

  const data = await res.json();
  const artifacts = extractArtifactsFromText(data.reply);

  return {
    reply: data.reply,
    model: data.model,
    isVip: data.isVip,
    remainingCredits: data.remainingCredits,
    artifacts,
  };
}

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const res = await fetch(`/api/user/${userId}`);
  if (!res.ok) throw new Error('فشل جلب بيانات المستخدم');
  const data = await res.json();
  return data.user;
}

export async function redeemCode(userId: string, code: string): Promise<{
  success: boolean;
  message: string;
  user: UserProfile;
}> {
  const res = await fetch('/api/user/redeem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, code }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'فشل تفعيل الكود.');
  }

  return data;
}

export async function getAdminOverview(): Promise<{
  metrics: AdminStats;
  users: UserProfile[];
  codes: PromoCode[];
  settings: AppSettings;
}> {
  const res = await fetch('/api/admin/overview');
  if (!res.ok) throw new Error('فشل جلب لوحة الأدمن');
  return res.json();
}

export async function massAddCredits(amount: number): Promise<{
  success: boolean;
  message: string;
  affectedCount: number;
  users: UserProfile[];
}> {
  const res = await fetch('/api/admin/mass-credits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'فشل إضافة الرصيد الجماعي.');
  return data;
}

export async function massUpgradeVip(status: boolean): Promise<{
  success: boolean;
  message: string;
  users: UserProfile[];
}> {
  const res = await fetch('/api/admin/mass-vip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'فشل الترقية الجماعية.');
  return data;
}

export async function adminUpdateUser(payload: {
  userId: string;
  creditsToAdd?: number;
  setCreditsDirect?: number;
  setVip?: boolean;
  newName?: string;
  status?: 'active' | 'suspended';
}): Promise<{
  success: boolean;
  message: string;
  user: UserProfile;
}> {
  const res = await fetch('/api/admin/user-update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'فشل تعديل بيانات المستخدم.');
  return data;
}

export async function createPromoCode(payload: {
  code?: string;
  type?: 'vip_lifetime' | 'vip_30days' | 'credits';
  creditsAmount?: number;
  maxUses?: number;
}): Promise<{
  success: boolean;
  message: string;
  code: PromoCode;
}> {
  const res = await fetch('/api/admin/create-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'فشل إنشاء كود التفعيل.');
  return data;
}

export async function toggleOrDeleteCode(codeId: string, deleteAction = false): Promise<any> {
  const res = await fetch('/api/admin/toggle-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codeId, deleteAction }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'فشل معالجة الكود.');
  return data;
}

export async function updateSystemSettings(settings: Partial<AppSettings>): Promise<any> {
  const res = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'فشل حفظ الإعدادات.');
  return data;
}
