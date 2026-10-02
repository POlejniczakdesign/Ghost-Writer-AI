import React, { useState } from 'react';
import {
  MessageSquareCode,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  DollarSign,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { BookBlueprint, GenreType } from '../types/ghostwriter';

interface ConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  genre: GenreType;
  blueprint: BookBlueprint | null;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const ConsultantModal: React.FC<ConsultantModalProps> = ({
  isOpen,
  onClose,
  genre,
  blueprint,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `Greetings, author. I am Ghost-Writer AI v1.0, your master-class publishing consultant. Ask me anything about Amazon KDP category selection, Kindle Unlimited royalty strategies, 7-keyword backend optimization, high-converting blurb copywriting, or plot tightening. What challenge are we tackling?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || isLoading) return;

    const newHistory: ChatMessage[] = [
      ...messages,
      { role: 'user', text: textToSend },
    ];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ghostwriter/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          bookContext: {
            genre,
            title: blueprint?.title,
            blueprintOverview: blueprint ? `${blueprint.title}: ${blueprint.logline}` : null,
          },
        }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages([...newHistory, { role: 'model', text: data.reply }]);
      } else {
        setMessages([
          ...newHistory,
          { role: 'model', text: 'I apologize, an error occurred in retrieving advice. Please try again.' },
        ]);
      }
    } catch (err: any) {
      console.error(err);
      setMessages([
        ...newHistory,
        { role: 'model', text: 'Connection issue. Please verify network status.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col justify-between animate-slideLeft">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MessageSquareCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Ghost-Writer AI Consultant</h3>
              <p className="text-[10px] font-mono-tag text-zinc-400">
                KDP & Audible Strategic Publishing Advisory
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Strategy Prompts */}
        <div className="p-3 bg-zinc-900/30 border-b border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-zinc-500 shrink-0 font-mono-tag">Topics:</span>
          {[
            'Best KDP Price Point?',
            'Hook Rewrite for Blurb',
            'Audible ACX Royalty vs Exclusive',
            'Kindle Unlimited Strategy',
          ].map((topic, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(topic)}
              className="shrink-0 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'model' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                  m.role === 'user'
                    ? 'bg-amber-500 text-zinc-950 font-medium rounded-tr-none'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none font-serif-book'
                }`}
              >
                {m.text}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono-tag">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Ghost-Writer AI strategist thinking...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about publishing strategy, pricing, tropes..."
              className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
