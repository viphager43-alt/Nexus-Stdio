import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Database file persistence
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

interface UserRecord {
  id: string;
  name: string;
  email: string;
  credits: number;
  isVip: boolean;
  vipExpiresAt?: string | null;
  totalPrompts: number;
  lastActive: string;
  createdAt: string;
  notes?: string;
  status: 'active' | 'suspended';
}

interface PromoCode {
  id: string;
  code: string;
  type: 'vip_lifetime' | 'vip_30days' | 'credits';
  creditsAmount: number;
  maxUses: number;
  usedCount: number;
  usedBy: string[];
  createdAt: string;
  expiresAt?: string | null;
  active: boolean;
}

interface AppSettings {
  globalAnnouncement: string;
  announcementActive: boolean;
  defaultCredits: number;
  unlimitedFreeAccess: boolean;
  systemName: string;
}

interface DatabaseState {
  users: Record<string, UserRecord>;
  codes: PromoCode[];
  settings: AppSettings;
}

// Initial seed
const defaultDb: DatabaseState = {
  users: {
    'user-default': {
      id: 'user-default',
      name: 'viphager43',
      email: 'viphager43@gmail.com',
      credits: 100,
      isVip: false,
      vipExpiresAt: null,
      totalPrompts: 12,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'active',
    },
    'user-vip': {
      id: 'user-vip',
      name: 'مستخدم بريميوم (VIP Pro)',
      email: 'vip@ai-studio.pro',
      credits: 9999,
      isVip: true,
      vipExpiresAt: null,
      totalPrompts: 45,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'active',
    },
    'user-admin': {
      id: 'user-admin',
      name: 'المدير العام (System Admin)',
      email: 'admin@ai-studio.pro',
      credits: 99999,
      isVip: true,
      vipExpiresAt: null,
      totalPrompts: 80,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'active',
    },
  },
  codes: [
    {
      id: 'code-1',
      code: 'VIP-PRO-UNLIMITED',
      type: 'vip_lifetime',
      creditsAmount: 5000,
      maxUses: 100,
      usedCount: 3,
      usedBy: ['user-vip'],
      createdAt: new Date().toISOString(),
      active: true,
    },
    {
      id: 'code-2',
      code: 'FREE-500-CREDITS',
      type: 'credits',
      creditsAmount: 500,
      maxUses: 50,
      usedCount: 5,
      usedBy: [],
      createdAt: new Date().toISOString(),
      active: true,
    },
    {
      id: 'code-3',
      code: 'VIP-GOLDEN-PASS',
      type: 'vip_30days',
      creditsAmount: 2000,
      maxUses: 20,
      usedCount: 0,
      usedBy: [],
      createdAt: new Date().toISOString(),
      active: true,
    },
  ],
  settings: {
    globalAnnouncement: 'مرحباً بك في استوديو الذكاء الاصطناعي الاحترافي غير المحدود! يعمل بكامل طاقته 24/7 دون قيود يومية.',
    announcementActive: true,
    defaultCredits: 100,
    unlimitedFreeAccess: true,
    systemName: 'AI Studio Arabic Pro',
  },
};

function loadDatabase(): DatabaseState {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return { ...defaultDb, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Failed to read database file, using defaults', err);
  }
  return defaultDb;
}

let db = loadDatabase();

function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database file', err);
  }
}

// Ensure default user exists
function ensureUser(userId: string, name?: string): UserRecord {
  if (!db.users[userId]) {
    db.users[userId] = {
      id: userId,
      name: name || (userId === 'user-default' ? 'viphager43' : `مستخدم ${userId.slice(0, 6)}`),
      email: userId === 'user-default' ? 'viphager43@gmail.com' : `${userId}@ai-studio.pro`,
      credits: db.settings.defaultCredits,
      isVip: false,
      vipExpiresAt: null,
      totalPrompts: 0,
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    saveDatabase();
  }
  return db.users[userId];
}

// ----------------- API ROUTES -----------------

// Status check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(apiKey),
    usersCount: Object.keys(db.users).length,
    activeCodes: db.codes.filter(c => c.active).length,
  });
});

// App settings & announcement
app.get('/api/settings', (req, res) => {
  res.json({
    settings: db.settings,
    serverTime: new Date().toISOString(),
  });
});

