import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { FinancialDataService } from '../../services/financial-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-dynamic-chart',
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-chart.component.html',
  styleUrls: ['./dynamic-chart.component.css'],
})
export class DynamicChartComponent implements OnInit {
  public chart: any;
  public selectedAsset: string = 'BTC';
  public availableSymbols: string[] = ['BTC', 'ETH', 'AAPL', 'NVDA', 'XAU', 'USDT'];
  @Output() assetChange = new EventEmitter<string>();
  @Output() assetPriceChange = new EventEmitter<{price: number, allPrices: number[]}>();

  constructor(private financialDataService: FinancialDataService) {}

  ngOnInit(): void {
    this.updateChart();
  }

  updateChart() {
    this.assetChange.emit(this.selectedAsset);
    if (!this.selectedAsset) return;

    this.financialDataService
      .getHistoricalData(this.selectedAsset)
      .subscribe((data) => {
        if (data && data.values) {
          const chartData = this.processData(data.values);
          if (this.chart) {
            this.chart.destroy();
          }
          this.chart = new Chart('dynamicChart', {
            type: 'line',
            data: {
              labels: chartData.labels,
              datasets: [
                {
                  label: `Prezzo di ${this.selectedAsset}`,
                  data: chartData.prices,
                  borderColor: 'rgb(186, 17, 238)',
                  backgroundColor: 'rgba(177, 58, 247, 0.2)',
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
                  text: `Andamento di ${this.selectedAsset}`,
                  color: 'white',
                },
                legend: {
                  labels: {
                    color: 'white',
                  },
                },
              },
              scales: {
                x: {
                  title: { display: true, text: 'Data', color: 'white' },
                  ticks: { color: 'white' },
                },
                y: {
                  title: { display: true, text: 'Prezzo (USD)', color: 'white' },
                  ticks: { color: 'white' },
                },
              },
            },
          });
          if (chartData.prices && chartData.prices.length > 0) {
            this.assetPriceChange.emit({price: chartData.prices[chartData.prices.length - 1], allPrices: chartData.prices});
          }
        }
      });
  }

  processData(data: any[]) {
    const labels: string[] = [];
    const prices: number[] = [];

    data.forEach((item) => {
      labels.push(item.datetime);
      prices.push(parseFloat(item.close));
    });

    return { labels: labels.reverse(), prices: prices.reverse() };
  }
}
