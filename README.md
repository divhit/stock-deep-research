# Stock Deep Research App

An institutional-grade stock analysis tool powered by Google's Gemini 1.5 Pro.

## Features

- **Deep 13-Point Analysis**: Generates comprehensive investment memos covers revenue models, moats, risks, and valuation.
- **Premium UI**: Dark mode, glassmorphism design for a professional research experience.
- **Instant Insights**: Just enter a ticker (e.g., AAPL) to get a structured report.

## Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/divhit/stock-deep-research.git
   cd stock-deep-research
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Locally**
   ```bash
   npm run dev
   ```

4. **Get an API Key**
   - You need a Google Gemini API Key.
   - Get one for free at [Google AI Studio](https://aistudio.google.com/).
   - Enter it in the app settings (Key icon in top right).

## Tech Stack

- React + Vite
- Tailwind CSS (via functional classes in standard CSS) & Lucide Icons
- Google Generative AI SDK (`@google/generative-ai`)
- React Markdown
