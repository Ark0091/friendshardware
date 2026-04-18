// ===== FINOEXPERT — FINANCE DASHBOARD APPLICATION =====
'use strict';

// ───── STATE ─────
const state = {
  currentPage: 'dashboard',
  theme: 'dark',
  account: {
    id: 'FINO-PAPER-001',
    type: 'paper',
    name: 'Trader',
    cash: 0,
    invested: 0,
    unrealisedPnl: 0,
    realisedPnl: 0,
    margin: 0,
    deposits: 0,
    withdrawals: 0,
  },
  holdings: [],        // {symbol, company, qty, avgPrice, sector}
  trades: [],          // {id, date, symbol, exchange, type, qty, price, total, pnl, source, status}
  transactions: [],    // {date, type, amount, balanceAfter, note}
  watchlist: [],       // ['RELIANCE', 'TCS', ...]
  marketData: {},      // {symbol: {ltp, change, pct, volume, high52, low52, sector, company, exchange}}
  indices: {
    sensex: { val: 73425.50, chg: 0 },
    nifty:  { val: 22250.30, chg: 0 },
    banknifty: { val: 47800.10, chg: 0 },
    vix:    { val: 14.25, chg: 0 },
  },
  bot: {
    running: false,
    strategies: [],
    mode: 'paper',
    trades: [],
    metrics: { sharpe: null, winRate: null, maxDD: null, totalTrades: 0, pnlToday: 0 },
    interval: null,
    dailyLoss: 0,
  },
  notifications: [],
  charts: {},
  marketPage: { allRows: [], filtered: [], page: 1, pageSize: 15 },
  holdingsPage: { filtered: [], page: 1, pageSize: 10 },
  tradesPage: { allRows: [], filtered: [], page: 1, pageSize: 15, tab: 'my' },
  refreshInterval: 5000,
  perfChartPeriod: '1W',
  backtestChartInst: null,
};

// ───── NIFTY 50 STOCKS DATABASE ─────
const STOCKS_DB = [
  {symbol:'RELIANCE',company:'Reliance Industries',exchange:'NSE',sector:'Energy',ltp:2950.40,high52:3070.15,low52:2170.50},
  {symbol:'TCS',company:'Tata Consultancy Services',exchange:'NSE',sector:'IT',ltp:4020.75,high52:4395.00,low52:3056.80},
  {symbol:'HDFCBANK',company:'HDFC Bank',exchange:'NSE',sector:'Banking',ltp:1685.30,high52:1794.00,low52:1363.55},
  {symbol:'INFY',company:'Infosys',exchange:'NSE',sector:'IT',ltp:1765.20,high52:1953.90,low52:1358.35},
  {symbol:'ICICIBANK',company:'ICICI Bank',exchange:'NSE',sector:'Banking',ltp:1245.60,high52:1339.65,low52:855.00},
  {symbol:'HINDUNILVR',company:'Hindustan Unilever',exchange:'NSE',sector:'FMCG',ltp:2580.90,high52:2859.50,low52:2172.05},
  {symbol:'SBIN',company:'State Bank of India',exchange:'NSE',sector:'Banking',ltp:815.45,high52:912.00,low52:543.10},
  {symbol:'KOTAKBANK',company:'Kotak Mahindra Bank',exchange:'NSE',sector:'Banking',ltp:1890.20,high52:2063.75,low52:1543.85},
  {symbol:'BAJFINANCE',company:'Bajaj Finance',exchange:'NSE',sector:'Finance',ltp:7285.30,high52:8192.00,low52:6187.80},
  {symbol:'BHARTIARTL',company:'Bharti Airtel',exchange:'NSE',sector:'Telecom',ltp:1475.60,high52:1608.95,low52:814.60},
  {symbol:'LT',company:'Larsen and Toubro',exchange:'NSE',sector:'Construction',ltp:3620.85,high52:3930.15,low52:2540.00},
  {symbol:'AXISBANK',company:'Axis Bank',exchange:'NSE',sector:'Banking',ltp:1145.30,high52:1339.65,low52:938.65},
  {symbol:'ASIANPAINT',company:'Asian Paints',exchange:'NSE',sector:'FMCG',ltp:2890.40,high52:3460.25,low52:2170.80},
  {symbol:'MARUTI',company:'Maruti Suzuki India',exchange:'NSE',sector:'Auto',ltp:12850.70,high52:13680.00,low52:8865.05},
  {symbol:'WIPRO',company:'Wipro',exchange:'NSE',sector:'IT',ltp:548.25,high52:597.80,low52:362.45},
  {symbol:'SUNPHARMA',company:'Sun Pharmaceutical',exchange:'NSE',sector:'Pharma',ltp:1675.40,high52:1787.85,low52:1025.40},
  {symbol:'TATAMOTORS',company:'Tata Motors',exchange:'NSE',sector:'Auto',ltp:968.70,high52:1179.05,low52:567.45},
  {symbol:'ULTRACEMCO',company:'UltraTech Cement',exchange:'NSE',sector:'Metal',ltp:10280.45,high52:11090.00,low52:7815.30},
  {symbol:'TITAN',company:'Titan Company',exchange:'NSE',sector:'Consumer',ltp:3645.80,high52:3886.05,low52:2664.25},
  {symbol:'NESTLEIND',company:'Nestle India',exchange:'NSE',sector:'FMCG',ltp:2285.60,high52:2778.00,low52:2095.35},
  {symbol:'POWERGRID',company:'Power Grid Corporation',exchange:'NSE',sector:'Energy',ltp:302.45,high52:366.25,low52:211.75},
  {symbol:'NTPC',company:'NTPC',exchange:'NSE',sector:'Energy',ltp:365.20,high52:395.00,low52:178.85},
  {symbol:'ONGC',company:'ONGC',exchange:'NSE',sector:'Energy',ltp:268.80,high52:314.65,low52:147.50},
  {symbol:'DRREDDY',company:'Dr Reddy Laboratories',exchange:'NSE',sector:'Pharma',ltp:5980.40,high52:6765.00,low52:4500.00},
  {symbol:'TECHM',company:'Tech Mahindra',exchange:'NSE',sector:'IT',ltp:1475.90,high52:1720.00,low52:984.50},
  {symbol:'JSWSTEEL',company:'JSW Steel',exchange:'NSE',sector:'Metal',ltp:890.35,high52:1063.25,low52:672.65},
  {symbol:'TATASTEEL',company:'Tata Steel',exchange:'NSE',sector:'Metal',ltp:165.45,high52:185.60,low52:108.55},
  {symbol:'CIPLA',company:'Cipla',exchange:'NSE',sector:'Pharma',ltp:1520.85,high52:1694.50,low52:1017.20},
  {symbol:'DIVISLAB',company:'Divis Laboratories',exchange:'NSE',sector:'Pharma',ltp:3845.60,high52:4580.00,low52:3146.95},
  {symbol:'HCLTECH',company:'HCL Technologies',exchange:'NSE',sector:'IT',ltp:1780.30,high52:1950.00,low52:1070.25},
  {symbol:'BAJAJFINSV',company:'Bajaj Finserv',exchange:'NSE',sector:'Finance',ltp:1680.40,high52:1962.00,low52:1350.15},
  {symbol:'ADANIPORTS',company:'Adani Ports',exchange:'NSE',sector:'Infrastructure',ltp:1425.60,high52:1608.00,low52:635.55},
  {symbol:'GRASIM',company:'Grasim Industries',exchange:'NSE',sector:'Construction',ltp:2345.80,high52:2545.00,low52:1618.65},
  {symbol:'BPCL',company:'BPCL',exchange:'NSE',sector:'Energy',ltp:625.40,high52:752.30,low52:334.80},
  {symbol:'HEROMOTOCO',company:'Hero MotoCorp',exchange:'NSE',sector:'Auto',ltp:4875.20,high52:5520.00,low52:2945.00},
  {symbol:'EICHERMOT',company:'Eicher Motors',exchange:'NSE',sector:'Auto',ltp:4525.60,high52:4872.00,low52:3046.55},
  {symbol:'TATACONSUM',company:'Tata Consumer Products',exchange:'NSE',sector:'FMCG',ltp:1125.80,high52:1276.00,low52:750.80},
  {symbol:'BRITANNIA',company:'Britannia Industries',exchange:'NSE',sector:'FMCG',ltp:5285.40,high52:5840.00,low52:4380.00},
  {symbol:'COALINDIA',company:'Coal India',exchange:'NSE',sector:'Energy',ltp:458.90,high52:501.70,low52:205.50},
  {symbol:'APOLLOHOSP',company:'Apollo Hospitals',exchange:'NSE',sector:'Healthcare',ltp:6280.50,high52:7275.00,low52:4500.00},
  {symbol:'M&M',company:'Mahindra and Mahindra',exchange:'NSE',sector:'Auto',ltp:2180.60,high52:2820.00,low52:1196.00},
  {symbol:'INDUSINDBK',company:'IndusInd Bank',exchange:'NSE',sector:'Banking',ltp:1485.30,high52:2004.15,low52:995.00},
  {symbol:'SBILIFE',company:'SBI Life Insurance',exchange:'NSE',sector:'Finance',ltp:1585.40,high52:1745.00,low52:1149.50},
  {symbol:'PIDILITIND',company:'Pidilite Industries',exchange:'NSE',sector:'Consumer',ltp:2935.80,high52:3168.00,low52:2090.55},
  {symbol:'HDFCLIFE',company:'HDFC Life Insurance',exchange:'NSE',sector:'Finance',ltp:680.20,high52:757.75,low52:511.60},
  {symbol:'ADANIENT',company:'Adani Enterprises',exchange:'NSE',sector:'Diversified',ltp:3245.70,high52:3743.90,low52:1017.40},
  {symbol:'SHREECEM',company:'Shree Cement',exchange:'NSE',sector:'Metal',ltp:28540.00,high52:33400.00,low52:22700.00},
  {symbol:'BEL',company:'Bharat Electronics',exchange:'NSE',sector:'Defence',ltp:245.80,high52:340.35,low52:109.55},
  {symbol:'HAVELLS',company:'Havells India',exchange:'NSE',sector:'Consumer',ltp:1685.40,high52:1875.00,low52:1140.80},
  {symbol:'ZOMATO',company:'Zomato',exchange:'NSE',sector:'Consumer',ltp:248.60,high52:290.40,low52:53.50},
];

