import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

interface PackageType {
  name: string;
  icon: string;
  avgPrice: number;
}

interface PackageBreakdown {
  count: number;
  revenue: number;
}

interface TimeframeData {
  shipments: number[];
  revenue: number[];
  labels: string[];
  total: number;
  totalRevenue: number;
  avgDaily: number;
  avgDelivery: number;
  avgPrice: number;
  successRate: number;
  packageBreakdown: Record<string, PackageBreakdown>;
}

@Component({
  selector: 'app-estadisticas',
  imports: [FormsModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css',]
})
export class EstadisticasComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('shipmentsChart', { static: true }) shipmentsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart', { static: true }) statusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('packageTypesChart', { static: true }) packageTypesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart', { static: true }) revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendChart', { static: true }) trendChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('methodChart', { static: true }) methodChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('regionChart', { static: true }) regionChartRef!: ElementRef<HTMLCanvasElement>;

  private charts: Record<string, Chart> = {};
  private updateInterval?: number;

  currentTimeframe: string = 'week';
  currentPackageType: string = 'general';

  // Estadísticas mostradas
  stats = {
    totalShipments: 48,
    totalRevenue: '$12,450',
    avgDeliveryTime: '3.5',
    successRate: '94%',
    avgPerDay: '6.8',
    avgPrice: '$259'
  };

  packageTypes: Record<string, PackageType> = {
    fragil: { name: 'Frágil', icon: '🚨', avgPrice: 420 },
    sobres: { name: 'Sobres', icon: '✉️', avgPrice: 85 },
    grande: { name: 'Grande', icon: '📦', avgPrice: 380 },
    pequeno: { name: 'Pequeño', icon: '📋', avgPrice: 150 },
    estandar: { name: 'Estándar', icon: '📄', avgPrice: 220 }
  };

  data: Record<string, TimeframeData> = {
    week: {
      shipments: [6, 8, 5, 9, 7, 4, 9],
      revenue: [1560, 2080, 1300, 2340, 1820, 1040, 2310],
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      total: 48,
      totalRevenue: 12450,
      avgDaily: 6.8,
      avgDelivery: 3.5,
      avgPrice: 259,
      successRate: 94,
      packageBreakdown: {
        fragil: { count: 8, revenue: 3360 },
        sobres: { count: 12, revenue: 1020 },
        grande: { count: 9, revenue: 3420 },
        pequeno: { count: 11, revenue: 1650 },
        estandar: { count: 8, revenue: 1760 }
      }
    },
    month: {
      shipments: [7, 8, 6, 7, 8, 5, 6, 7, 9, 8, 6, 7, 8, 5, 9, 7, 6, 8, 7, 9, 6, 5, 8, 7, 8, 6, 7, 9, 8, 6, 5],
      revenue: Array.from({length: 31}, (_, i) => Math.floor(Math.random() * 1000) + 1200),
      labels: Array.from({length: 31}, (_, i) => (i + 1).toString()),
      total: 205,
      totalRevenue: 53075,
      avgDaily: 6.6,
      avgDelivery: 3.4,
      avgPrice: 259,
      successRate: 93.5,
      packageBreakdown: {
        fragil: { count: 34, revenue: 14280 },
        sobres: { count: 51, revenue: 4335 },
        grande: { count: 38, revenue: 14440 },
        pequeno: { count: 47, revenue: 7050 },
        estandar: { count: 35, revenue: 7700 }
      }
    },
    quarter: {
      shipments: [205, 210, 205],
      revenue: [53075, 54390, 53075],
      labels: ['Mes 1', 'Mes 2', 'Mes 3'],
      total: 620,
      totalRevenue: 160540,
      avgDaily: 6.9,
      avgDelivery: 3.6,
      avgPrice: 259,
      successRate: 92.7,
      packageBreakdown: {
        fragil: { count: 103, revenue: 43260 },
        sobres: { count: 155, revenue: 13175 },
        grande: { count: 115, revenue: 43700 },
        pequeno: { count: 142, revenue: 21300 },
        estandar: { count: 105, revenue: 23100 }
      }
    },
    year: {
      shipments: [180, 165, 175, 190, 205, 95],
      revenue: [46620, 42735, 45325, 49210, 53075, 24605],
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun*'],
      total: 1010,
      totalRevenue: 261570,
      avgDaily: 6.7,
      avgDelivery: 3.5,
      avgPrice: 259,
      successRate: 92,
      packageBreakdown: {
        fragil: { count: 168, revenue: 70560 },
        sobres: { count: 252, revenue: 21420 },
        grande: { count: 187, revenue: 71060 },
        pequeno: { count: 232, revenue: 34800 },
        estandar: { count: 171, revenue: 37620 }
      }
    }
  };

  colors = {
    primary: '#e67e22',
    secondary: '#d35400',
    tertiary: '#2c3e50',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db',
    light: '#ecf0f1',
    muted: '#95a5a6',
    fragil: '#e74c3c',
    sobres: '#3498db',
    grande: '#9b59b6',
    pequeno: '#1abc9c',
    estandar: '#f39c12'
  };

  ngOnInit(): void {
    this.setupChartDefaults();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeCharts();
      this.updateStats();
      this.startAutoUpdate();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.destroyCharts();
  }

  private setupChartDefaults(): void {
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(44, 62, 80, 0.9)';
    Chart.defaults.plugins.tooltip.titleColor = '#fff';
    Chart.defaults.plugins.tooltip.bodyColor = '#fff';
    Chart.defaults.plugins.tooltip.borderColor = '#e67e22';
    Chart.defaults.plugins.tooltip.borderWidth = 2;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
  }

  private getFilteredData(): TimeframeData {
    const baseData = this.data[this.currentTimeframe];
    
    if (this.currentPackageType === 'general') {
      return baseData;
    }
    
    const packageData = baseData.packageBreakdown[this.currentPackageType];
    const ratio = packageData.count / baseData.total;
    
    return {
      ...baseData,
      total: packageData.count,
      totalRevenue: packageData.revenue,
      avgPrice: Math.round(packageData.revenue / packageData.count),
      shipments: baseData.shipments.map(val => Math.round(val * ratio)),
      revenue: baseData.revenue.map(val => Math.round(val * ratio))
    };
  }

  private initializeCharts(): void {
    this.createShipmentsChart();
    this.createStatusChart();
    this.createPackageTypesChart();
    this.createRevenueChart();
    this.createTrendChart();
    this.createMethodChart();
    this.createRegionChart();
  }

  private createShipmentsChart(): void {
    const filteredData = this.getFilteredData();
    const ctx = this.shipmentsChartRef.nativeElement.getContext('2d');
    
    if (ctx) {
      this.charts['shipments'] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: filteredData.labels,
          datasets: [{
            label: 'Envíos',
            data: filteredData.shipments,
            borderColor: this.colors.primary,
            backgroundColor: this.colors.primary + '20',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: this.colors.primary,
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: this.colors.light },
              ticks: { color: this.colors.tertiary }
            },
            x: {
              grid: { color: this.colors.light },
              ticks: { color: this.colors.tertiary }
            }
          }
        }
      });
    }
  }

  private createStatusChart(): void {
    const filteredData = this.getFilteredData();
    const delivered = Math.floor(filteredData.total * (filteredData.successRate / 100));
    const pending = filteredData.total - delivered;
    const ctx = this.statusChartRef.nativeElement.getContext('2d');
    
    if (ctx) {
      this.charts['status'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Entregado', 'En Proceso/Pendiente'],
          datasets: [{
            data: [delivered, pending],
            backgroundColor: [this.colors.success, this.colors.warning],
            borderWidth: 3,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { 
                padding: 20,
                color: this.colors.tertiary,
                font: { size: 12 }
              }
            }
          }
        }
      });
    }
  }

  private createPackageTypesChart(): void {
    const packageData = this.data[this.currentTimeframe].packageBreakdown;
    const ctx = this.packageTypesChartRef.nativeElement.getContext('2d');
    
    if (ctx) {
      this.charts['packageTypes'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(packageData).map(key => this.packageTypes[key].name),
          datasets: [{
            data: Object.values(packageData).map(item => item.count),
            backgroundColor: [
              this.colors.fragil,
              this.colors.sobres,
              this.colors.grande,
              this.colors.pequeno,
              this.colors.estandar
            ],
            borderWidth: 3,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { 
                padding: 15,
                color: this.colors.tertiary,
                font: { size: 11 }
              }
            }
          }
        }
      });
    }
  }

  private createRevenueChart(): void {
    const filteredData = this.getFilteredData();
    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    
    if (ctx) {
      this.charts['revenue'] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: filteredData.labels,
          datasets: [{
            label: 'Ingresos (MXN)',
            data: filteredData.revenue,
            backgroundColor: this.colors.success,
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: this.colors.light },
              ticks: { 
                color: this.colors.tertiary,
                callback: function(value) {
                  return '$' + Number(value).toLocaleString();
                }
              }
            },
            x: {
              grid: { display: false },
              ticks: { color: this.colors.tertiary }
            }
          }
        }
      });
    }
  }

  private createTrendChart(): void {
    const ctx = this.trendChartRef.nativeElement.getContext('2d');
    
    if (ctx) {
      this.charts['trend'] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          datasets: [{
            label: '2025',
            data: [180, 165, 175, 190, 205, 95, 0, 0, 0, 0, 0, 0],
            backgroundColor: this.colors.primary,
            borderRadius: 8
          }, {
            label: '2024',
            data: [150, 140, 160, 170, 180, 185, 190, 195, 200, 180, 175, 185],
            backgroundColor: this.colors.secondary + '80',
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { 
                padding: 20,
                color: this.colors.tertiary
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: this.colors.light },
              ticks: { color: this.colors.tertiary }
            },
            x: {
              grid: { display: false },
              ticks: { color: this.colors.tertiary }
            }
          }
        }
      });
    }
  }

  private createMethodChart(): void {
    const ctx = this.methodChartRef.nativeElement.getContext('2d');
    
    if (ctx) {
      this.charts['method'] = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Express', 'Estándar'],
          datasets: [{
            data: [35, 65],
            backgroundColor: [this.colors.error, this.colors.primary],
            borderWidth: 3,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { 
                padding: 20,
                color: this.colors.tertiary
              }
            }
          }
        }
      });
    }
  }

  private createRegionChart(): void {
    const ctx = this.regionChartRef.nativeElement.getContext('2d');
    
    if (ctx) {
      this.charts['region'] = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Culiacán', 'Mazatlán', 'Los Mochis', 'Guasave', 'Navolato', 'El Fuerte'],
          datasets: [{
            label: 'Envíos',
            data: [18, 8, 7, 5, 3, 7],
            backgroundColor: [
              this.colors.primary,
              this.colors.secondary,
              this.colors.info,
              this.colors.success,
              this.colors.warning,
              this.colors.muted
            ],
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { 
                color: this.colors.tertiary,
                maxRotation: 45
              }
            },
            y: {
              beginAtZero: true,
              grid: { color: this.colors.light },
              ticks: { color: this.colors.tertiary }
            }
          }
        }
      });
    }
  }

  changeTimeframe(timeframe: string): void {
    this.currentTimeframe = timeframe;
    this.updateAllCharts();
  }

  changePackageType(packageType: string): void {
    this.currentPackageType = packageType;
    this.updateAllCharts();
  }

  private updateAllCharts(): void {
    const filteredData = this.getFilteredData();
    
    this.updateStats();
    
    // Actualizar gráfico de envíos
    if (this.charts['shipments']) {
      this.charts['shipments'].data.labels = filteredData.labels;
      this.charts['shipments'].data.datasets[0].data = filteredData.shipments;
      this.charts['shipments'].update('active');
    }
    
    // Actualizar gráfico de ingresos
    if (this.charts['revenue']) {
      this.charts['revenue'].data.labels = filteredData.labels;
      this.charts['revenue'].data.datasets[0].data = filteredData.revenue;
      this.charts['revenue'].update('active');
    }
    
    // Actualizar gráfico de estado de envíos
    if (this.charts['status']) {
      const delivered = Math.floor(filteredData.total * (filteredData.successRate / 100));
      const pending = filteredData.total - delivered;
      this.charts['status'].data.datasets[0].data = [delivered, pending];
      this.charts['status'].update('active');
    }
    
    // Actualizar gráfico de tipos de paquetes
    if (this.charts['packageTypes'] && this.currentPackageType === 'general') {
      const packageData = this.data[this.currentTimeframe].packageBreakdown;
      this.charts['packageTypes'].data.datasets[0].data = Object.values(packageData).map(item => item.count);
      this.charts['packageTypes'].update('active');
    }
    
    this.updateRegionChart();
  }

  private updateRegionChart(): void {
    if (!this.charts['region']) return;
    
    const baseRegionData = [18, 8, 7, 5, 3, 7];
    const filteredData = this.getFilteredData();
    const ratio = filteredData.total / this.data[this.currentTimeframe].total;
    
    const adjustedData = baseRegionData.map(val => Math.round(val * ratio));
    this.charts['region'].data.datasets[0].data = adjustedData;
    this.charts['region'].update('active');
  }

  private updateStats(): void {
    const filteredData = this.getFilteredData();
    
    this.stats = {
      totalShipments: filteredData.total,
      totalRevenue: '$' + filteredData.totalRevenue.toLocaleString(),
      avgDeliveryTime: filteredData.avgDelivery.toString(),
      successRate: filteredData.successRate + '%',
      avgPerDay: filteredData.avgDaily.toString(),
      avgPrice: '$' + filteredData.avgPrice.toString()
    };
  }

  private startAutoUpdate(): void {
    this.updateInterval = window.setInterval(() => {
      // Simular pequeños cambios en los datos
      const variation = () => Math.random() * 0.1 - 0.05; // ±5%
      
      Object.keys(this.data).forEach(timeframe => {
        this.data[timeframe].shipments = this.data[timeframe].shipments.map(val => 
          Math.max(1, Math.round(val * (1 + variation())))
        );
        this.data[timeframe].revenue = this.data[timeframe].revenue.map(val => 
          Math.max(100, Math.round(val * (1 + variation())))
        );
      });
      
      this.updateAllCharts();
    }, 300000); // 5 minutos
  }

  private destroyCharts(): void {
    Object.values(this.charts).forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
    this.charts = {};
  }

  exportData(): void {
    const filteredData = this.getFilteredData();
    const exportData = {
      timeframe: this.currentTimeframe,
      packageType: this.currentPackageType,
      data: filteredData,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], 
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estadisticas_${this.currentTimeframe}_${this.currentPackageType}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  printReport(): void {
    window.print();
  }
}