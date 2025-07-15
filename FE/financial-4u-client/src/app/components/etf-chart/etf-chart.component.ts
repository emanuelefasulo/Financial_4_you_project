import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FinancialDataService } from '../../services/financial-data.service';

Chart.register(...registerables);

@Component({
  selector: 'app-etf-chart',
  templateUrl: './etf-chart.component.html',
  styleUrls: ['./etf-chart.component.css'],
})
export class EtfChartComponent implements OnInit, OnDestroy {
  public sp500Chart!: Chart | null;
  public worldChart!: Chart | null;
  public bitcoinChart!: Chart | null;

  constructor(private financialDataService: FinancialDataService) {}

  ngOnInit(): void {
    this.createChart('sp500Chart', 'S&P 500', 'SPY', 'rgba(255, 99, 132, 1)');
    this.createChart('worldChart', 'World ETF', 'VT', 'rgba(54, 162, 235, 1)');
    this.createChart(
      'bitcoinChart',
      'Bitcoin',
      'BTC/USD',
      'rgba(255, 206, 86, 1)',
    );
  }

  ngOnDestroy(): void {
    if (this.sp500Chart) this.sp500Chart.destroy();
    if (this.worldChart) this.worldChart.destroy();
    if (this.bitcoinChart) this.bitcoinChart.destroy();
  }

  createChart(
    chartId: string,
    title: string,
    symbol: string,
    borderColor: string,
  ) {
    this.financialDataService.getHistoricalData(symbol).subscribe((data) => {
      if (!data || !data.values || data.values.length === 0) {
        console.error(`Nessun dato disponibile per ${symbol}`);
        return;
      }

      const chartData = this.processData(data.values, symbol);

      setTimeout(() => {
        const canvas = document.getElementById(chartId) as HTMLCanvasElement;
        if (!canvas) {
          console.error(`Canvas con ID ${chartId} non trovato.`);
          return;
        }

        const newChart = new Chart(canvas, {
          type: 'line',
          data: {
            labels: chartData.labels,
            datasets: [
              {
                label: 'Prezzo di Chiusura',
                data: chartData.prices,
                borderColor: borderColor,
                backgroundColor: borderColor.replace('1)', '0.2)'),
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: title,
                font: {
                  size: 18,
                  weight: 'bold',
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Data',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Prezzo (USD)',
                },
              },
            },
          },
        });

        if (chartId === 'sp500Chart') this.sp500Chart = newChart;
        else if (chartId === 'worldChart') this.worldChart = newChart;
        else if (chartId === 'bitcoinChart') this.bitcoinChart = newChart;

        console.log(`Grafico ${chartId} creato con successo!`);
      }, 0);
    });
  }

  processData(data: any[], symbol: string) {
    const labels: string[] = [];
    const prices: number[] = [];

    data.forEach((item) => {
      labels.push(item.datetime);
      prices.push(parseFloat(item.close));
    });

    return { labels: labels.reverse(), prices: prices.reverse() };
  }
}