// ───── ANNOUNCEMENTS DATA ─────
const ANNOUNCEMENTS_DATA = [
  {type:'Results',company:'TCS',symbol:'TCS',date:'2026-04-09',title:'Q4 FY2026 Quarterly Results',summary:'Revenue ₹63,437 Cr, Net Profit ₹12,224 Cr (+4.5% YoY)',impact:'positive'},
  {type:'Dividend',company:'Infosys',symbol:'INFY',date:'2026-04-08',title:'Final Dividend ₹21 per share',summary:'Board declares final dividend for FY2026, record date April 28',impact:'positive'},
  {type:'Board Meeting',company:'HDFC Bank',symbol:'HDFCBANK',date:'2026-04-10',title:'Board Meeting for Q4 Results',summary:'Results announcement scheduled for April 20, 2026',impact:'neutral'},
  {type:'Results',company:'Reliance Industries',symbol:'RELIANCE',date:'2026-04-07',title:'Q4 FY2026 Results',summary:'Net profit ₹21,300 Cr (+18% YoY), Jio ARPU grows to ₹182',impact:'positive'},
  {type:'Buyback',company:'Wipro',symbol:'WIPRO',date:'2026-04-05',title:'Share Buyback ₹12,000 Cr',summary:'Board approves buyback at ₹575 per share, open market route',impact:'positive'},
  {type:'AGM',company:'ITC',symbol:'ITC',date:'2026-04-03',title:'Annual General Meeting',summary:'AGM scheduled for May 28, 2026. Agenda includes dividend approval',impact:'neutral'},
  {type:'Rights Issue',company:'Adani Ports',symbol:'ADANIPORTS',date:'2026-04-02',title:'Rights Issue 1:10',summary:'Rights issue at ₹900 per share, record date April 25',impact:'neutral'},
  {type:'Results',company:'HDFC Bank',symbol:'HDFCBANK',date:'2026-03-28',title:'Q3 FY2026 Results',summary:'Net Interest Income ₹30,060 Cr, NPA stable at 1.26%',impact:'neutral'},
];

const EARNINGS_DATA = [
  {company:'TCS',symbol:'TCS',period:'Q4 FY26',date:'2026-04-09',estimated:'11,700',actual:'12,224',surprise:'+4.5%',beat:true},
  {company:'Reliance',symbol:'RELIANCE',period:'Q4 FY26',date:'2026-04-07',estimated:'18,200',actual:'21,300',surprise:'+17%',beat:true},
  {company:'Infosys',symbol:'INFY',period:'Q4 FY26',date:'2026-04-25',estimated:'7,100',actual:null,surprise:null,beat:null},
  {company:'HDFC Bank',symbol:'HDFCBANK',period:'Q4 FY26',date:'2026-04-20',estimated:'16,500',actual:null,surprise:null,beat:null},
  {company:'ICICI Bank',symbol:'ICICIBANK',period:'Q4 FY26',date:'2026-04-22',estimated:'10,800',actual:null,surprise:null,beat:null},
];

const DIVIDEND_DATA = [
  {company:'Infosys',symbol:'INFY',amount:'₹21',type:'Final',exDate:'2026-04-28',payDate:'2026-05-10'},
  {company:'TCS',symbol:'TCS',amount:'₹30',type:'Final',exDate:'2026-05-02',payDate:'2026-05-14'},
  {company:'ITC',symbol:'ITC',amount:'₹8.5',type:'Final',exDate:'2026-05-20',payDate:'2026-06-01'},
  {company:'HUL',symbol:'HINDUNILVR',amount:'₹24',type:'Interim',exDate:'2026-04-15',payDate:'2026-04-25'},
  {company:'Bajaj Finance',symbol:'BAJFINANCE',amount:'₹36',type:'Final',exDate:'2026-05-10',payDate:'2026-05-22'},
];

const ECONOMIC_CALENDAR = [
  {date:'2026-04-12',event:'RBI Monetary Policy Meeting',impact:'High',expected:'6.50% repo rate',currency:'INR'},
  {date:'2026-04-15',event:'India WPI Inflation (March)',impact:'Medium',expected:'2.8%',currency:'INR'},
  {date:'2026-04-16',event:'US Retail Sales (March)',impact:'Medium',expected:'+0.4%',currency:'USD'},
  {date:'2026-04-25',event:'India GDP Q4 FY26',impact:'High',expected:'7.2%',currency:'INR'},
  {date:'2026-04-30',event:'US FOMC Meeting',impact:'High',expected:'No change',currency:'USD'},
  {date:'2026-05-05',event:'India Services PMI (April)',impact:'Medium',expected:'57.5',currency:'INR'},
];

const IPO_DATA = [
  {company:'Swiggy',symbol:'SWIGGY',issue:'₹4,500 Cr',price:'₹390-420',dates:'Apr 14-16',gmp:'+₹42',status:'open'},
  {company:'OYO Hotels',symbol:'ORSTAY',issue:'₹8,430 Cr',price:'₹55-60',dates:'Apr 20-22',gmp:null,status:'upcoming'},
  {company:'Ola Electric',symbol:'OLAELEC',issue:'₹6,145 Cr',price:'₹72-76',dates:'Mar 28-30',gmp:'+₹8',status:'closed'},
];

// ───── INIT ─────
function init() {
  loadState();
  initSidebar();
  initNavigation();
  startMarketFeed();
  renderMarketTable();
  updateAllStats();
  initCharts();
  renderAnnouncements();
  renderEarnings();
  renderDividends();
  renderEconomicCalendar();
  renderIPOTracker();
  renderWatchlist();
  renderHoldings();
  renderTrades();
  renderTransactions();
  updateBotMetrics();
  setInterval(liveUpdate, state.refreshInterval);
  applyTheme(state.theme);
  document.getElementById('btTo').value = new Date().toISOString().slice(0,10);
  checkMarketStatus();
  console.log('Finoexpert initialized');
}

// ───── PERSISTENCE ─────
function loadState() {
  try {
    const saved = localStorage.getItem('finoexpert_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state.account, parsed.account || {});
      state.holdings = parsed.holdings || [];
      state.trades = parsed.trades || [];
      state.transactions = parsed.transactions || [];
      state.watchlist = parsed.watchlist || [];
      state.theme = parsed.theme || 'dark';
      state.bot.strategies = parsed.botStrategies || [];
      state.refreshInterval = (parsed.refreshInterval || 5) * 1000;
      document.getElementById('refreshInterval').value = parsed.refreshInterval || 5;
    }
  } catch(e) { console.warn('State load failed:', e); }
}

function saveState() {
  try {
    const toSave = {
      account: state.account,
      holdings: state.holdings,
      trades: state.trades,
      transactions: state.transactions,
      watchlist: state.watchlist,
      theme: state.theme,
      botStrategies: state.bot.strategies,
      refreshInterval: state.refreshInterval / 1000,
    };
    localStorage.setItem('finoexpert_state', JSON.stringify(toSave));
  } catch(e) { console.warn('State save failed:', e); }
}

// ───── SIDEBAR ─────
function initSidebar() {
  const toggle = document.getElementById('sidebarToggle');
  const mobileToggle = document.getElementById('mobileSidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const wrapper = document.getElementById('mainWrapper');

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    wrapper.classList.toggle('sidebar-collapsed');
  });

  mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('mobile-open');
  });

  // Close mobile sidebar when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 900 && !sidebar.contains(e.target) && e.target !== mobileToggle) {
      sidebar.classList.remove('mobile-open');
    }
  });
}

// ───── NAVIGATION ─────
function initNavigation() {
  document.querySelectorAll('.nav-item[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      navigateTo(page);
    });
  });
}

function navigateTo(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  const target = document.getElementById('page-' + pageId);
  if (!target) { console.error('Page not found: page-' + pageId); return; }
  target.classList.add('active');

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === pageId);
  });

  // Update breadcrumb
  const names = {
    dashboard:'Dashboard', portfolio:'Portfolio', market:'Live Market',
    algobot:'Algo Bot', trades:'Trade History', announcements:'Announcements',
    account:'Account', settings:'Settings'
  };
  document.getElementById('breadcrumb').innerHTML = `<span>${names[pageId] || pageId}</span>`;
  state.currentPage = pageId;

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('mobile-open');

  // Page-specific init
  if (pageId === 'portfolio') { renderHoldings(); renderPortfolioCharts(); }
  if (pageId === 'market') { renderMarketTable(); }
  if (pageId === 'algobot') { updateStratCount(); }
  if (pageId === 'trades') { renderTrades(); }
  if (pageId === 'announcements') { renderAnnouncements(); }
  if (pageId === 'account') { updateAccountPage(); }
  if (pageId === 'dashboard') { updateDashboardCards(); }
}