// Get user profile
app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params;
  const user = ensureUser(userId);
  res.json({ user });
});

// Redeem code
app.post('/api/user/redeem', (req, res) => {
  const { userId, code } = req.body;
  if (!userId || !code) {
    return res.status(400).json({ error: 'يرجى تقديم معرّف المستخدم والكود.' });
  }

  const cleanCode = String(code).trim().toUpperCase();
  const promo = db.codes.find(c => c.code.toUpperCase() === cleanCode && c.active);

  if (!promo) {
    return res.status(404).json({ error: 'كود التفعيل غير صحيح أو تم إيقافه.' });
  }

  if (promo.usedCount >= promo.maxUses) {
    return res.status(400).json({ error: 'لقد وصل هذا الكود إلى الحد الأقصى من مرات الاستخدام.' });
  }

  if (promo.usedBy.includes(userId)) {
    return res.status(400).json({ error: 'لقد قمت باستخدام هذا الكود مسبقاً في حسابك.' });
  }

  const user = ensureUser(userId);

  // Apply code perks
  if (promo.type === 'vip_lifetime') {
    user.isVip = true;
    user.vipExpiresAt = null;
    user.credits += promo.creditsAmount || 2000;
  } else if (promo.type === 'vip_30days') {
    user.isVip = true;
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    user.vipExpiresAt = expires.toISOString();
    user.credits += promo.creditsAmount || 1000;
  } else if (promo.type === 'credits') {
    user.credits += promo.creditsAmount;
  }

  promo.usedCount += 1;
  promo.usedBy.push(userId);
  user.lastActive = new Date().toISOString();

  saveDatabase();

  res.json({
    success: true,
    message: promo.type.startsWith('vip')
      ? '🎉 تهانينا! تم تفعيل اشتراك VIP البريميوم بنجاح بحرية تامة وبدون قيود.'
      : `🎉 تم شحن رصيدك بنجاح بمقدار ${promo.creditsAmount} نقطة!`,
    user,
    appliedPerk: promo.type,
  });
});

