import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Database, 
  ShieldCheck, 
  HelpCircle,
  RefreshCw,
  Cpu
} from 'lucide-react';

export const AIAssistantPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `### 👋 Welcome to SupplyStock AI Assistant\n\nI am connected to your live supply chain database and Scikit-Learn predictive forecasting models. I can answer inquiries regarding stock levels, recommended reorders, shipment delay risks, and vendor reliability without hallucinating figures.\n\n*Choose a suggested prompt below or type your inquiry:*`,
      sources: ['MySQL Production DB', 'Scikit-Learn Forecast Pipeline'],
      provider: 'SupplyStock Intelligence Engine'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const SUGGESTED_PROMPTS = [
    'Which products are running low on stock?',
    'What should I reorder this week?',
    'Which supplier has the best delivery performance?',
    'Show my pending purchase orders.',
    'Which products have the highest sales?',
    'Summarize my monthly inventory performance.'
  ];

  const handleSend = async (textToSend = null) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: prompt
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await api.queryAssistant(prompt, user?.role || 'RETAILER');
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: res.reply,
        sources: res.sourceAttribution || ['MySQL Database'],
        provider: res.provider || 'SupplyStock Context Engine'
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: 'An error occurred while querying the intelligence service. Please verify your connection.',
          sources: ['Error Handler'],
          provider: 'Fallback'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simple Markdown renderer for chat responses
  const renderFormattedText = (text) => {
    return (
      <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-2 whitespace-pre-wrap">
        {text}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Gemini AI Inventory & Supply Chain Assistant</h1>
            <p className="text-[11px] text-slate-400">
              Grounded on authorized application context with strict zero-hallucination protocols.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Authorized User: {user?.role || 'RETAILER'}</span>
          </span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        {SUGGESTED_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p)}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-750 text-[11px] font-medium transition flex items-center space-x-1.5 hover:border-indigo-500/40"
          >
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        {messages.map((m) => (
          <div 
            key={m.id}
            className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl p-4 rounded-2xl shadow-md ${
              m.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-slate-850 border border-slate-750 text-slate-200 rounded-tl-none'
            }`}>
              {renderFormattedText(m.text)}

              {/* Source attribution and model tag */}
              {m.sender === 'assistant' && m.sources && (
                <div className="mt-3 pt-2.5 border-t border-slate-750/80 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <Database className="w-3 h-3 text-indigo-400" />
                    <span>Data: <strong>{m.sources.join(', ')}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Cpu className="w-3 h-3 text-purple-400" />
                    <span className="font-mono text-purple-300">{m.provider}</span>
                  </div>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3 text-slate-400 p-4 rounded-2xl bg-slate-850/60 border border-slate-750 w-fit">
            <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
            <span className="text-xs">Querying database metrics and synthesizing context...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center space-x-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask about inventory, supplier performance, purchase reorders..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-white text-xs focus:border-indigo-500 focus:outline-none shadow-xl"
        />
        <button
          type="submit"
          disabled={loading || !inputPrompt.trim()}
          className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