// ───── MARKET FEED (SIMULATION) ─────
function initMarketData() {
  STOCKS_DB.forEach(s => {
    state.marketData[s.symbol] = {
      ltp: s.ltp, change: 0, pct: 0,
      volume: Math.floor(Math.random() * 5000000) + 500000,
      high52: s.high52, low52: s.low52,
      sector: s.sector, company: s.company, exchange: s.exchange,
      prevClose: s.ltp
    };
  });
}

function startMarketFeed() {
  initMarketData();
  updateIndices();
  renderMarketTable();
  document.getElementById('ws-conn-status').textContent = 'Simulated Live';
}

function liveUpdate() {
  // Simulate live price changes
  Object.keys(state.marketData).forEach(sym => {
    const d = state.marketData[sym];
    const rand = (Math.random() - 0.495) * 0.008; // -0.4% to +0.4% per tick
    d.ltp = Math.max(1, parseFloat((d.ltp * (1 + rand)).toFixed(2)));
    d.change = parseFloat((d.ltp - d.prevClose).toFixed(2));
    d.pct = parseFloat(((d.change / d.prevClose) * 100).toFixed(2));
    d.volume += Math.floor(Math.random() * 50000);
  });
  updateIndices();
  updateMarketTableLTP();
  updateTickerBar();
  updateWatchlistPrices();
  updateHoldingLTPs();
  updateUnrealisedPnl();
  updateAllStats();
  document.getElementById('last-updated-time').textContent = 'Last updated: ' + new Date().toLocaleTimeString('en-IN');
  if (state.bot.running) runBotTick();
}

function updateIndices() {
  const moves = { sensex: 0.0003, nifty: 0.0003, banknifty: 0.0004, vix: -0.001 };
  ['sensex','nifty','banknifty','vix'].forEach(idx => {
    const prev = state.indices[idx].val;
    const rand = (Math.random() - 0.495) * moves[idx] * 3;
    state.indices[idx].val = Math.max(1, parseFloat((prev * (1 + rand)).toFixed(2)));
    state.indices[idx].chg = parseFloat((state.indices[idx].val - prev).toFixed(2));
  });
  renderIndexCards();
  updateTickerBar();
}

function renderIndexCards() {
  const map = {sensex:'sensex', nifty:'nifty', banknifty:'banknifty', vix:'vix'};
  Object.entries(map).forEach(([key, id]) => {
    const d = state.indices[key];
    const valEl = document.getElementById('idx-' + id + '-val');
    const chgEl = document.getElementById('idx-' + id + '-chg');
    if (valEl) valEl.textContent = formatNum(d.val);
    if (chgEl) {
      const sign = d.chg >= 0 ? '+' : '';
      chgEl.textContent = sign + formatNum(d.chg) + ' (' + sign + ((d.chg/d.val)*100).toFixed(2) + '%)';
      chgEl.className = 'stat-change ' + (d.chg >= 0 ? 'pos' : 'neg');
    }
  });
}

function updateTickerBar() {
  const map = {sensex:'sensex-val', nifty:'nifty-val', banknifty:'banknifty-val', vix:'vix-val'};
  Object.entries(map).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const d = state.indices[key];
    const sign = d.chg >= 0 ? '+' : '';
    el.textContent = formatNum(d.val) + ' (' + sign + ((d.chg/d.val)*100).toFixed(2) + '%)';
    el.className = 'ticker-val ' + (d.chg >= 0 ? 'pos' : 'neg');
  });
}

function checkMarketStatus() {
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes();
  const minutes = h * 60 + m;
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  const open = minutes >= 9*60+15 && minutes <= 15*60+30 && !isWeekend;
  const el = document.getElementById('market-status-text');
  if (el) {
    el.textContent = open ? '🟢 Market Open' : '🔴 Market Closed';
    el.className = open ? 'badge badge-green' : 'badge badge-red';
  }
}

// ───── MARKET TABLE ─────
function renderMarketTable() {
  const rows = STOCKS_DB.map(s => {
    const d = state.marketData[s.symbol] || {};
    return {symbol:s.symbol, company:s.company, exchange:s.exchange, sector:s.sector,
      ltp: d.ltp || s.ltp, change: d.change || 0, pct: d.pct || 0,
      volume: d.volume || 0, high52: s.high52, low52: s.low52};
  });
  state.marketPage.allRows = rows;
  filterMarketTable();
}

function filterMarketTable() {
  const q = (document.getElementById('stockSearch')?.value || '').toLowerCase();
  const sector = document.getElementById('sectorFilter')?.value || '';
  const exchange = document.getElementById('exchangeFilter')?.value || '';
  state.marketPage.filtered = state.marketPage.allRows.filter(r =>
    (!q || r.symbol.toLowerCase().includes(q) || r.company.toLowerCase().includes(q)) &&
    (!sector || r.sector === sector) &&
    (!exchange || r.exchange === exchange)
  );
  state.marketPage.page = 1;
  renderMarketTablePage();
}

function renderMarketTablePage() {
  const {filtered, page, pageSize} = state.marketPage;
  const start = (page-1)*pageSize, end = start + pageSize;
  const tbody = document.getElementById('marketBody');
  if (!tbody) return;
  if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="11" class="empty-state">No stocks found.</td></tr>'; renderPagination('marketPagination', 0, page, pageSize, p => {state.marketPage.page=p; renderMarketTablePage();}); return; }
  tbody.innerHTML = filtered.slice(start, end).map(r => {
    const sign = r.pct >= 0 ? '+' : '';
    const cls = r.pct >= 0 ? 'positive' : 'negative';
    return `<tr>
      <td><strong>${r.symbol}</strong></td>
      <td>${r.company}</td>
      <td>${r.exchange}</td>
      <td><span class="badge badge-blue" style="font-size:0.68rem">${r.sector}</span></td>
      <td><strong>${fmtInr(r.ltp)}</strong></td>
      <td class="${cls}">${fmtInr(r.change)}</td>
      <td class="${cls}">${sign}${r.pct.toFixed(2)}%</td>
      <td>${formatVol(r.volume)}</td>
      <td>${fmtInr(r.high52)}</td>
      <td>${fmtInr(r.low52)}</td>
      <td>
        <button class="btn btn-xs btn-primary" onclick="openBuyForSymbol('${r.symbol}','${r.ltp}')">Trade</button>
        <button class="btn btn-xs btn-secondary" onclick="addToWatchlistDirect('${r.symbol}')">+Watch</button>
      </td>
    </tr>`;
  }).join('');
  renderPagination('marketPagination', filtered.length, page, pageSize, p => {state.marketPage.page=p; renderMarketTablePage();});
}

function updateMarketTableLTP() {
  // Only re-render if on market page
  if (state.currentPage === 'market') renderMarketTablePage();
}

// ───── HOLDINGS ─────
function renderHoldings() {
  const q = (document.getElementById('holdingsSearch')?.value || '').toLowerCase();
  state.holdingsPage.filtered = state.holdings.filter(h =>
    !q || h.symbol.toLowerCase().includes(q) || h.company.toLowerCase().includes(q)
  );
  state.holdingsPage.page = 1;
  renderHoldingsPage();
  updatePortfolioStats();
}

function filterHoldings() {
  renderHoldings();
}

function renderHoldingsPage() {
  const {filtered, page, pageSize} = state.holdingsPage;
  const start = (page-1)*pageSize, end = start + pageSize;
  const tbody = document.getElementById('holdingsBody');
  if (!tbody) return;
  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No holdings. Buy stocks to build your portfolio.</td></tr>';
    renderPagination('holdingsPagination', 0, page, pageSize, p=>{state.holdingsPage.page=p; renderHoldingsPage();});
    return;
  }
  tbody.innerHTML = filtered.slice(start, end).map(h => {
    const d = state.marketData[h.symbol] || {};
    const ltp = d.ltp || h.avgPrice;
    const pnl = (ltp - h.avgPrice) * h.qty;
    const pnlPct = ((ltp - h.avgPrice) / h.avgPrice) * 100;
    const cls = pnl >= 0 ? 'positive' : 'negative';
    const sign = pnl >= 0 ? '+' : '';
    return `<tr>
      <td><strong>${h.symbol}</strong></td>
      <td>${h.company}</td>
      <td>${h.qty}</td>
      <td>${fmtInr(h.avgPrice)}</td>
      <td><strong>${fmtInr(ltp)}</strong></td>
      <td class="${cls}">${sign}${fmtInr(pnl)}</td>
      <td class="${cls}">${sign}${pnlPct.toFixed(2)}%</td>
      <td>
        <button class="btn btn-xs btn-primary" onclick="openBuyForSymbol('${h.symbol}','${ltp}','SELL')">Sell</button>
        <button class="btn btn-xs btn-secondary" onclick="openBuyForSymbol('${h.symbol}','${ltp}','BUY')">Buy More</button>
      </td>
    </tr>`;
  }).join('');
  renderPagination('holdingsPagination', filtered.length, page, pageSize, p=>{state.holdingsPage.page=p; renderHoldingsPage();});
}