// Chat / AI Generation Endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const {
      prompt,
      messages,
      systemInstruction = '',
      model = 'gemini-3.8-flash',
      temperature = 0.7,
      topP = 0.95,
      topK = 40,
      userId = 'user-default',
      isVipRequested = false,
      isBotOrAppIdea = false,
    } = req.body;

    const user = ensureUser(userId);
    const isVip = Boolean(user.isVip || isVipRequested);

    // Free vs VIP behavioral differences:
    // Both run 24/7 without daily lockouts.
    // VIP has zero rate-limits, higher reasoning depth, complete production file formatting, interactive sandboxing.
    // Free has standard prompt, helpful response, polite upgrade note.

    let fullSystemInstruction = systemInstruction;

    // Structured Prompting for Bot, Website, and Application Generation
    const artifactGuidelines = `
أنت تعمل كمحرك الاستوديو الذكي الفائق (الإصدار الاحترافي).
الموقع يعمل بدون أي قيود، مع دعم كامل للغة العربية والإنجليزية.

قواعد مهمة جداً عند طلب (بوت أو موقع أو تطبيق):
1. إذا طلب المستخدم فكرة أو كود [موقع ويب / صفحة / واجهة / أداة تفاعلية]:
   - قدم شرحاً موجزاً ورائعاً للفكرة.
   - اكتب الكود في صيغة ملف تنفيذي كامل ومتكامل (Single-file HTML/CSS/JS أو Component)، يبدأ بـ:
     \`\`\`html
     <!DOCTYPE html>
     ... كود كامل يعمل مباشرة ...
     \`\`\`
   - اجعل الواجهة التفاعلية واضحة وجذابة جداً، ليمكن تشغيلها مباشرة في لوحة المعاينة التفاعلية داخل الاستوديو.

2. إذا طلب المستخدم فكرة أو كود [بوت - مثل بوت تيليجرام / ديسكورد / واتساب]:
   - حدد اسم الملف المقترح (مثال: bot.py أو index.js).
   - اعرض الكود البرمجي الكامل للبوت تحت عنوان الملف داخل بلوك كود منسق:
     \`\`\`python
     # bot.py
     ... الكود الكامل للبوت ...
     \`\`\`
   - اذكر ملف المتطلبات (requirements.txt أو package.json) وأوامر التثبيت والتشغيل.
   - وفر محاكاة تفاعلية لاختبار ردود البوت وطريقة تفاعله!

3. إذا طلب المستخدم فكرة أو بناء [تطبيق موبايل أو ديسك توب أو Fullstack]:
   - اشرح له خطوة بخطوة وبالتفصيل كيف ينشئه من الصفر حتى استخراجه كملف APK أو نسخة نهائية:
     أ) التقنيات المقترحة (Flutter / React Native / Electron).
     ب) المتطلبات المسبقة وتجهيز بيئة العمل (Node.js, Flutter SDK, Android Studio).
     ج) هيكل مجلدات المشروع (Project Folder Structure).
     د) الأكواد البرمجية للملفات الأساسية مع أسماء كل ملف بشكل منظم داخل بلوكات الكود.
     هـ) أوامر البناء والتصدير (مثل flutter build apk أو npm run build).
`;

    if (isVip) {
      fullSystemInstruction = `${artifactGuidelines}\n\n[وضع VIP البريميوم النشط]: قدم الإجابة بأعلى درجات الاحترافية، تفاصيل برمجية عميقة بدون أي اختصار، وأفضل الممارسات التقنية والأمنية، بدون أي علامات مائية.\n\n${systemInstruction || ''}`;
    } else {
      fullSystemInstruction = `${artifactGuidelines}\n\n[الوضع المجاني]: إجابة واضحة ومباشرة ومفيدة دون أي حجب، مع الإشارة في النهاية إلى أن الترقية إلى VIP عبر كود التفعيل توفر تحليلاً معمارياً متقدماً وأكواد جاهزة للإنتاج الفوري.\n\n${systemInstruction || ''}`;
    }

    // Prepare contents
    let contents: any[] = [];
    if (Array.isArray(messages) && messages.length > 0) {
      contents = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text || m.content || '' }],
      }));
    } else if (prompt) {
      contents = [{ role: 'user', parts: [{ text: String(prompt) }] }];
    } else {
      return res.status(400).json({ error: 'يرجى إرسال رسالة أو نص للبدء.' });
    }

    // Model selection: gemini-3.8-flash is the primary fast text & code model
    const targetModel = 'gemini-3.8-flash';
    let replyText = '';

    try {
      const response = await ai.models.generateContent({
        model: targetModel,
        contents,
        config: {
          systemInstruction: fullSystemInstruction,
          temperature: Math.min(Math.max(Number(temperature) || 0.7, 0), 2),
          topP: Number(topP) || 0.95,
          topK: Number(topK) || 40,
        },
      });
      replyText = response.text || '';
    } catch (err: any) {
      console.warn(`Primary model call failed, trying gemini-3.1-flash-lite:`, err?.message || err);
      try {
        const fallbackRes = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: {
            systemInstruction: fullSystemInstruction,
            temperature: Math.min(Math.max(Number(temperature) || 0.7, 0), 2),
            topP: Number(topP) || 0.95,
            topK: Number(topK) || 40,
          },
        });
        replyText = fallbackRes.text || '';
      } catch (fallbackErr: any) {
        console.error('All model attempts failed:', fallbackErr?.message || fallbackErr);
        // Fallback generator for bots / websites / apps
        const userText = contents[contents.length - 1]?.parts?.[0]?.text || '';
        if (userText.includes('بوت') || userText.includes('bot') || userText.includes('تيليجرام')) {
          replyText = `### فكرة وكود بوت تيليجرام ذكي (Telegram Bot in Python)\n\nكود بوت تيليجرام متكامل جاهز للتشغيل مباشرة:\n\n\`\`\`python\n# bot.py\nimport os\nfrom telegram import Update\nfrom telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes\n\nasync def start(update: Update, context: ContextTypes.DEFAULT_TYPE):\n    await update.message.reply_text("👋 أهلاً بك! أنا بوت ذكاء اصطناعي تفاعلي.")\n\nasync def help_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):\n    await update.message.reply_text("📖 أرسل أي رسالة وسأقوم بالرد الفوري عليها.")\n\nasync def echo(update: Update, context: ContextTypes.DEFAULT_TYPE):\n    await update.message.reply_text(f"🤖 استجابة البوت: {update.message.text}")\n\nif __name__ == '__main__':\n    token = os.getenv("BOT_TOKEN", "YOUR_BOT_TOKEN")\n    app = ApplicationBuilder().token(token).build()\n    app.add_handler(CommandHandler("start", start))\n    app.add_handler(CommandHandler("help", help_cmd))\n    app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), echo))\n    app.run_polling()\n\`\`\`\n\n#### خطوات التشغيل:\n1. تثبيت: \`pip install python-telegram-bot\`\n2. تشغيل: \`python bot.py\``;
        } else if (userText.includes('موقع') || userText.includes('web') || userText.includes('صفحة')) {
          replyText = `### موقع ويب تفاعلي كامل جاهز للمعاينة الفورية\n\n\`\`\`html\n<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="UTF-8">\n  <title>صفحة تفاعلية فورية</title>\n  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>\n</head>\n<body class="bg-slate-900 text-white min-h-screen flex items-center justify-center p-6">\n  <div class="max-w-md w-full bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center shadow-xl">\n    <h1 class="text-xl font-bold text-blue-400 mb-2">🎉 تطبيق الويب التفاعلي</h1>\n    <p class="text-xs text-slate-300 mb-4">هذا التطبيق يعمل مباشرة داخل اللوحة التفاعلية في الاستوديو.</p>\n    <button onclick="alert('يعمل بنجاح!')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl">اضغط هنا للتجربة</button>\n  </div>\n</body>\n</html>\n\`\`\``;
        } else {
          replyText = `مرحباً بك! تم استقبال طلبك بنجاح في الاستوديو الذكي الاحترافي. يمكنك طلب أي بوت، موقع، أو تطبيق وسنوفره لك كملف جاهز وكود كامل.`;
        }
      }
    }

    // Update user stats
    user.totalPrompts += 1;
    if (!user.isVip && user.credits > 0) {
      user.credits = Math.max(0, user.credits - 1);
    }
    user.lastActive = new Date().toISOString();
    saveDatabase();

    res.json({
      reply: replyText,
      model: targetModel,
      isVip,
      remainingCredits: user.credits,
      promptCount: user.totalPrompts,
    });
  } catch (error: any) {
    console.error('Error generating content:', error);
    res.status(500).json({
      error: error.message || 'حدث خطأ أثناء معالجة الطلب عبر Gemini API.',
    });
  }
});

