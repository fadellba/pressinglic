import { ChangeDetectionStrategy, Component, AfterViewInit, DestroyRef, ElementRef, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StatService } from '../../services/stat.service';
import { StatMetrics } from '../../../../core/models/stat.model';
import { CfaCurrencyPipe } from '../../../../shared/pipes/currency-cfa.pipe';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

const MONTH_OPTIONS = MONTH_LABELS.map((label, index) => ({ value: index + 1, label }));

interface RevenueData {
  labels: string[];
  values: number[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, CfaCurrencyPipe],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private statService = inject(StatService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  stats = signal<StatMetrics | null>(null);
  isLoading = signal(true);
  selectedMonth = signal<number | 'all'>('all');
  monthOptions = MONTH_OPTIONS;

  hasMonthlyData = computed(() => !!this.stats()?.tickets_per_month?.length);
  hasRevenueData = computed(() => !!this.stats()?.revenue_by_service?.length);

  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;

  chart1?: Chart;
  chart2?: Chart;
  private viewReady = false;

  ngOnInit() {
    this.statService
      .getStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.stats.set(data);
          this.isLoading.set(false);
          if (this.viewReady) {
            this.renderCharts(data);
          }
        },
      });
  }

  ngAfterViewInit() {
    this.viewReady = true;
    if (this.stats()) {
      this.renderCharts(this.stats()!);
    }
  }

  ngOnDestroy() {
    this.chart1?.destroy();
    this.chart2?.destroy();
  }

  navigateToTickets() {
    this.router.navigate(['/admin/tickets']);
  }

  setSelectedMonth(month: number | 'all') {
    this.selectedMonth.set(month);
    if (this.stats() && this.revenueChartRef) {
      this.renderRevenueChart(this.stats()!);
    }
  }

  revenueData(data: StatMetrics): RevenueData {
    const byService = data.revenue_by_service ?? [];

    if (this.selectedMonth() === 'all') {
      return {
        labels: byService.map((s) => s.service),
        values: byService.map((s) => s.total),
      };
    }

    const month = this.selectedMonth();
    const entries = byService
      .map((s) => {
        const monthData = s.revenue_by_month?.find((m) => m.month === month);
        return { service: s.service, revenue: monthData?.revenue ?? 0 };
      })
      .filter((e) => e.revenue > 0);

    return {
      labels: entries.map((e) => e.service),
      values: entries.map((e) => e.revenue),
    };
  }

  renderCharts(data: StatMetrics) {
    if (this.monthlyChartRef && data.tickets_per_month?.length) {
      this.chart1?.destroy();
      this.chart1 = new Chart(this.monthlyChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: data.tickets_per_month.map((m) => MONTH_LABELS[(m.month - 1) % 12] ?? m.month),
          datasets: [
            {
              label: 'Nombre de tickets',
              data: data.tickets_per_month.map((m) => m.count),
              backgroundColor: '#10B981',
              borderRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: { ticks: { color: '#94A3B8' }, grid: { display: false } },
            y: { ticks: { color: '#94A3B8' }, grid: { color: '#1E293B' } },
          },
        },
      });
    }

    this.renderRevenueChart(data);
  }

  renderRevenueChart(data: StatMetrics) {
    if (!this.revenueChartRef || !data.revenue_by_service?.length) {
      return;
    }

    const revenue = this.revenueData(data);

    this.chart2?.destroy();
    this.chart2 = new Chart(this.revenueChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: revenue.labels,
        datasets: [
          {
            data: revenue.values,
            backgroundColor: ['#10B981', '#06B6D4', '#6366F1', '#F59E0B', '#EC4899'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#CBD5E1', font: { size: 11 } },
          },
        },
      },
    });
  }
}