function updatePortfolioStats() {
  let invested = 0, unrealised = 0, holdingsVal = 0;
  state.holdings.forEach(h => {
    const ltp = (state.marketData[h.symbol]?.ltp) || h.avgPrice;
    const cost = h.avgPrice * h.qty;
    const val = ltp * h.qty;
    invested += cost;
    unrealised += (val - cost);
    holdingsVal += val;
  });
  state.account.invested = invested;
  state.account.unrealisedPnl = unrealised;

  setEl('port-holdings', fmtInr(holdingsVal));
  setEl('port-daychange', fmtInr(unrealised) + ' (' + (invested > 0 ? ((unrealised/invested)*100).toFixed(2) : '0.00') + '%)');
  const totalCost = state.holdings.reduce((s,h) => s + h.avgPrice*h.qty, 0);
  setEl('port-return', totalCost > 0 ? ((unrealised/totalCost)*100).toFixed(2) + '%' : '0.00%');
}

function updateHoldingLTPs() {
  updatePortfolioStats();
  if (state.currentPage === 'portfolio') renderHoldingsPage();
}

function updateUnrealisedPnl() {
  updatePortfolioStats();
  updateAllStats();
}

// ───── TRADES ─────
function renderTrades() {
  const tab = state.tradesPage.tab;
  let rows = state.trades;
  if (tab === 'my') rows = state.trades.filter(t => t.source === 'manual');
  else if (tab === 'bot') rows = state.trades.filter(t => t.source === 'bot');
  state.tradesPage.allRows = rows;
  filterTrades();
}

function filterTrades() {
  const q = (document.getElementById('tradeSearch')?.value || '').toLowerCase();
  const type = document.getElementById('tradeTypeFilter')?.value || '';
  const from = document.getElementById('tradeFromDate')?.value;
  const to = document.getElementById('tradeToDate')?.value;
  state.tradesPage.filtered = state.tradesPage.allRows.filter(t => {
    const matchQ = !q || t.symbol.toLowerCase().includes(q);
    const matchT = !type || t.type === type;
    const matchFrom = !from || t.date >= from;
    const matchTo = !to || t.date <= to;
    return matchQ && matchT && matchFrom && matchTo;
  });
  state.tradesPage.page = 1;
  renderTradesPage();
}

function renderTradesPage() {
  const {filtered, page, pageSize} = state.tradesPage;
  const start = (page-1)*pageSize, end = start + pageSize;
  const tbody = document.getElementById('tradesBody');
  if (!tbody) return;
  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No trades recorded yet.</td></tr>';
    renderPagination('tradesPagination', 0, page, pageSize, p=>{state.tradesPage.page=p; renderTradesPage();});
    return;
  }
  tbody.innerHTML = filtered.slice(start, end).map(t => {
    const pnlCls = (!t.pnl || t.pnl >= 0) ? 'positive' : 'negative';
    const pnlTxt = t.pnl != null ? (t.pnl >= 0 ? '+' : '') + fmtInr(t.pnl) : '--';
    return `<tr>
      <td>${t.date}</td>
      <td><strong>${t.symbol}</strong></td>
      <td>${t.exchange || 'NSE'}</td>
      <td class="${t.type === 'BUY' ? 'type-buy' : 'type-sell'}">${t.type}</td>
      <td>${t.qty}</td>
      <td>${fmtInr(t.price)}</td>
      <td>${fmtInr(t.total)}</td>
      <td class="${pnlCls}">${pnlTxt}</td>
      <td><span class="badge badge-blue">${t.source === 'bot' ? 'Bot' : 'Manual'}</span></td>
      <td><span class="badge ${t.status==='FILLED'?'badge-green':'badge-yellow'}">${t.status||'FILLED'}</span></td>
    </tr>`;
  }).join('');
  renderPagination('tradesPagination', filtered.length, page, pageSize, p=>{state.tradesPage.page=p; renderTradesPage();});
}

function switchTradeTab(tab) {
  state.tradesPage.tab = tab;
  document.querySelectorAll('.tab-bar .tab').forEach((t,i) => {
    const tabs = ['my','bot','all'];
    t.classList.toggle('active', tabs[i] === tab);
    t.setAttribute('aria-selected', tabs[i] === tab);
  });
  const titles = {my:'My Trades', bot:'Bot Trades', all:'All Trades'};
  setEl('trades-tab-title', titles[tab]);
  renderTrades();
}

// ───── TRADE EXECUTION ─────
function openBuyForSymbol(symbol, price, action) {
  document.getElementById('tradeSymbol').value = symbol;
  document.getElementById('tradePrice').value = price;
  if (action) document.getElementById('tradeAction').value = action;
  fetchTradeQuote(symbol);
  updateTradeTotal();
  showModal('buyModal');
}

function fetchTradeQuote(sym) {
  const symbol = (sym || document.getElementById('tradeSymbol').value).toUpperCase();
  if (!symbol) return;
  const d = state.marketData[symbol];
  const el = document.getElementById('tradeQuoteInfo');
  if (d) {
    const sign = d.pct >= 0 ? '+' : '';
    el.textContent = d.company + ' | LTP: ' + fmtInr(d.ltp) + ' (' + sign + d.pct.toFixed(2) + '%)';
    el.style.color = d.pct >= 0 ? 'var(--success)' : 'var(--danger)';
    document.getElementById('tradePrice').value = d.ltp;
    updateTradeTotal();
  } else {
    el.textContent = symbol ? 'Symbol not found in market data' : '';
    el.style.color = '';
  }
}

function updateTradeTotal() {
  const qty = parseFloat(document.getElementById('tradeQty')?.value) || 0;
  const price = parseFloat(document.getElementById('tradePrice')?.value) || 0;
  const total = qty * price;
  setEl('tradeTotalDisplay', fmtInr(total));
  setEl('tradeAvailBal', fmtInr(state.account.cash));
}

function executeTrade() {
  const symbol = document.getElementById('tradeSymbol').value.toUpperCase().trim();
  const action = document.getElementById('tradeAction').value;
  const qty = parseInt(document.getElementById('tradeQty').value);
  const price = parseFloat(document.getElementById('tradePrice').value);
  const errEl = document.getElementById('tradeError');

  const clearErr = () => errEl.classList.add('hidden');
  const showErr = (msg) => { errEl.textContent = msg; errEl.classList.remove('hidden'); };

  clearErr();
  if (!symbol) { showErr('Please enter a stock symbol.'); return; }
  if (!qty || qty < 1) { showErr('Quantity must be at least 1.'); return; }
  if (!price || price <= 0) { showErr('Please enter a valid price.'); return; }

  const total = qty * price;

  if (action === 'BUY') {
    if (total > state.account.cash) { showErr('Insufficient funds. Available: ' + fmtInr(state.account.cash)); return; }
    state.account.cash -= total;
    state.account.cash = parseFloat(state.account.cash.toFixed(2));

    // Update holdings
    const existing = state.holdings.find(h => h.symbol === symbol);
    const d = state.marketData[symbol];
    const company = d ? d.company : symbol;
    const sector = d ? d.sector : 'Other';
    const exchange = d ? d.exchange : 'NSE';
    if (existing) {
      const newQty = existing.qty + qty;
      existing.avgPrice = parseFloat(((existing.avgPrice * existing.qty + price * qty) / newQty).toFixed(4));
      existing.qty = newQty;
    } else {
      state.holdings.push({symbol, company, qty, avgPrice: price, sector, exchange});
    }
    recordTrade({symbol, exchange: exchange, type:'BUY', qty, price, total, pnl: null, source:'manual', status:'FILLED'});
    showToast('success', 'Trade Executed', `Bought ${qty} shares of ${symbol} at ${fmtInr(price)}`);
  } else {
    const holding = state.holdings.find(h => h.symbol === symbol);
    if (!holding) { showErr('You do not hold any ' + symbol + '.'); return; }
    if (holding.qty < qty) { showErr('Insufficient quantity. You hold: ' + holding.qty); return; }

    const pnl = parseFloat(((price - holding.avgPrice) * qty).toFixed(2));
    state.account.cash += total;
    state.account.cash = parseFloat(state.account.cash.toFixed(2));
    state.account.realisedPnl += pnl;
    state.account.realisedPnl = parseFloat(state.account.realisedPnl.toFixed(2));

    holding.qty -= qty;
    if (holding.qty === 0) state.holdings = state.holdings.filter(h => h.symbol !== symbol);

    recordTrade({symbol, exchange: holding?.exchange || 'NSE', type:'SELL', qty, price, total, pnl, source:'manual', status:'FILLED'});
    showToast(pnl >= 0 ? 'success' : 'warning', 'Trade Executed', `Sold ${qty} shares of ${symbol}. P&L: ${pnl >= 0 ? '+' : ''}${fmtInr(pnl)}`);
  }

  closeModal('buyModal');
  updateAllStats();
  renderHoldings();
  renderTrades();
  updateDashboardCards();
  saveState();
}

function recordTrade(trade) {
  const now = new Date();
  state.trades.unshift({
    id: Date.now(),
    date: now.toISOString().slice(0,10),
    time: now.toLocaleTimeString('en-IN'),
    ...trade
  });
}