// ----------------- ADMIN ROUTES -----------------

// Admin Dashboard stats & data
app.get('/api/admin/overview', (req, res) => {
  const usersList = Object.values(db.users);
  const totalCredits = usersList.reduce((acc, u) => acc + (u.credits || 0), 0);
  const totalVipUsers = usersList.filter(u => u.isVip).length;
  const totalPrompts = usersList.reduce((acc, u) => acc + (u.totalPrompts || 0), 0);

  res.json({
    metrics: {
      totalUsers: usersList.length,
      totalVipUsers,
      totalCreditsDistributed: totalCredits,
      totalPromptsHandled: totalPrompts,
      activePromoCodes: db.codes.filter(c => c.active).length,
    },
    users: usersList,
    codes: db.codes,
    settings: db.settings,
  });
});

// Mass action: Add credits to ALL users at once
app.post('/api/admin/mass-credits', (req, res) => {
  const { amount } = req.body;
  const creditsToAdd = Number(amount);

  if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
    return res.status(400).json({ error: 'يرجى إدخال قيمة رصيد صحيحة أكبر من الصفر.' });
  }

  const userIds = Object.keys(db.users);
  userIds.forEach(id => {
    db.users[id].credits = (db.users[id].credits || 0) + creditsToAdd;
  });

  saveDatabase();

  res.json({
    success: true,
    message: `تم إضافة ${creditsToAdd} رصيد بنجاح لجميع المستخدمين (${userIds.length} مستخدم)!`,
    affectedCount: userIds.length,
    users: Object.values(db.users),
  });
});

