import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import { Search, Loader2, Zap, Key, TrendingUp, AlertTriangle, BookOpen, Shield } from 'lucide-react';
import { DEEP_RESEARCH_PROMPT } from './prompts';
import './App.css';

function App() {
  const [ticker, setTicker] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [showKeyInput, setShowKeyInput] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSaveKey = (key) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleResearch = async () => {
    if (!ticker) return;
    if (!apiKey) {
      setError("Please enter a valid Gemini API Key first.");
      setShowKeyInput(true);
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = DEEP_RESEARCH_PROMPT(ticker);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setReport(text);
    } catch (err) {
      console.error(err);
      setError("Failed to generate report. Please check your API Key and try again. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center py-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
            style={{ fontSize: '1.5rem', margin: 0 }}>
            Deep Stock Research
          </h1>
        </div>
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="text-slate-400 hover:text-white transition-colors"
          title="API Key Settings"
        >
          <Key className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-2xl flex-grow">

        {/* API Key Input (Collapsible) */}
        {(showKeyInput || !apiKey) && (
          <div className="card mb-6 animate-pulse-once">
            <label className="label">Gemini API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => handleSaveKey(e.target.value)}
                placeholder="Enter your Gemini API Key..."
                className="input"
              />
              <button
                onClick={() => setShowKeyInput(false)}
                className="btn btn-secondary"
              >
                Done
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Your key is stored locally in your browser. Get one at <a href="https://aistudio.google.com/" target="_blank" className="text-indigo-400 hover:underline">Google AI Studio</a>.
            </p>
          </div>
        )}

        {/* Search Box */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-extrabold mb-2 text-white border-0">
            Institutional-Grade Analysis
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Get a comprehensive 13-point investment memo in seconds.
          </p>

          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
              placeholder="Enter Ticker (e.g., AAPL) or Company Name"
              className="input pr-12 text-lg py-4 shadow-2xl border-indigo-500/30 focus:border-indigo-500"
            />
            <button
              onClick={handleResearch}
              disabled={loading || !ticker}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-all disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="m-0 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <p className="text-slate-400 animate-pulse">Generating deep research memo...</p>
              <div className="flex gap-2 text-xs text-slate-600">
                <span>Analyzing Financials</span> • <span>Reviewing Moat</span> • <span>Calculating Valuation</span>
              </div>
            </div>
          </div>
        )}

        {/* Report Display */}
        {report && (
          <div className="animate-fade-in-up pb-20">
            <div className="flex items-center justify-between mb-4">
              <span className="badge">Generated Report</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(report);
                  alert("Report copied to clipboard!");
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Copy Markdown
              </button>
            </div>

            <div className="card markdown-content text-left">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-6 text-white border-b border-white/10 pb-4" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-8 mb-4 text-indigo-300" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-medium mt-6 mb-2 text-cyan-400" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300" {...props} />,
                  li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-4 text-slate-300 leading-relaxed" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                }}
              >
                {report}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full text-center py-6 text-slate-600 text-xs">
        <p>Built with Gemini & React. Information for research purposes only.</p>
      </footer>
    </div>
  );
}

export default App;