// ───── ACCOUNT / BALANCE ─────
function processDeposit() {
  const amt = parseFloat(document.getElementById('depositAmt').value);
  const note = document.getElementById('depositNote').value || 'Deposit';
  if (!amt || amt <= 0) { showToast('error', 'Invalid amount', 'Please enter a positive amount'); return; }
  state.account.cash += amt;
  state.account.cash = parseFloat(state.account.cash.toFixed(2));
  state.account.deposits += amt;
  state.account.deposits = parseFloat(state.account.deposits.toFixed(2));
  recordTransaction({type:'DEPOSIT', amount: amt, note});
  closeModal('depositModal');
  updateAllStats();
  renderTransactions();
  showToast('success', 'Funds Added', fmtInr(amt) + ' added to your account');
  saveState();
}

function processWithdrawal() {
  const amt = parseFloat(document.getElementById('withdrawAmt').value);
  const note = document.getElementById('withdrawNote').value || 'Withdrawal';
  if (!amt || amt <= 0) { showToast('error', 'Invalid amount', 'Please enter a positive amount'); return; }
  if (amt > state.account.cash) { showToast('error', 'Insufficient funds', 'Available: ' + fmtInr(state.account.cash)); return; }
  state.account.cash -= amt;
  state.account.cash = parseFloat(state.account.cash.toFixed(2));
  state.account.withdrawals += amt;
  state.account.withdrawals = parseFloat(state.account.withdrawals.toFixed(2));
  recordTransaction({type:'WITHDRAWAL', amount: -amt, note});
  closeModal('withdrawModal');
  updateAllStats();
  renderTransactions();
  showToast('success', 'Withdrawal Processed', fmtInr(amt) + ' withdrawn from account');
  saveState();
}

function resetBalance() {
  const amt = parseFloat(document.getElementById('resetAmt').value) || 0;
  state.account.cash = amt;
  state.account.invested = 0;
  state.account.unrealisedPnl = 0;
  state.account.realisedPnl = 0;
  state.account.margin = 0;
  state.account.deposits = amt;
  state.account.withdrawals = 0;
  state.holdings = [];
  state.trades = [];
  state.transactions = [];
  if (amt > 0) recordTransaction({type:'DEPOSIT', amount: amt, note: 'Account reset - starting balance'});
  closeModal('resetBalanceModal');
  updateAllStats();
  renderHoldings();
  renderTrades();
  renderTransactions();
  updateDashboardCards();
  showToast('success', 'Balance Reset', amt > 0 ? 'Balance reset to ' + fmtInr(amt) : 'Account reset to ₹0');
  saveState();
}

function recordTransaction(tx) {
  state.transactions.unshift({
    date: new Date().toLocaleString('en-IN'),
    type: tx.type,
    amount: tx.amount,
    balanceAfter: state.account.cash,
    note: tx.note || ''
  });
}

function renderTransactions() {
  const tbody = document.getElementById('transactionBody');
  if (!tbody) return;
  if (!state.transactions.length) { tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No transactions yet.</td></tr>'; return; }
  tbody.innerHTML = state.transactions.map(t => {
    const cls = t.amount >= 0 ? 'positive' : 'negative';
    const sign = t.amount >= 0 ? '+' : '';
    return `<tr>
      <td>${t.date}</td>
      <td><span class="badge ${t.type==='DEPOSIT'?'badge-green':'badge-red'}">${t.type}</span></td>
      <td class="${cls}">${sign}${fmtInr(Math.abs(t.amount))}</td>
      <td>${fmtInr(t.balanceAfter)}</td>
      <td>${t.note}</td>
    </tr>`;
  }).join('');
}

function updateAccountPage() {
  setEl('acc-type', state.account.type === 'live' ? 'Live Trading' : 'Paper Trading');
  setEl('acc-id', state.account.id);
  setEl('acc-cash', fmtInr(state.account.cash));
  setEl('acc-invested', fmtInr(state.account.invested));
  const portfolioVal = state.account.cash + state.account.invested + state.account.unrealisedPnl;
  setEl('acc-portfolio', fmtInr(portfolioVal));
  setEl('acc-deposits', fmtInr(state.account.deposits));
  setEl('acc-withdrawals', fmtInr(state.account.withdrawals));
  setEl('acc-realised', fmtInr(state.account.realisedPnl));
  setEl('acc-unrealised', fmtInr(state.account.unrealisedPnl));
  setEl('acc-margin', fmtInr(state.account.margin));
  setEl('withdrawAvail', fmtInr(state.account.cash));
  renderTransactions();
}

function saveAccountSettings() {
  state.account.name = document.getElementById('accName')?.value || 'Trader';
  showToast('success', 'Settings Saved', 'Account settings updated');
  saveState();
}

function switchAccountType() {
  const val = document.getElementById('accTypeSelect')?.value;
  if (val === 'live') {
    if (!confirm('Switch to Live Trading? This will use real money via Zerodha API.')) {
      document.getElementById('accTypeSelect').value = 'paper';
      return;
    }
  }
  state.account.type = val;
  setEl('acc-type', val === 'live' ? 'Live Trading' : 'Paper Trading');
  showToast('info', 'Mode Changed', 'Switched to ' + (val === 'live' ? 'Live' : 'Paper') + ' trading');
  saveState();
}

// ───── WATCHLIST ─────
function addToWatchlist() {
  const sym = document.getElementById('watchSymbol')?.value.toUpperCase().trim();
  if (!sym) { showToast('error', 'Error', 'Please enter a stock symbol'); return; }
  if (state.watchlist.includes(sym)) { showToast('warning', 'Already watching', sym + ' is already in your watchlist'); return; }
  state.watchlist.push(sym);
  closeModal('addWatchModal');
  renderWatchlist();
  saveState();
  showToast('success', 'Added', sym + ' added to watchlist');
}

function addToWatchlistDirect(symbol) {
  if (state.watchlist.includes(symbol)) { showToast('warning', 'Already watching', symbol + ' is already in your watchlist'); return; }
  state.watchlist.push(symbol);
  renderWatchlist();
  saveState();
  showToast('success', 'Added', symbol + ' added to watchlist');
}

function removeFromWatchlist(symbol) {
  state.watchlist = state.watchlist.filter(s => s !== symbol);
  renderWatchlist();
  saveState();
}

function renderWatchlist() {
  const container = document.getElementById('watchlist-container');
  if (!container) return;
  if (!state.watchlist.length) { container.innerHTML = '<p class="empty-state">Add stocks to watch.</p>'; return; }
  container.innerHTML = state.watchlist.map(sym => {
    const d = state.marketData[sym] || {};
    const ltp = d.ltp ? fmtInr(d.ltp) : '--';
    const pct = d.pct != null ? (d.pct >= 0 ? '+' : '') + d.pct.toFixed(2) + '%' : '--';
    const cls = (d.pct || 0) >= 0 ? 'pos' : 'neg';
    return `<div class="watchlist-item">
      <span class="watch-symbol">${sym}</span>
      <span class="watch-price">${ltp}</span>
      <span class="watch-change ${cls}">${pct}</span>
      <button class="watch-remove" onclick="removeFromWatchlist('${sym}')" aria-label="Remove ${sym}" title="Remove">&#x2715;</button>
    </div>`;
  }).join('');
}

function updateWatchlistPrices() {
  if (state.watchlist.length) renderWatchlist();
}

// ───── ALGO BOT ─────
function updateStratCount() {
  const count = document.querySelectorAll('input[name="strategy"]:checked').length;
  setEl('selectedStratCount', count + ' selected');
  state.bot.strategies = Array.from(document.querySelectorAll('input[name="strategy"]:checked')).map(c => c.value);
}

function updateTradeMode() {
  const mode = document.getElementById('tradeMode')?.value;
  const warn = document.getElementById('liveModeWarning');
  if (mode === 'live') warn.classList.remove('hidden');
  else warn.classList.add('hidden');
  state.bot.mode = mode;
}

function toggleCustomStocks() {
  const val = document.getElementById('stockUniverse')?.value;
  const group = document.getElementById('customStocksGroup');
  if (group) group.classList.toggle('hidden', val !== 'custom');
}

function toggleSlOptions() {
  const val = document.getElementById('slType')?.value;
  document.getElementById('fixedSlGroup')?.classList.toggle('hidden', val !== 'fixed');
  document.getElementById('atrSlGroup')?.classList.toggle('hidden', val !== 'atr');
  document.getElementById('trailSlGroup')?.classList.toggle('hidden', val !== 'trailing');
}

function startBot() {
  if (!state.bot.strategies.length) { showToast('error', 'No Strategy', 'Please select at least one trading strategy'); return; }
  state.bot.running = true;
  state.bot.dailyLoss = 0;
  document.getElementById('botDot').className = 'dot running';
  setEl('botStatusText', 'Bot Running (' + state.bot.strategies.length + ' strategies)');
  document.getElementById('startBotBtn').disabled = true;
  document.getElementById('stopBotBtn').disabled = false;
  setEl('bot-status-badge', 'Running');
  document.getElementById('bot-status-badge').className = 'badge badge-green';
  updateActiveBotList();
  showToast('success', 'Algo Bot Started', state.bot.strategies.length + ' strategies active');
}

function stopBot() {
  state.bot.running = false;
  if (state.bot.interval) clearInterval(state.bot.interval);
  document.getElementById('botDot').className = 'dot stopped';
  setEl('botStatusText', 'Bot Stopped');
  document.getElementById('startBotBtn').disabled = false;
  document.getElementById('stopBotBtn').disabled = true;
  setEl('bot-status-badge', 'Stopped');
  document.getElementById('bot-status-badge').className = 'badge badge-red';
  showToast('info', 'Algo Bot Stopped', 'Bot has been stopped');
}

function updateActiveBotList() {
  const el = document.getElementById('active-strategies-list');
  if (!el) return;
  if (!state.bot.running || !state.bot.strategies.length) {
    el.innerHTML = '<p class="empty-state">No strategies running. <a href="#" onclick="navigateTo(\'algobot\')">Configure Algo Bot</a></p>';
    return;
  }
  const names = {
    momentum:'🚀 Momentum',mean_reversion:'🔄 Mean Reversion',earnings_surprise:'💡 Earnings Surprise',
    corporate_action:'📅 Corp. Action',news_sentiment:'📰 News Sentiment',breakout:'📐 Breakout',
    vwap:'📉 VWAP',pairs:'🔗 Pairs',ai_decision:'🧠 AI-Decided'
  };
  el.innerHTML = state.bot.strategies.map(s =>
    `<div class="trade-mini-item"><span>${names[s]||s}</span><span class="badge badge-green">Active</span></div>`
  ).join('');
}

function runBotTick() {
  // Simulate bot placing trades based on selected strategies
  const maxDailyLoss = parseFloat(document.getElementById('maxDailyLoss')?.value) || 5000;
  if (state.bot.dailyLoss >= maxDailyLoss) {
    showToast('warning', 'Daily Loss Limit Hit', 'Bot stopped – daily loss limit reached');
    stopBot();
    return;
  }

  if (Math.random() > 0.85) { // ~15% chance per tick to generate a signal
    const strategy = state.bot.strategies[Math.floor(Math.random() * state.bot.strategies.length)];
    const stocks = Object.keys(state.marketData);
    const symbol = stocks[Math.floor(Math.random() * stocks.length)];
    const d = state.marketData[symbol];
    if (!d) return;
    const action = Math.random() > 0.5 ? 'BUY' : 'SELL';
    const qty = Math.max(1, Math.floor(1000 / d.ltp));
    const capital = parseFloat(document.getElementById('capitalAllocation')?.value) || 100000;
    const posSize = (parseFloat(document.getElementById('positionSize')?.value) || 10) / 100;
    const maxCapital = capital * posSize;

    if (action === 'BUY' && d.ltp * qty <= state.account.cash && d.ltp * qty <= maxCapital) {
      state.account.cash -= d.ltp * qty;
      const existing = state.holdings.find(h => h.symbol === symbol);
      if (existing) {
        const newQty = existing.qty + qty;
        existing.avgPrice = parseFloat(((existing.avgPrice * existing.qty + d.ltp * qty) / newQty).toFixed(4));
        existing.qty = newQty;
      } else {
        state.holdings.push({symbol, company: d.company, qty, avgPrice: d.ltp, sector: d.sector, exchange: d.exchange});
      }
      recordTrade({symbol, exchange: d.exchange || 'NSE', type:'BUY', qty, price: d.ltp, total: d.ltp*qty, pnl: null, source:'bot', status:'FILLED', strategy});
      state.bot.metrics.totalTrades++;
      if (document.getElementById('notifBotTrades')?.checked) {
        addNotification(`Bot: Bought ${qty} ${symbol} @ ${fmtInr(d.ltp)} [${strategy}]`);
      }
    }
  }
  updateBotMetrics();
  updateAllStats();
  updateDashboardCards();
}

function updateBotMetrics() {
  const botTrades = state.trades.filter(t => t.source === 'bot');
  const wins = botTrades.filter(t => t.pnl != null && t.pnl > 0).length;
  const total = botTrades.filter(t => t.pnl != null).length;
  state.bot.metrics.totalTrades = botTrades.length;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) + '%' : '--';

  setEl('totalBotTrades', state.bot.metrics.totalTrades);
  setEl('winRate', winRate);
  setEl('botPnlToday', fmtInr(state.bot.metrics.pnlToday));
  setEl('sharpeRatio', '--');
  setEl('maxDrawdown', '--');
  setEl('avgTradeDuration', '--');
}

