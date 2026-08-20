export interface StatMetrics {
  tickets_created_today: number;
  tickets_retrieved_today: number;
  revenue_today: number;
  tickets_per_month?: { month: number; count: number }[];
  revenue_by_service?: {
    service: string;
    total: number;
    revenue_by_month: { month: number; revenue: number }[];
  }[];
}