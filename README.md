# Finoexpert — Smart Finance Dashboard

A complete, production-ready finance dashboard built with HTML5 + CSS3 + Vanilla JS.

## Features

### ✅ Fixed Navigation
- All 8 nav items correctly open their corresponding pages (no more mis-routing)
- Active state highlighting, breadcrumb navigation, smooth page transitions
- Mobile-responsive sidebar with collapse/expand toggle

### ✅ Enhanced Algo Bot (9 Strategies)
- 🚀 Momentum Trading — price momentum + volume spike detection
- 🔄 Mean Reversion — trade deviation from 20/50-day MA
- 💡 Earnings Surprise Play — auto-trade on >5% earnings beat
- 📅 Corporate Action Trigger — dividend & announcement-based trading
- 📰 News Sentiment Analysis — NLP-based buy/sell signals
- 📐 Support/Resistance Breakout — technical level breakout trading
- 📉 VWAP Following — volume-weighted average price tracking
- 🔗 Pairs Trading — long/short correlated stock pairs
- 🧠 AI-Decided Strategy — ML model selects strategy on live data

**Risk Controls:** Dynamic stop-loss (ATR), trailing stop-loss, Kelly criterion sizing, max portfolio heat, daily loss limit, time-based exits

### ✅ Real-Time Market Data
- SENSEX, NIFTY 50, NIFTY BANK, India VIX live simulation (≤5 sec updates)
- 50+ NSE stocks with live price simulation
- Stock screener with sector/exchange filters, sorting, pagination
- IPO Tracker, Corporate Announcements, Quarterly Earnings, Dividend Calendar, Economic Calendar

### ✅ Account & Balance System
- Balance starts at ₹0 (fresh start), or reset to any custom amount
- Tracks: Cash, Invested Capital, Unrealised P&L, Realised P&L, Margin
- Deposit / Withdraw funds with transaction history
- Export trades, transactions, and all data as CSV/JSON

### ✅ Improved UI/UX
- Dark/light theme toggle
- Collapsible sidebar
- Real-time account summary in topbar
- Trade confirmation modals
- Toast notifications
- Sortable, filterable, paginated tables
- Mobile responsive (single-column on small screens)
- ARIA labels and keyboard navigation

## Files

- `index.html` — Complete single-page application
- `style.css` — All styles (dark/light themes, responsive)
- `app.js` — All JavaScript (state management, charts, trading logic)

## Usage

Open `index.html` directly in a browser, or serve with any static web server:

```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

## API Integration

To connect to live data, configure in the **Algo Bot → API Integration** section:
- **Zerodha Kite API** — for live trading
- **Supabase** — for cloud data persistence

Without API keys, the dashboard runs in paper trading mode with simulated market data.