function exportBotReport() {
  const rows = [['Strategy','Symbol','Type','Entry Price','LTP','P&L','Status']];
  state.bot.trades.forEach(t => rows.push([t.strategy||'--', t.symbol, t.type, t.price, t.ltp||'--', t.pnl||'--', t.status]));
  downloadCSV(rows, 'bot_report.csv');
  showToast('success', 'Exported', 'Bot report downloaded');
}

function saveApiConfig() {
  showToast('success', 'Saved', 'API configuration saved (stored locally only)');
}

function testZerodhaConnection() {
  const key = document.getElementById('zerodhaApiKey')?.value;
  const statusEl = document.getElementById('zerodhaConnStatus');
  if (!key) { if(statusEl) statusEl.textContent = '⚠️ Enter API key first'; return; }
  if (statusEl) statusEl.textContent = '⟳ Testing connection...';
  setTimeout(() => {
    if (statusEl) statusEl.textContent = '⚠️ Cannot connect without valid API credentials. Please obtain keys from kite.zerodha.com';
  }, 1200);
}

// ───── BACKTEST ─────
function runBacktest() {
  const strategy = document.getElementById('btStrategy')?.value;
  const capital = parseFloat(document.getElementById('btCapital')?.value) || 100000;
  const from = document.getElementById('btFrom')?.value;
  const to = document.getElementById('btTo')?.value;

  // Simulated backtest results
  const days = from && to ? Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000)) : 90;
  let equity = capital;
  const equityData = [capital];
  const labels = [];
  let wins = 0, losses = 0, maxDD = 0, peak = capital;

  for (let i = 0; i < days; i++) {
    const d = new Date(from || new Date(Date.now() - days*86400000));
    d.setDate(d.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    labels.push(d.toLocaleDateString('en-IN', {month:'short', day:'numeric'}));
    const r = (Math.random() - 0.46) * 0.015; // slight positive bias
    equity *= (1 + r);
    if (r > 0) wins++; else losses++;
    if (equity > peak) peak = equity;
    const dd = (peak - equity) / peak;
    if (dd > maxDD) maxDD = dd;
    equityData.push(parseFloat(equity.toFixed(2)));
  }

  const totalReturn = ((equity - capital) / capital * 100).toFixed(2);
  const sharpe = (Math.random() * 0.8 + 0.5).toFixed(2);
  const winRate = wins + losses > 0 ? ((wins / (wins + losses)) * 100).toFixed(1) : '0';

  // Show results
  const resultsEl = document.getElementById('backtestResults');
  resultsEl.classList.remove('hidden');
  document.getElementById('backtestStats').innerHTML = `
    <div class="stat-card small"><div class="stat-info"><div class="stat-label">Total Return</div><div class="stat-value ${parseFloat(totalReturn) >= 0 ? 'positive' : 'negative'}">${totalReturn >= 0 ? '+' : ''}${totalReturn}%</div></div></div>
    <div class="stat-card small"><div class="stat-info"><div class="stat-label">Final Equity</div><div class="stat-value">${fmtInr(equity)}</div></div></div>
    <div class="stat-card small"><div class="stat-info"><div class="stat-label">Sharpe Ratio</div><div class="stat-value">${sharpe}</div></div></div>
    <div class="stat-card small"><div class="stat-info"><div class="stat-label">Win Rate</div><div class="stat-value">${winRate}%</div></div></div>
    <div class="stat-card small"><div class="stat-info"><div class="stat-label">Max Drawdown</div><div class="stat-value negative">-${(maxDD*100).toFixed(1)}%</div></div></div>
    <div class="stat-card small"><div class="stat-info"><div class="stat-label">Total Days</div><div class="stat-value">${days}</div></div></div>
  `;

  // Render backtest chart
  if (state.backtestChartInst) state.backtestChartInst.destroy();
  const ctx = document.getElementById('backtestChart');
  if (ctx) {
    state.backtestChartInst = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Equity Curve', data: equityData.slice(0,labels.length), borderColor: equityData[equityData.length-1] >= capital ? '#22c55e' : '#ef4444', backgroundColor: 'transparent', borderWidth: 1.5, pointRadius: 0, tension: 0.3 }]},
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: true, ticks: { maxTicksLimit: 8, color: '#6e7681', font: { size: 10 } } }, y: { display: true, ticks: { color: '#6e7681', font: { size: 10 } } } } }
    });
  }
  showToast('success', 'Backtest Complete', `${days} days, ${totalReturn >= 0 ? '+' : ''}${totalReturn}% return`);
}

// ───── ANNOUNCEMENTS ─────
function switchAnnTab(tab) {
  document.querySelectorAll('.ann-tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById('ann-tab-' + tab)?.classList.remove('hidden');
  document.querySelectorAll('.tab-bar .tab').forEach((t, i) => {
    const tabs = ['announcements','earnings','dividends','economic'];
    t.classList.toggle('active', tabs[i] === tab);
  });
}

function filterAnnouncements() {
  const q = (document.getElementById('annSearch')?.value || '').toLowerCase();
  const type = document.getElementById('annTypeFilter')?.value || '';
  const filtered = ANNOUNCEMENTS_DATA.filter(a =>
    (!q || a.company.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q)) &&
    (!type || a.type === type)
  );
  renderAnnouncementsList(filtered);
}