// Mass action: Upgrade ALL users to VIP Paid version at once
app.post('/api/admin/mass-vip', (req, res) => {
  const { status = true } = req.body;
  const isVip = Boolean(status);

  const userIds = Object.keys(db.users);
  userIds.forEach(id => {
    db.users[id].isVip = isVip;
    if (isVip) {
      db.users[id].vipExpiresAt = null; // Lifetime/Full VIP
    }
  });

  saveDatabase();

  res.json({
    success: true,
    message: isVip
      ? `🎉 تم ترقية جميع المستخدمين (${userIds.length} مستخدم) إلى النسخة المدفوعة VIP بحرية تامة!`
      : `تم إلغاء ترقية VIP عن جميع المستخدمين.`,
    users: Object.values(db.users),
  });
});

// Single user update (Add credits, toggle VIP, edit info, ban)
app.post('/api/admin/user-update', (req, res) => {
  const { userId, creditsToAdd, setVip, newName, status, setCreditsDirect } = req.body;

  if (!userId || !db.users[userId]) {
    return res.status(404).json({ error: 'المستخدم غير موجود.' });
  }

  const user = db.users[userId];

  if (creditsToAdd !== undefined) {
    user.credits = (user.credits || 0) + Number(creditsToAdd);
  }
  if (setCreditsDirect !== undefined) {
    user.credits = Math.max(0, Number(setCreditsDirect));
  }
  if (setVip !== undefined) {
    user.isVip = Boolean(setVip);
  }
  if (newName) {
    user.name = String(newName).trim();
  }
  if (status) {
    user.status = status;
  }

  saveDatabase();

  res.json({
    success: true,
    message: `تم تحديث بيانات المستخدم "${user.name}" بنجاح!`,
    user,
  });
});

// Create promo / activation code
app.post('/api/admin/create-code', (req, res) => {
  const { code, type = 'vip_lifetime', creditsAmount = 1000, maxUses = 10 } = req.body;

  const codeClean = String(code || `VIP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`).trim().toUpperCase();

  const existing = db.codes.find(c => c.code.toUpperCase() === codeClean);
  if (existing) {
    return res.status(400).json({ error: 'هذا الكود موجود بالفعل، يرجى اختيار كود آخر.' });
  }

  const newCode: PromoCode = {
    id: `code-${Date.now()}`,
    code: codeClean,
    type,
    creditsAmount: Number(creditsAmount) || 0,
    maxUses: Number(maxUses) || 1,
    usedCount: 0,
    usedBy: [],
    createdAt: new Date().toISOString(),
    active: true,
  };

  db.codes.unshift(newCode);
  saveDatabase();

  res.json({
    success: true,
    message: `تم إنشاء كود التفعيل "${codeClean}" بنجاح!`,
    code: newCode,
  });
});

// Delete or toggle promo code
app.post('/api/admin/toggle-code', (req, res) => {
  const { codeId, deleteAction } = req.body;
  const index = db.codes.findIndex(c => c.id === codeId);

  if (index === -1) {
    return res.status(404).json({ error: 'الكود غير موجود.' });
  }

  if (deleteAction) {
    db.codes.splice(index, 1);
    saveDatabase();
    return res.json({ success: true, message: 'تم حذف الكود نهائياً.' });
  }

  db.codes[index].active = !db.codes[index].active;
  saveDatabase();

  res.json({
    success: true,
    message: db.codes[index].active ? 'تم تفعيل الكود بنجاح.' : 'تم تعطيل الكود.',
    code: db.codes[index],
  });
});

// Update global system settings and announcement
app.post('/api/admin/settings', (req, res) => {
  const { globalAnnouncement, announcementActive, defaultCredits, systemName } = req.body;

  if (globalAnnouncement !== undefined) db.settings.globalAnnouncement = globalAnnouncement;
  if (announcementActive !== undefined) db.settings.announcementActive = Boolean(announcementActive);
  if (defaultCredits !== undefined) db.settings.defaultCredits = Number(defaultCredits);
  if (systemName !== undefined) db.settings.systemName = systemName;

  saveDatabase();

  res.json({
    success: true,
    message: 'تم تحديث إعدادات النظام والإعلانات العامة بنجاح.',
    settings: db.settings,
  });
});

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
