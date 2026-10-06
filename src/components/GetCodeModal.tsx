import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2 } from 'lucide-react';

interface GetCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptText: string;
  systemInstruction: string;
  model: string;
  temperature: number;
}

export const GetCodeModal: React.FC<GetCodeModalProps> = ({
  isOpen,
  onClose,
  promptText,
  systemInstruction,
  model,
  temperature,
}) => {
  const [lang, setLang] = useState<'javascript' | 'python' | 'curl'>('javascript');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentPrompt = promptText || 'مرحباً، أنشئ لي بوت ذكي أو موقع متكامل';

  const jsCode = `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const response = await ai.models.generateContent({
    model: "${model}",
    contents: "${currentPrompt.replace(/"/g, '\\"')}",
    config: {
      systemInstruction: "${systemInstruction.replace(/"/g, '\\"')}",
      temperature: ${temperature},
    },
  });

  console.log(response.text);
}

main();`;

  const pyCode = `import os
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

response = client.models.generate_content(
    model="${model}",
    contents="${currentPrompt.replace(/"/g, '\\"')}",
    config=types.GenerateContentConfig(
        system_instruction="${systemInstruction.replace(/"/g, '\\"')}",
        temperature=${temperature},
    ),
)

print(response.text)`;

  const curlCode = `curl "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=\${GEMINI_API_KEY}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contents": [{"parts": [{"text": "${currentPrompt.replace(/"/g, '\\"')}"}]}],
    "systemInstruction": {"parts": [{"text": "${systemInstruction.replace(/"/g, '\\"')}"}]},
    "generationConfig": {"temperature": ${temperature}}
  }'`;

  const activeSnippet = lang === 'javascript' ? jsCode : lang === 'python' ? pyCode : curlCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[#181d2a] border border-[#262f44] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl text-right">
        {/* Header */}
        <div className="p-4 border-b border-[#262f44] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#60a5fa]" />
            <h3 className="font-bold text-white text-sm">الحصول على الكود (Get Code)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748b] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="bg-[#141824] px-4 pt-2 border-b border-[#262f44] flex items-center gap-2">
          <button
            onClick={() => setLang('javascript')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors ${
              lang === 'javascript'
                ? 'bg-[#181d2a] text-[#60a5fa] border-t-2 border-[#3b82f6]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            JavaScript (Node.js)
          </button>
          <button
            onClick={() => setLang('python')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors ${
              lang === 'python'
                ? 'bg-[#181d2a] text-[#60a5fa] border-t-2 border-[#3b82f6]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            Python
          </button>
          <button
            onClick={() => setLang('curl')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors ${
              lang === 'curl'
                ? 'bg-[#181d2a] text-[#60a5fa] border-t-2 border-[#3b82f6]'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            cURL / REST
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-[#11141d]">
          <pre className="font-mono text-xs text-[#93c5fd] whitespace-pre-wrap break-all dir-ltr text-left selection:bg-blue-600 max-h-80 overflow-y-auto">
            {activeSnippet}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#262f44] bg-[#181d2a] flex items-center justify-between">
          <span className="text-[11px] text-[#94a3b8]">
            متوافق مع حزمة <code className="text-white">@google/genai</code> الرسمية
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
