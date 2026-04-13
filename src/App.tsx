import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioWaveform, Plus } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { MessageBubble } from './components/chat/MessageBubble';
import { SuggestionChips, type Suggestion } from './components/chat/SuggestionChips';
import { ProfileCard, type ProfileData } from './components/profile/ProfileCard';

// ─── Data ────────────────────────────────────────────────────

type MessageType = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  showProfile?: boolean;
  suggestions?: Suggestion[];
  promptText?: string;
};

const DAIDI_PROFILE: ProfileData = {
  name: "Daidi",
  title: "Software Engineer @ Tencent · Shanghai",
  headline: "Build tools that\nmake engineers faster.",
  bio: "Polyglot engineer who ships across the full stack — from Rust CLI tools to Java backends, Python AI agents, and TypeScript frontends. Creator of Git AI and various open source projects.",
  techStack: ["TypeScript", "Rust", "Python", "Java", "Go", "PHP", "Vue", "React"],
  socialLinks: [
    { label: "GitHub", icon: "GH", url: "https://github.com/daidi" },
    { label: "Email",  icon: "✉",  url: "mailto:dannydai@tencent.com" },
  ]
};

const INITIAL_SUGGESTIONS: Suggestion[] = [
  { id: 'projects', label: '🛠 Show me the projects' },
  { id: 'stack',    label: '⚡ What tech does he use?' },
  { id: 'contact',  label: '📬 How to reach Daidi?' }
];

// ─── Helpers ─────────────────────────────────────────────────

async function streamText(
  text: string,
  msgId: string,
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  speed = 18
) {
  let acc = '';
  for (let i = 0; i < text.length; i++) {
    await new Promise(r => setTimeout(r, speed + Math.random() * 15));
    acc += text[i];
    const snapshot = acc;
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: snapshot } : m));
  }
}

// ─── Component ───────────────────────────────────────────────

