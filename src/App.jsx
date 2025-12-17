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
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      const envKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (envKey) setApiKey(envKey);
    }
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
      const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

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
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="icon-box">
            <TrendingUp className="icon-white" />
          </div>
          <h1 className="app-title">
            Deep Stock Research
          </h1>
        </div>
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="icon-btn"
          title="API Key Settings"
        >
          <Key className="icon-sm" />
        </button>
      </header>

      {/* Main Content */}
      <main className="app-main">

        {/* API Key Input (Collapsible) */}
        {(showKeyInput || !apiKey) && (
          <div className="card settings-card animate-fade-in">
            <label className="label">Gemini API Key</label>
            <div className="input-row">
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
            <p className="helper-text">
              Your key is stored locally in your browser. Get one at <a href="https://aistudio.google.com/" target="_blank" className="link">Google AI Studio</a>.
            </p>
          </div>
        )}

        {/* Search Box */}
        <div className="hero-section">
          <h2 className="hero-title">
            Institutional-Grade Analysis
          </h2>
          <p className="hero-subtitle">
            Get a comprehensive 13-point investment memo in seconds.
          </p>

          <div className="search-wrapper">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
              placeholder="Enter Ticker (e.g., AAPL) or Company Name"
              className="input search-input"
            />
            <button
              onClick={handleResearch}
              disabled={loading || !ticker}
              className="search-btn"
            >
              {loading ? <Loader2 className="animate-spin icon-sm" /> : <Search className="icon-sm" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <AlertTriangle className="icon-sm" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-content">
              <div className="spinner-wrapper">
                <div className="spinner-ring"></div>
                <div className="spinner-center">
                  <Zap className="icon-zap animate-pulse" />
                </div>
              </div>
              <p className="loading-text animate-pulse">Generating deep research memo...</p>
              <div className="loading-steps">
                <span>Analyzing Financials</span> • <span>Reviewing Moat</span> • <span>Calculating Valuation</span>
              </div>
            </div>
          </div>
        )}

        {/* Report Display */}
        {report && (
          <div className="report-container animate-fade-in-up">
            <div className="report-header">
              <span className="badge">Generated Report</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(report);
                  alert("Report copied to clipboard!");
                }}
                className="copy-link"
              >
                Copy Markdown
              </button>
            </div>

            <div className="card markdown-content">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="md-h1" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="md-h2" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="md-h3" {...props} />,
                  ul: ({ node, ...props }) => <ul className="md-ul" {...props} />,
                  li: ({ node, ...props }) => <li className="md-li" {...props} />,
                  p: ({ node, ...props }) => <p className="md-p" {...props} />,
                  strong: ({ node, ...props }) => <strong className="md-strong" {...props} />,
                }}
              >
                {report}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built with Gemini 3 Pro & React. Information for research purposes only.</p>
      </footer>
    </div>
  );
}

export default App;