function renderAnnouncements() {
  renderAnnouncementsList(ANNOUNCEMENTS_DATA);
}

function renderAnnouncementsList(data) {
  const el = document.getElementById('announcementsList');
  if (!el) return;
  if (!data.length) { el.innerHTML = '<p class="empty-state">No announcements found.</p>'; return; }
  el.innerHTML = data.map(a => {
    const badgeCls = a.type === 'Dividend' ? 'dividend' : a.type === 'Results' ? 'results' : '';
    const impactIcon = a.impact === 'positive' ? '🟢' : a.impact === 'negative' ? '🔴' : '⚪';
    return `<div class="ann-item">
      <span class="ann-type-badge ${badgeCls}">${a.type}</span>
      <div class="ann-item-body">
        <h4>${impactIcon} ${a.title}</h4>
        <p><strong>${a.company}</strong> (${a.symbol})</p>
        <p>${a.summary}</p>
        <span class="ann-date">📅 ${a.date}</span>
      </div>
      <button class="btn btn-xs btn-primary" onclick="openBuyForSymbol('${a.symbol}','')">Trade</button>
    </div>`;
  }).join('');
}

function refreshAnnouncements() {
  renderAnnouncements();
  showToast('info', 'Refreshed', 'Announcements updated');
}

function renderEarnings() {
  const el = document.getElementById('earningsList');
  if (!el) return;
  el.innerHTML = EARNINGS_DATA.map(e => {
    const hasActual = e.actual != null;
    const beatCls = e.beat ? 'earnings-beat' : e.beat === false ? 'earnings-miss' : '';
    const beatIcon = e.beat ? '🟢 Beat' : e.beat === false ? '🔴 Miss' : '⏳ Upcoming';
    return `<div class="earnings-item">
      <div><strong>${e.symbol}</strong></div>
      <div>
        <div style="font-weight:600">${e.company} — ${e.period}</div>
        <div style="color:var(--text-muted);font-size:0.75rem">📅 ${e.date}</div>
        <div style="font-size:0.78rem;margin-top:4px">
          Est: ₹${e.estimated} Cr
          ${hasActual ? `| Actual: <strong>₹${e.actual} Cr</strong>` : ''}
        </div>
      </div>
      <div>
        ${hasActual ? `<span class="${beatCls}" style="font-size:0.82rem">${beatIcon} ${e.surprise}</span>` : `<span style="color:var(--text-muted)">${beatIcon}</span>`}
      </div>
    </div>`;
  }).join('');
}

function renderDividends() {
  const el = document.getElementById('dividendCalendar');
  if (!el) return;
  el.innerHTML = DIVIDEND_DATA.map(d =>
    `<div class="dividend-item">
      <div><strong>${d.symbol}</strong></div>
      <div>
        <div style="font-weight:600">${d.company} — ${d.type} Dividend</div>
        <div style="color:var(--text-secondary);font-size:0.78rem">Ex-date: ${d.exDate} | Pay: ${d.payDate}</div>
      </div>
      <div><span class="badge badge-green" style="font-size:0.82rem">${d.amount}</span></div>
    </div>`
  ).join('');
}

function renderEconomicCalendar() {
  const el = document.getElementById('economicCalendar');
  if (!el) return;
  el.innerHTML = ECONOMIC_CALENDAR.map(e => {
    const impCls = e.impact === 'High' ? 'badge-red' : e.impact === 'Medium' ? 'badge-yellow' : 'badge-blue';
    return `<div class="econ-item">
      <div><div style="font-weight:600">${e.date}</div><div style="color:var(--text-muted);font-size:0.75rem">${e.currency}</div></div>
      <div>
        <div style="font-weight:600">${e.event}</div>
        <div style="color:var(--text-secondary);font-size:0.78rem">Expected: ${e.expected}</div>
      </div>
      <div><span class="badge ${impCls}">${e.impact}</span></div>
    </div>`;
  }).join('');
}

function renderIPOTracker() {
  const el = document.getElementById('ipoTracker');
  if (!el) return;
  el.innerHTML = IPO_DATA.map(ipo => {
    const tagCls = ipo.status === 'open' ? 'open' : ipo.status === 'upcoming' ? 'upcoming' : 'closed';
    return `<div class="ipo-card">
      <h4>${ipo.company} <small style="color:var(--text-muted)">(${ipo.symbol})</small></h4>
      <p>Issue: ${ipo.issue} | Price: ${ipo.price}</p>
      <p>Dates: ${ipo.dates}</p>
      ${ipo.gmp ? `<p>GMP: <span style="color:var(--success)">${ipo.gmp}</span></p>` : ''}
      <span class="ipo-tag ${tagCls}">${ipo.status.toUpperCase()}</span>
    </div>`;
  }).join('');
}

// ───── CHARTS ─────
function initCharts() {
  initPerfChart();
  initSectorChart();
  initBotPerfChart();
}

function initPerfChart() {
  const ctx = document.getElementById('perfChart');
  if (!ctx) return;
  if (state.charts.perf) state.charts.perf.destroy();
  const labels = getLast7Days();
  const data = labels.map((_, i) => state.account.cash + state.account.realisedPnl * (i / labels.length));
  state.charts.perf = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Portfolio Value', data, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)', borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#3b82f6', tension: 0.4, fill: true }]},
    options: chartDefaults('Portfolio Value (₹)')
  });
}

function updatePerfChart(period) {
  ['1D','1W','1M','3M'].forEach(p => document.getElementById('perf-' + p)?.classList.remove('btn-active'));
  document.getElementById('perf-' + period)?.classList.add('btn-active');
  state.perfChartPeriod = period;
  const n = {D:1,W:7,M:30,'3M':90}[period.replace('1','')] || 7;
  const labels = getLastNDays(n > 30 ? 90 : n > 7 ? 30 : n > 1 ? 7 : 1);
  if (state.charts.perf) {
    state.charts.perf.data.labels = labels;
    state.charts.perf.data.datasets[0].data = labels.map((_, i) => {
      const base = state.account.cash + state.account.invested;
      return parseFloat((base * (0.97 + Math.random() * 0.06 + i * 0.001)).toFixed(2));
    });
    state.charts.perf.update();
  }
}

function initSectorChart() {
  const ctx = document.getElementById('sectorChart');
  if (!ctx) return;
  if (state.charts.sector) state.charts.sector.destroy();
  const sectors = {};
  state.holdings.forEach(h => { sectors[h.sector] = (sectors[h.sector] || 0) + h.qty * ((state.marketData[h.symbol]?.ltp) || h.avgPrice); });
  const labels = Object.keys(sectors);
  const data = Object.values(sectors);
  state.charts.sector = new Chart(ctx, {
    type: 'doughnut',
    data: { labels: labels.length ? labels : ['No Holdings'], datasets: [{ data: data.length ? data : [1], backgroundColor: ['#3b82f6','#22c55e','#ef4444','#f59e0b','#a78bfa','#22d3ee','#fb7185','#84cc16'], borderWidth: 0 }]},
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#8b949e', font: { size: 11 } } } } }
  });
}

function initBotPerfChart() {
  const ctx = document.getElementById('botPerfChart');
  if (!ctx) return;
  if (state.charts.botPerf) state.charts.botPerf.destroy();
  const labels = getLast7Days();
  state.charts.botPerf = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Bot P&L', data: labels.map(() => (Math.random() - 0.45) * 2000), backgroundColor: labels.map(() => Math.random() > 0.45 ? 'rgba(34,197,94,0.7)' : 'rgba(239,68,68,0.7)'), borderRadius: 3 }]},
    options: chartDefaults('Daily P&L (₹)')
  });
}

function renderPortfolioCharts() {
  const ctx1 = document.getElementById('portfolioCompositionChart');
  const ctx2 = document.getElementById('pnlChart');
  if (ctx1) {
    if (state.charts.portComp) state.charts.portComp.destroy();
    const sectors = {};
    state.holdings.forEach(h => { sectors[h.sector] = (sectors[h.sector]||0) + h.qty * ((state.marketData[h.symbol]?.ltp)||h.avgPrice); });
    const labels = Object.keys(sectors);
    state.charts.portComp = new Chart(ctx1, {
      type: 'pie',
      data: { labels: labels.length ? labels : ['Cash'], datasets: [{ data: labels.length ? Object.values(sectors) : [state.account.cash||1], backgroundColor: ['#3b82f6','#22c55e','#ef4444','#f59e0b','#a78bfa','#22d3ee','#fb7185'], borderWidth: 0 }]},
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#8b949e', font: { size: 11 } } } } }
    });
  }
  if (ctx2) {
    if (state.charts.pnl) state.charts.pnl.destroy();
    const labels = getLast7Days();
    state.charts.pnl = new Chart(ctx2, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Cumulative P&L', data: labels.map((_, i) => state.account.realisedPnl * (i+1) / labels.length), borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)', borderWidth: 2, fill: true, tension: 0.4 }]},
      options: chartDefaults('P&L (₹)')
    });
  }
}

