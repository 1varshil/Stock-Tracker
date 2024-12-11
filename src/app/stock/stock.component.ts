// stock.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { StockService } from '../stock.service';
import { interval } from 'rxjs';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {
  stockSymbol = '';
  stockData: any;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.getStockPrice();
    interval(3000).subscribe(() => {
      this.getStockPrice();
    });
  }

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartData<'line'> = {
    datasets: [
      { data: [], label: 'Current Price', borderColor: '#3cba9f', fill: false },
      { data: [], label: 'Open Price', borderColor: '#ffcc00', fill: false },
      { data: [], label: 'High Price', borderColor: '#ffa500', fill: false },
      { data: [], label: 'Low Price', borderColor: '#ff0000', fill: false }
    ],
    labels: []
  };

  // Bar Chart Options
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Stock Prices'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price in USD'
        }
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    datasets: [
      {
        data: [],
        label: 'Stock Prices',
        backgroundColor: '#3cba9f',
        borderColor: '#3cba9f',
        borderWidth: 1
      }
    ],
    labels: ['Current', 'Open', 'High', 'Low']  // Labels for the four price categories
  };

  getStockPrice() {
    this.stockService.getStockPrice(this.stockSymbol).subscribe({
      next: (data) => {
        this.stockData = data;

        // Update chart data
        if (this.stockData) {
          this.lineChartData.datasets[0].data.push(this.stockData.c);
          this.lineChartData.datasets[1].data.push(this.stockData.o);
          this.lineChartData.datasets[2].data.push(this.stockData.h);
          this.lineChartData.datasets[3].data.push(this.stockData.l);
          this.lineChartData.labels!.push(new Date().toLocaleTimeString());


          // Update Bar Chart data
          this.barChartData.datasets[0].data = [
            this.stockData.c,  // Current Price
            this.stockData.o,  // Open Price
            this.stockData.h,  // High Price
            this.stockData.l   // Low Price
          ];

          // Refresh the chart
          this.chart?.update();
        }
      },
      error: (error) => {
        console.error("Error fetching stock data", error);
      }
    });
  }
}

