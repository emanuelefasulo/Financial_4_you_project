import { Component, OnInit } from '@angular/core';
import { EtfChartComponent } from '../../components/etf-chart/etf-chart.component';
import { FinancialDataService } from '../../services/financial-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';
import { tap } from 'rxjs';
@Component({
  selector: 'app-investments',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './investments.component.html',
  styleUrl: './investments.component.css',
})
export class InvestmentsComponent implements OnInit {
  public investmentChart: any;
  public selectedAsset: string = 'SPY';
  public investmentAmount: number = 1000;
  public investmentPeriod: number = 12;
  private annualReturn: number = 0;

  public transactions: any[] = [];
  closedMovements: any[] = [
    { date: '01/07/2025', asset: 'BTC', amount: 1500.0, variation: 8.2 },
    { date: '15/06/2025', asset: 'ETH', amount: 900.0, variation: -1.5 },
    { date: '02/06/2025', asset: 'AAPL', amount: 600.0, variation: 3.1 },
    { date: '20/05/2025', asset: 'NVDA', amount: 1200.0, variation: 12.7 },
    { date: '10/05/2025', asset: 'XAU', amount: 700.0, variation: 2.9 },
    { date: '28/04/2025', asset: 'USDT', amount: 400.0, variation: 0.0 },
  ];
  activeMovements: any[] = [
    { date: '10/07/2025', asset: 'BTC', amount: 1200.0, variation: 5.2 },
    { date: '05/07/2025', asset: 'ETH', amount: 800.0, variation: -2.1 },
    { date: '01/07/2025', asset: 'AAPL', amount: 500.0, variation: 1.7 },
  ];

  constructor(private financialDataService: FinancialDataService) {}

  ngOnInit(): void {
    this.loadAssetData();
    this.transactions = this.closedMovements.slice(0, 6);
  }

  getHistoricalData(symbol: string) {
    return this.financialDataService.getHistoricalData(symbol).pipe(
      tap((data) => {
        console.log('Dati storici:', data);
      }),
    );
  }

  loadAssetData() {
    this.getHistoricalData(this.selectedAsset).subscribe((data) => {
      if (data && data.values) {
        console.log(data);
        this.annualReturn = this.calculateAnnualReturn(data.values);
        this.updateInvestmentChart();
      }
    });
  }

  simulateInvestment(
    initialAmount: number,
    annualReturn: number,
    periodMonths: number,
  ) {
    const values = [];
    let currentAmount = initialAmount;

    const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;

    for (let month = 1; month <= periodMonths; month++) {
      currentAmount *= 1 + monthlyReturn;
      values.push(currentAmount);
    }

    const labels = Array.from(
      { length: periodMonths },
      (_, index) => `Mese ${index + 1}`,
    );

    return { labels, values };
  }

  updateInvestmentChart() {
    const { labels, values } = this.simulateInvestment(
      this.investmentAmount,
      this.annualReturn,
      this.investmentPeriod,
    );

    if (this.investmentChart) {
      this.investmentChart.data.labels = labels;
      this.investmentChart.data.datasets[0].data = values;
      this.investmentChart.update();
      console.log('Grafico aggiornato:', this.investmentChart);
    } else {
      this.createInvestmentChart(labels, values);
    }
  }

  createInvestmentChart(labels: string[], values: number[]) {
    this.investmentChart = new Chart('investmentChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Prospetto di Guadagno (USD)',
            data: values,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
            text: `Simulazione Investimento (${this.selectedAsset})`,
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
              text: 'Periodo di Investimento',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Valore (USD)',
            },
          },
        },
      },
    });
  }

  onSubmit() {
    this.loadAssetData();
  }

  calculateAnnualReturn(data: any[]): number {
    if (data.length < 2) {
      console.error('Dati insufficienti per calcolare il rendimento.');
      return 0;
    }

    data.sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
    );

    let initialPrice = parseFloat(data[0].close);
    let finalPrice = parseFloat(data[data.length - 1].close);

    const timePeriodInYears =
      (new Date(data[data.length - 1].datetime).getTime() -
        new Date(data[0].datetime).getTime()) /
      (1000 * 3600 * 24 * 365);

    const annualReturn =
      Math.pow(finalPrice / initialPrice, 1 / timePeriodInYears) - 1;

    return annualReturn * 100;
  }

  getImportoClass(importo: number): string {
    return importo >= 0 ? 'text-success' : 'text-danger';
  }
}