export default function App() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, []);

  // Auto-scroll while processing
  useEffect(() => {
    if (!isProcessing) return;
    const iv = setInterval(scrollToBottom, 150);
    return () => clearInterval(iv);
  }, [isProcessing, scrollToBottom]);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // ── Initial greeting sequence ──────────────────────────────
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    setIsProcessing(true);

    (async () => {
      // 1. User message fades in
      setMessages([{
        id: 'init-user',
        role: 'user',
        content: "Tell me about Daidi — I'm curious 👀"
      }]);

      await new Promise(r => setTimeout(r, 800));

      // 2. Assistant starts streaming
      const assistantId = 'init-assistant';
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        isStreaming: true
      }]);

      const greeting = "Hey there! 👋 Welcome to Daidi's corner of the internet.\n\nI'm his AI assistant. Daidi is a software engineer at Tencent in Shanghai. He's a true polyglot — shipping production code in TypeScript, Rust, Python, Java, Go, and PHP. When he's not at work, he's building open source developer tools and AI agents. Let me pull up his card 😉";

      await streamText(greeting, assistantId, setMessages);
      await new Promise(r => setTimeout(r, 300));

      // 3. Reveal profile card + suggestion chips
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? {
              ...m,
              isStreaming: false,
              showProfile: true,
              promptText: "Go ahead, pick a topic — you know you want to click them all 😄",
              suggestions: INITIAL_SUGGESTIONS
            }
          : m
      ));
      setIsProcessing(false);
    })();
  }, []);

  // ── Handle suggestion click ────────────────────────────────
  const handleSelect = useCallback(async (suggestion: Suggestion) => {
    if (isProcessing) return;
    setIsProcessing(true);

    // Clear old suggestions
    setMessages(prev => prev.map(m => ({ ...m, suggestions: undefined, promptText: undefined })));

    // User message
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      role: 'user',
      content: suggestion.label
    }]);

    await new Promise(r => setTimeout(r, 500));

    // Assistant response
    const aId = `assistant-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: aId,
      role: 'assistant',
      content: '',
      isStreaming: true
    }]);

    let text = '';
    let nextSuggestions: Suggestion[] = [];

    switch (suggestion.id) {
      case 'projects':
        text = "Here are Daidi's key projects:\n\n🚀 **Git AI** (TypeScript) — Cross-platform commit automation with VS Code & IntelliJ plugins, CLI, and a landing page at codegg.org/git-ai. Async LLM-powered commit polishing.\n\n🦀 **agent-browser** (Rust) — A browser automation CLI purpose-built for AI agents. Headless Chrome control from the terminal.\n\n🐍 **hermes-agent** (Python) — An AI agent framework that grows with the user.\n\n☕ **midjourney-proxy** (Java) — Discord channel proxy for Midjourney API-style AI art generation.\n\n🤖 **domy** (TypeScript) — An open-source Assistants API alternative with built-in RAG engine.\n\nHe also maintains Homebrew taps, Scoop buckets, and Tauri update servers — the full distribution pipeline.";
        nextSuggestions = [
          { id: 'stack', label: '⚡ What tech does he use?' },
          { id: 'contact', label: '📬 How to reach him?' }
        ];
        break;
      case 'stack':
        text = "Daidi is a genuine polyglot. Here's the breakdown:\n\n• **TypeScript / JavaScript** — React, Vue, Svelte, Node.js, Vite, Tauri frontends\n• **Rust** — CLI tools (agent-browser), system libs (mouce, ruhear)\n• **Python** — AI agents (hermes-agent), LLM platforms (bisheng)\n• **Java** — Backend services, API proxies (midjourney-proxy)\n• **Go / PHP** — Production backends at Tencent\n• **Shell / Ruby** — Homebrew formulae, install scripts, CI/CD\n\n• **AI / LLM** — OpenAI, Gemini, Claude, MCP SDK, RAG pipelines\n• **DevOps** — GitHub Actions, Cloudflare Workers, Docker, pnpm monorepos\n\nThe man writes Rust libs in the morning and Vue apps in the afternoon. Absolute unit.";
        nextSuggestions = [
          { id: 'projects', label: '🛠 Show me the projects' },
          { id: 'contact', label: '📬 How to reach him?' }
        ];
        break;
      case 'contact':
        text = "Best ways to connect with Daidi:\n\n🏢 **Company**: Tencent Technology (Shanghai) Co., Ltd\n📍 **Location**: Shanghai, China\n🐙 **GitHub**: github.com/daidi\n✉️ **Email**: dannydai@tencent.com\n🌐 **Blog**: codegg.cn\n\nHe's open to collaboration on developer tooling, AI agents, and anything that makes engineers faster.";
        nextSuggestions = [
          { id: 'projects', label: '🛠 Show me the projects' },
          { id: 'stack', label: '⚡ What tech does he use?' }
        ];
        break;
      default:
        text = "That's a great question! This is a placeholder response — once the real LLM backend is connected, I'll give you a much more detailed answer.";
        nextSuggestions = INITIAL_SUGGESTIONS;
    }

    await streamText(text, aId, setMessages);
    await new Promise(r => setTimeout(r, 200));

    setMessages(prev => prev.map(m =>
      m.id === aId
        ? { ...m, isStreaming: false, suggestions: nextSuggestions }
        : m
    ));
    setIsProcessing(false);
  }, [isProcessing]);

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="h-dvh flex flex-col bg-background relative overflow-hidden">
      <Toaster position="bottom-center" toastOptions={{ className: 'bg-card text-foreground border border-border shadow-lg font-sans' }} />

      {/* Chat messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto py-6 md:py-14">
        <div className="max-w-2xl mx-auto px-6 space-y-8">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                isStreaming={msg.isStreaming}
              >
                {msg.showProfile && <ProfileCard data={DAIDI_PROFILE} />}
                {msg.promptText && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-muted-foreground mt-5"
                  >
                    {msg.promptText}
                  </motion.p>
                )}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3">
                    <SuggestionChips suggestions={msg.suggestions} onSelect={handleSelect} />
                  </div>
                )}
              </MessageBubble>
            ))}
          </AnimatePresence>
          <div className="h-24" />
        </div>
      </div>

      {/* Bottom floating input pill */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-50">
        <div 
          className="max-w-2xl mx-auto p-6"
          onClick={() => {
            if (isProcessing) return;
            toast.promise(
              new Promise((resolve) => setTimeout(resolve, 2500)),
              {
                loading: 'Connecting to AI backend...',
                success: 'Just kidding 😘 Pick a suggestion above!',
              }
            );
          }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 28, delay: 0.8 }}
            className="flex items-center gap-2 p-1.5 rounded-full bg-card border border-border shadow-xl pointer-events-auto cursor-pointer"
          >
            <button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-input transition-colors text-muted-foreground pointer-events-none">
              <Plus size={18} />
            </button>
            <input
              type="text"
              disabled
              placeholder="Tap a suggestion above to ask"
              className="flex-1 text-xs bg-transparent outline-none placeholder:text-muted-foreground/50 cursor-pointer pointer-events-none"
            />
            <button className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground shadow-sm pointer-events-none">
              <AudioWaveform size={16} />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