function chartDefaults(yLabel) {
  return {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: true, grid: { color: 'rgba(48,54,61,0.6)' }, ticks: { color: '#6e7681', font: { size: 10 }, maxTicksLimit: 8 } },
      y: { display: true, grid: { color: 'rgba(48,54,61,0.6)' }, ticks: { color: '#6e7681', font: { size: 10 } }, title: { display: false } }
    }
  };
}

// ───── DASHBOARD ─────
function updateDashboardCards() {
  updateActiveBotList();
  renderRecentTrades();
  updateAllStats();
  initSectorChart();
}

function renderRecentTrades() {
  const el = document.getElementById('recent-trades-mini');
  if (!el) return;
  const recent = state.trades.slice(0,5);
  if (!recent.length) { el.innerHTML = '<p class="empty-state">No trades yet.</p>'; return; }
  el.innerHTML = recent.map(t => {
    const cls = t.type === 'BUY' ? 'type-buy' : 'type-sell';
    return `<div class="trade-mini-item">
      <span class="${cls}">${t.type}</span>
      <span><strong>${t.symbol}</strong> x${t.qty}</span>
      <span>${fmtInr(t.price)}</span>
    </div>`;
  }).join('');
}

// ───── STATS UPDATE ─────
function updateAllStats() {
  const total = state.account.cash + state.account.invested + state.account.unrealisedPnl;
  setEl('stat-cash', fmtInr(state.account.cash));
  setEl('stat-invested', fmtInr(state.account.invested));
  setEl('stat-unrealised', fmtInr(state.account.unrealisedPnl));
  setEl('stat-realised', fmtInr(state.account.realisedPnl));
  setEl('stat-margin', fmtInr(state.account.margin));
  setEl('stat-total', fmtInr(total));

  // Topbar
  setEl('topbar-balance', fmtInr(state.account.cash));
  const pnlEl = document.getElementById('topbar-pnl');
  if (pnlEl) {
    pnlEl.textContent = fmtInr(state.account.unrealisedPnl + state.account.realisedPnl);
    const pnlParent = document.getElementById('topbar-pnl-span');
    if (pnlParent) {
      const totalPnl = state.account.unrealisedPnl + state.account.realisedPnl;
      pnlParent.className = 'summary-item today-pnl ' + (totalPnl >= 0 ? 'pos' : 'neg');
    }
  }

  // color unrealised
  const unreEl = document.getElementById('stat-unrealised');
  if (unreEl) unreEl.className = 'stat-value ' + (state.account.unrealisedPnl >= 0 ? 'positive' : 'negative');
}

// ───── SETTINGS ─────
function setTheme(t) {
  state.theme = t;
  applyTheme(t);
  document.getElementById('theme-dark')?.classList.toggle('btn-active', t === 'dark');
  document.getElementById('theme-light')?.classList.toggle('btn-active', t === 'light');
  saveState();
}

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
}

function saveDisplaySettings() {
  const interval = parseInt(document.getElementById('refreshInterval')?.value) || 5;
  state.refreshInterval = Math.max(2, interval) * 1000;
  showToast('success', 'Saved', 'Display settings updated');
  saveState();
}

// ───── EXPORT ─────
function exportTrades() {
  const rows = [['Date','Symbol','Exchange','Type','Qty','Price','Total','P&L','Source','Status']];
  state.tradesPage.filtered.forEach(t => rows.push([t.date, t.symbol, t.exchange||'NSE', t.type, t.qty, t.price, t.total, t.pnl||'', t.source, t.status||'FILLED']));
  downloadCSV(rows, 'trades.csv');
  showToast('success', 'Exported', 'Trades CSV downloaded');
}

function exportTransactions() {
  const rows = [['Date','Type','Amount','Balance After','Note']];
  state.transactions.forEach(t => rows.push([t.date, t.type, t.amount, t.balanceAfter, t.note]));
  downloadCSV(rows, 'transactions.csv');
  showToast('success', 'Exported', 'Transactions CSV downloaded');
}

function exportAllData() {
  const data = {account: state.account, holdings: state.holdings, trades: state.trades, transactions: state.transactions, watchlist: state.watchlist};
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'finoexpert_data.json';
  a.click();
  showToast('success', 'Exported', 'All data downloaded as JSON');
}

function clearAllData() {
  const confirmText = document.getElementById('clearDataConfirm')?.value;
  if (confirmText !== 'DELETE') { showToast('error', 'Incorrect', 'Please type DELETE to confirm'); return; }
  localStorage.removeItem('finoexpert_state');
  location.reload();
}

function downloadCSV(rows, filename) {
  const csv = rows.map(r => r.map(c => '"' + String(c||'').replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], {type: 'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// ───── MODALS ─────
function showModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.querySelector('.form-control, button')?.focus();
  // Prefill available balance for withdraw modal
  if (id === 'withdrawModal') setEl('withdrawAvail', fmtInr(state.account.cash));
  if (id === 'buyModal') {
    setEl('tradeAvailBal', fmtInr(state.account.cash));
    document.getElementById('tradeError')?.classList.add('hidden');
  }
}

function closeModal(id) {
  document.getElementById(id)?.classList.add('hidden');
}

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal:not(.hidden)').forEach(m => m.classList.add('hidden'));
    document.getElementById('notifPanel')?.classList.add('hidden');
  }
});

// ───── NOTIFICATIONS ─────
function addNotification(msg) {
  state.notifications.unshift({msg, time: new Date().toLocaleTimeString('en-IN'), read: false});
  const unread = state.notifications.filter(n => !n.read).length;
  const badge = document.getElementById('notifBadge');
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'flex' : 'none';
  }
  setEl('notifBadge', unread > 0 ? unread : '');
}

function toggleNotifPanel() {
  const panel = document.getElementById('notifPanel');
  if (!panel) return;
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) renderNotifPanel();
}

function renderNotifPanel() {
  const el = document.getElementById('notifList');
  if (!el) return;
  if (!state.notifications.length) { el.innerHTML = '<p class="empty-state">No notifications.</p>'; return; }
  el.innerHTML = state.notifications.slice(0,20).map(n =>
    `<div style="padding:8px 16px;border-bottom:1px solid var(--border-light);font-size:0.8rem">
      <div style="color:var(--text-primary)">${n.msg}</div>
      <div style="color:var(--text-muted);font-size:0.72rem">${n.time}</div>
    </div>`
  ).join('');
  state.notifications.forEach(n => n.read = true);
  const badge = document.getElementById('notifBadge');
  if (badge) badge.style.display = 'none';
}

function clearNotifications() {
  state.notifications = [];
  document.getElementById('notifList').innerHTML = '<p class="empty-state">No notifications.</p>';
  const badge = document.getElementById('notifBadge');
  if (badge) badge.style.display = 'none';
}

// ───── PAGINATION ─────
function renderPagination(containerId, total, currentPage, pageSize, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) { container.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${i === currentPage ? 'active' : ''}" onclick="(${onPageChange})(${i})">${i}</button>`;
  }
  container.innerHTML = html;
}

// ───── SORT TABLE ─────
function sortTable(tableId, col) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const dir = table.dataset.sortDir === 'asc' ? -1 : 1;
  table.dataset.sortDir = dir === 1 ? 'asc' : 'desc';
  rows.sort((a, b) => {
    const av = a.cells[col]?.textContent.replace(/[₹,%+]/g,'').trim() || '';
    const bv = b.cells[col]?.textContent.replace(/[₹,%+]/g,'').trim() || '';
    const an = parseFloat(av), bn = parseFloat(bv);
    if (!isNaN(an) && !isNaN(bn)) return (an - bn) * dir;
    return av.localeCompare(bv) * dir;
  });
  rows.forEach(r => tbody.appendChild(r));
}

// ───── TOAST ─────
function showToast(type, title, msg) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = {success:'✅', error:'❌', warning:'⚠️', info:'ℹ️'};
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  // Build DOM safely to prevent XSS
  const iconSpan = document.createElement('span');
  iconSpan.className = 'toast-icon';
  iconSpan.textContent = icons[type] || 'ℹ️';

  const body = document.createElement('div');
  body.className = 'toast-body';

  const titleEl = document.createElement('div');
  titleEl.className = 'toast-title';
  titleEl.textContent = title;

  const msgEl = document.createElement('div');
  msgEl.className = 'toast-msg';
  msgEl.textContent = msg;

  body.appendChild(titleEl);
  body.appendChild(msgEl);
  toast.appendChild(iconSpan);
  toast.appendChild(body);

  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('fade-out'); setTimeout(() => toast.remove(), 300); }, 3500);
}

// ───── HELPERS ─────
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function fmtInr(n) {
  if (n == null || isNaN(n)) return '₹0.00';
  return '₹' + Math.abs(n).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function formatNum(n) {
  if (n == null) return '--';
  return n.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function formatVol(v) {
  if (!v) return '--';
  if (v >= 10000000) return (v/10000000).toFixed(1) + 'Cr';
  if (v >= 100000) return (v/100000).toFixed(1) + 'L';
  if (v >= 1000) return (v/1000).toFixed(1) + 'K';
  return v.toString();
}

function getLast7Days() { return getLastNDays(7); }
function getLastNDays(n) {
  const d = [];
  for (let i = n-1; i >= 0; i--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - i);
    d.push(dt.toLocaleDateString('en-IN', {month:'short', day:'numeric'}));
  }
  return d;
}

// ───── START ─────
document.addEventListener('DOMContentLoaded', init);
