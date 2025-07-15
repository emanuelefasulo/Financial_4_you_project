import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicChartComponent } from '../../components/dynamic-chart/dynamic-chart.component';
import { Subscription } from 'rxjs';
import { CryptoService } from '../../services/crypto.service';
import { HttpClient } from '@angular/common/http';

interface AssetData {
  purchaseDate: string | null;
  purchaseValue: number | null;
  currentValue: number | null;
  variation: number | null;
}

@Component({
  selector: '',
  standalone: true,
  imports: [
    CommonModule,
    DynamicChartComponent,
    FormsModule
  ],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: any = null;
  transactions: any[] = [];
  transactionsLoaded: boolean = false;
  private userSubscription!: Subscription;
  selectedAsset: string = '';
  selectedAssetPrice: number|null = null;
  previousAsset: string = '';
  previousAssetPrice: number|null = null;
  cryptoPrices: any = null;
  cryptoLastPrices: any = {};
  cryptoPurchaseDates: any = {};
  private cryptoIntervalId: any;

  buyCryptoName: string = '';
  buyAmount: number|null = null;

  sellCryptoName: string = '';
  sellAmount: number|null = null;

  goldData: AssetData | null = null;
  sp500Data: AssetData | null = null;
  goldAsk: number | null = null;
  goldBid: number | null = null;
  gold18k: number | null = null;
  gold24k: number | null = null;
  gold10k: number | null = null;

  sp500Rows: {
    symbol: string;
    name: string;
    date: string;
    currentValue: number | null;
    previousValue: number | null;
    variation?: number | null;
  }[] = [];
  nasdaqSymbols = [
    { symbol: 'NVDA', name: 'NVIDIA' },
    { symbol: 'IBM', name: 'IBM' },
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Alphabet' }
  ];

  metals: any[] = [
    { symbol: 'XAU', date: '14/07/2025 10:00', price: 72.350, variation: 1.2 },
    { symbol: 'XAG', date: '14/07/2025 10:00', price: 0.950, variation: -0.5 },
    { symbol: 'XPT', date: '14/07/2025 10:00', price: 32.100, variation: 0.8 },
    { symbol: 'XPD', date: '14/07/2025 10:00', price: 45.800, variation: 2.1 }
  ];
  cryptos: any[] = [];
  closedMovements: any[] = [
    {
      date: '01/07/2025',
      asset: 'BTC',
      amount: 1500.00,
      variation: 8.2
    },
    {
      date: '15/06/2025',
      asset: 'ETH',
      amount: 900.00,
      variation: -1.5
    },
    {
      date: '02/06/2025',
      asset: 'AAPL',
      amount: 600.00,
      variation: 3.1
    },
    {
      date: '20/05/2025',
      asset: 'NVDA',
      amount: 1200.00,
      variation: 12.7
    },
    {
      date: '10/05/2025',
      asset: 'XAU',
      amount: 700.00,
      variation: 2.9
    },
    {
      date: '28/04/2025',
      asset: 'USDT',
      amount: 400.00,
      variation: 0.0
    }
  ];
  activeMovements: any[] = [
    {
      date: '10/07/2025',
      asset: 'BTC',
      amount: 1200.00,
      variation: 5.2
    },
    {
      date: '05/07/2025',
      asset: 'ETH',
      amount: 800.00,
      variation: -2.1
    },
    {
      date: '01/07/2025',
      asset: 'AAPL',
      amount: 500.00,
      variation: 1.7
    }
  ];

  newsList = [
    { title: 'Inflazione in calo, la BCE valuta nuovi tagli dei tassi', source: 'Il Sole 24 Ore', url: 'https://www.ilsole24ore.com/' },
    { title: 'Wall Street chiude in rialzo, trainata dai tech', source: 'Reuters', url: 'https://www.reuters.com/' },
    { title: 'Oro ai massimi storici, domanda record in Asia', source: 'Bloomberg', url: 'https://www.bloomberg.com/' },
    { title: 'Bitcoin supera i 70.000$, nuovo record annuale', source: 'CoinDesk', url: 'https://www.coindesk.com/' },
    { title: 'Nasdaq: NVIDIA e Apple guidano la crescita', source: 'Financial Times', url: 'https://www.ft.com/' },
    { title: 'Petrolio in calo dopo i dati sulle scorte USA', source: 'ANSA', url: 'https://www.ansa.it/' },
    { title: 'Fed: inflazione sotto controllo, ma attenzione ai rischi', source: 'CNBC', url: 'https://www.cnbc.com/' },
    { title: 'ETF: boom di investimenti in Europa', source: 'Il Messaggero', url: 'https://www.ilmessaggero.it/' }
  ];
  newsCarouselIndex = 0;
  newsCarouselInterval: any;

  mockProfile = {
    name: 'Mario',
    cognome: 'Rossi',
    email: 'mario.rossi@email.com',
    username: 'mariorossi'
  };
  profileEditMode = false;

  constructor(
    private userService: UserService,
    private datePipe: DatePipe,
    private cryptoService: CryptoService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.cryptoPurchaseDates.bitcoin = new Date(2024, 10, 8, 12, 0, 0);
    this.cryptoLastPrices.bitcoin = 70482.34;

    this.loadUser();
    this.userSubscription = this.userService.onUserUpdate().subscribe(() => {
      this.loadUser();
    });
    this.loadCryptoPrices();
    this.fetchGoldData();
    this.fetchMetalsData();
    this.fetchCryptosData();
    this.fetchSP500NasdaqData();
    this.sp500Data = {
      purchaseDate: '01/06/2024',
      purchaseValue: 5300.00,
      currentValue: 5600.50,
      variation: this.getGoldVariation(5300.00, 5600.50)
    };
    this.newsCarouselInterval = setInterval(() => this.nextNews(), 5000);
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.newsCarouselInterval) {
      clearInterval(this.newsCarouselInterval);
    }
  }

  loadUser() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.userService.getUserById(parseInt(userId)).subscribe({
        next: (data) => {
          this.userService.setUser(data);
          this.user = data;
          this.loadTransactions();
        },
        error: (error) => console.error('Errore nel recupero utente', error),
      });
    }
  }

  loadTransactions() {
    if (this.user && this.user.cards) {
      this.transactions = this.getAllTransactions();
      this.transactionsLoaded = true;
      console.log('Transazioni caricate:', this.transactions);
    }
  }

  getAllTransactions() {
    return (
      this.user?.cards.flatMap((card: any) =>
        card.transactions.map((transaction: any) => ({
          ...transaction,
          cardType: card.type,
          formattedDate: this.formatDate(transaction.timestamp),
        })),
      ) || []
    );
  }

  formatDate(date: any): string {
    if (Array.isArray(date)) {
      const formattedDate = new Date(
        date[0],
        date[1] - 1,
        date[2],
        date[3],
        date[4],
        date[5],
      );
      return (
        this.datePipe.transform(formattedDate, 'dd-MM-yyyy') ||
        'Data non disponibile'
      );
    }
    const parsedDate = new Date(date);
    return (
      this.datePipe.transform(parsedDate, 'dd-MM-yyyy') ||
      'Data non disponibile'
    );
  }

  onAssetChange(asset: string) {
    if (this.selectedAsset) {
      this.previousAsset = this.selectedAsset;
      this.previousAssetPrice = this.selectedAssetPrice;
    }
    this.selectedAsset = asset;
  }

  onAssetPriceChange(price: number, allPrices?: number[]) {
    this.selectedAssetPrice = price;
    if (this.previousAssetPrice === null && allPrices && allPrices.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPrices.length);
      this.previousAssetPrice = allPrices[randomIndex];
    }
  }

  loadCryptoPrices() {
    this.cryptoService.getCryptoPrices().subscribe({
      next: (data: any) => {
        const now = new Date();
        if (!this.cryptoPurchaseDates.ethereum && data.ethereum && data.ethereum.usd) {
          this.cryptoPurchaseDates.ethereum = now;
        }
        if (this.cryptoPrices && this.cryptoPrices.ethereum) {
          this.cryptoLastPrices.ethereum = this.cryptoPrices.ethereum.usd;
        } else if (!this.cryptoLastPrices.ethereum && data.ethereum?.usd) {
          this.cryptoLastPrices.ethereum = data.ethereum.usd;
        }
        if (data.bitcoin && data.bitcoin.usd && data.ethereum && data.ethereum.usd) {
          this.cryptoPrices = data;
        }
      },
      error: (err: any) => {
        if (!this.cryptoPrices) {
          this.cryptoPrices = null;
        }
      }
    });
  }

  getCryptoVariation(coin: string): number {
    if (!this.cryptoLastPrices[coin] || !this.cryptoPrices?.[coin]?.usd) return 0;
    const oldPrice = this.cryptoLastPrices[coin];
    const newPrice = this.cryptoPrices[coin].usd;
    return ((newPrice - oldPrice) / oldPrice) * 100;
  }

  getCryptoPurchaseDate(coin: string): string {
    const date = this.cryptoPurchaseDates[coin];
    if (!date) return 'Data non disponibile';
    return new Date(date).toLocaleString('it-IT');
  }

  private symbolToName(symbol: string): string {
    switch (symbol.toUpperCase()) {
      case 'BTC': return 'bitcoin';
      case 'ETH': return 'ethereum';
      case 'XRP': return 'ripple';
      case 'USDT': return 'tether';
      case 'BNB': return 'binancecoin';
      case 'XAU': return 'gold24k';
      case 'XAG': return 'silver';
      case 'XPT': return 'platinum';
      case 'XPD': return 'palladium';
      default: return symbol.toLowerCase();
    }
  }

  openBuyModal(asset: string) {
    this.buyCryptoName = this.symbolToName(asset);
    this.buyAmount = null;
    const modal: any = document.getElementById('buyModal');
    if (modal) {
      const BootstrapModal = (window as any)['bootstrap']?.Modal;
      if (BootstrapModal) {
        BootstrapModal.getOrCreateInstance(modal).show();
      } else {
        modal.style.display = 'block';
      }
    }
  }

  openSellModal(asset: string) {
    this.sellCryptoName = this.symbolToName(asset);
    this.sellAmount = 0;
    const modal: any = document.getElementById('sellModal');
    if (modal) {
      const BootstrapModal = (window as any)['bootstrap']?.Modal;
      if (BootstrapModal) {
        BootstrapModal.getOrCreateInstance(modal).show();
      } else {
        modal.style.display = 'block';
      }
    }
  }

  getTotalOwned(asset: string): number {
    const name = this.symbolToName(asset);
    if (name === 'bitcoin') return 0.15;
    if (name === 'ethereum') return 2.5;
    if (name === 'gold10k') return 10;
    if (name === 'gold18k') return 5;
    if (name === 'gold24k') return 2;
    return 0;
  }

  getBuyEquivalent(): string {
    if (!this.buyAmount || !this.buyCryptoName) return '';
    let price = null;
    if (this.buyCryptoName === 'bitcoin' && this.cryptoPrices) price = this.cryptoPrices.bitcoin?.usd;
    if (this.buyCryptoName === 'ethereum' && this.cryptoPrices) price = this.cryptoPrices.ethereum?.usd;
    if (this.buyCryptoName === 'gold10k' && this.goldData) price = this.goldData.currentValue;
    if (this.buyCryptoName === 'gold18k' && this.gold18k) price = this.gold18k;
    if (this.buyCryptoName === 'gold24k' && this.gold24k) price = this.gold24k;
    if (!price) return '';
    const equivalent = this.buyAmount / price;
    return equivalent.toFixed(6);
  }

  onBuySubmit() {
    alert(`Hai acquistato ${this.getBuyEquivalent()} ${this.buyCryptoName.toUpperCase()} per €${this.buyAmount}`);
    const modal: any = document.getElementById('buyModal');
    const BootstrapModal = (window as any)['bootstrap']?.Modal;
    if (modal && BootstrapModal) {
      BootstrapModal.getOrCreateInstance(modal).hide();
    } else if (modal) {
      modal.style.display = 'none';
    }
  }

  getSellEquivalent(): string {
    if (!this.sellAmount || !this.sellCryptoName) return '';
    let price = null;
    if (this.sellCryptoName === 'bitcoin' && this.cryptoPrices) price = this.cryptoPrices.bitcoin?.usd;
    if (this.sellCryptoName === 'ethereum' && this.cryptoPrices) price = this.cryptoPrices.ethereum?.usd;
    if (this.sellCryptoName === 'gold10k' && this.goldData) price = this.goldData.currentValue;
    if (this.sellCryptoName === 'gold18k' && this.gold18k) price = this.gold18k;
    if (this.sellCryptoName === 'gold24k' && this.gold24k) price = this.gold24k;
    if (!price) return '';
    const equivalent = this.sellAmount * price;
    return equivalent.toFixed(2);
  }

  onSellSubmit() {
    alert(`Hai venduto ${this.sellAmount} ${this.sellCryptoName.toUpperCase()} per €${this.getSellEquivalent()}`);
    const modal: any = document.getElementById('sellModal');
    const BootstrapModal = (window as any)['bootstrap']?.Modal;
    if (modal && BootstrapModal) {
      BootstrapModal.getOrCreateInstance(modal).hide();
    } else if (modal) {
      modal.style.display = 'none';
    }
  }

  fetchGoldData() {
    const apiKey = 'goldapi-bey4y9smd1t8llt-io'; 
    const date = '20230617'; 
    const url = `https://www.goldapi.io/api/XAU/USD/${date}`;
    const formattedDate = `${date.substring(6,8)}/${date.substring(4,6)}/${date.substring(0,4)}`;
    this.http.get<any>(url, {
      headers: { 'x-access-token': apiKey }
    }).subscribe({
      next: (data) => {
        console.log('Risposta API oro:', data); 
        this.goldData = {
          purchaseDate: formattedDate,
          purchaseValue: data.price_gram_10k, 
          currentValue: data.price_gram_10k,
          variation: data.chp
        };
        this.goldAsk = data.ask;
        this.goldBid = data.bid;
        this.gold18k = data.price_gram_18k;
        this.gold24k = data.price_gram_24k;
      },
      error: (err) => {
        this.goldData = null;
        this.goldAsk = null;
        this.goldBid = null;
        this.gold18k = null;
        this.gold24k = null;
      }
    });
  }

  fetchMetalsData() {
    const apiKey = 'goldapi-bey4y9smd1t8llt-io';
    const metalsSymbols = [
      { symbol: 'XAU', name: 'Oro' },
      { symbol: 'XAG', name: 'Argento' },
      { symbol: 'XPT', name: 'Platino' },
      { symbol: 'XPD', name: 'Palladio' }
    ];
    this.metals = [];
    metalsSymbols.forEach(metal => {
      let url = `https://www.goldapi.io/api/${metal.symbol}/EUR`;
      this.http.get<any>(url, {
        headers: { 'x-access-token': apiKey }
      }).subscribe({
        next: (data) => {
          const now = new Date();
          const dateTime = now.toLocaleString('it-IT');
          this.metals.push({
            symbol: metal.symbol,
            name: metal.name,
            date: dateTime,
            price: data.price_gram_24k ?? null,
            variation: data.chp ?? null
          });
        },
        error: (err) => {
          const now = new Date();
          const dateTime = now.toLocaleString('it-IT');
          this.metals.push({
            symbol: metal.symbol,
            name: metal.name,
            date: dateTime,
            price: null,
            variation: null
          });
        }
      });
    });
  }
  fetchCryptosData() {
    const symbols = [
      { symbol: 'BTC', id: 'bitcoin' },
      { symbol: 'ETH', id: 'ethereum' },
      { symbol: 'XRP', id: 'ripple' },
      { symbol: 'USDT', id: 'tether' },
      { symbol: 'BNB', id: 'binancecoin' }
    ];
    this.cryptos = [];
    const ids = symbols.map(c => c.id).join(',');
    this.http.get<any>(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`).subscribe({
      next: (data) => {
        const now = new Date();
        const dateTime = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours()
          .toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        symbols.forEach(crypto => {
          const price = data[crypto.id]?.usd ?? null;
          this.cryptos.push({
            symbol: crypto.symbol,
            name: crypto.id,
            price: price,
            date: dateTime
          });
        });
      },
      error: (err) => {
        const now = new Date();
        const dateTime = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours()
          .toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        symbols.forEach(crypto => {
          this.cryptos.push({
            symbol: crypto.symbol,
            name: crypto.id,
            price: null,
            date: dateTime
          });
        });
      }
    });
  }

  fetchSP500NasdaqData() {
    const apiKey = 'U5ZLUB5XW30FWFZF';
    this.sp500Rows = [];
    this.nasdaqSymbols.forEach((item) => {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${item.symbol}&apikey=${apiKey}`;
      this.http.get<any>(url).subscribe({
        next: (data) => {
          const series = data['Monthly Time Series'];
          if (series) {
            const dates = Object.keys(series).sort().reverse();
            const latest = series[dates[0]];
            const previous = series[dates[1]];
            const currentValue = parseFloat(latest['4. close']);
            const previousValue = parseFloat(previous['4. close']);
            const now = new Date();
            const dateTime = now.toLocaleString('it-IT');
            this.sp500Rows.push({
              symbol: item.symbol,
              name: item.name,
              date: dateTime,
              currentValue: currentValue,
              previousValue: previousValue
            });
            console.log(`SP500/Nasdaq ${item.symbol} RESPONSE:`, data, 'CURRENT:', currentValue, 'PREV:', previousValue);
          } else {
            const now = new Date();
            const dateTime = now.toLocaleString('it-IT');
            this.sp500Rows.push({
              symbol: item.symbol,
              name: item.name,
              date: dateTime,
              currentValue: null,
              previousValue: null
            });
            console.log(`SP500/Nasdaq ${item.symbol} RESPONSE:`, data, 'NO DATA');
          }
        },
        error: (err) => {
          const now = new Date();
          const dateTime = now.toLocaleString('it-IT');
          this.sp500Rows.push({
            symbol: item.symbol,
            name: item.name,
            date: dateTime,
            currentValue: null,
            previousValue: null
          });
          console.error(`SP500/Nasdaq ${item.symbol} ERROR:`, err);
        }
      });
    });
  }

  

  getGoldVariation(purchase: number, current: number|null): number {
    if (purchase == null || current == null) return 0;
    return ((current - purchase) / purchase) * 100;
  }

  nextNews() {
    this.newsCarouselIndex = (this.newsCarouselIndex + 1) % this.newsList.length;
  }
  prevNews() {
    this.newsCarouselIndex = (this.newsCarouselIndex - 1 + this.newsList.length) % this.newsList.length;
  }

  openProfileModal(event: Event) {
    event.preventDefault();
    const modal: any = document.getElementById('profileModal');
    if (modal) {
      const BootstrapModal = (window as any)['bootstrap']?.Modal;
      if (BootstrapModal) {
        BootstrapModal.getOrCreateInstance(modal).show();
      } else {
        modal.style.display = 'block';
      }
    }
  }

  toggleProfileEdit() {
    if (this.profileEditMode) {
    }
    this.profileEditMode = !this.profileEditMode;
  }
}
