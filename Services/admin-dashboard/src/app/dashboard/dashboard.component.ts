import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    products: 0,
    orders: 0,
    revenue: 0,
    lowStock: 0
  };

  recentOrders: any[] = [];
  isLoading = true;

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.isLoading = true;

    // Fetch Products
    this.productService.getProducts().subscribe({
      next: (products: any[]) => {
        this.stats.products = products.length;
        this.stats.lowStock = products.filter((p: any) => p.Stock < 5).length;
      },
      error: () => console.error('Failed to fetch products')
    });

    // Fetch Orders
    this.orderService.getOrders().subscribe({
      next: (response: any) => {
        const orders = response.orders || [];
        this.stats.orders = orders.length;
        this.stats.revenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);

        // Get 5 most recent orders
        this.recentOrders = orders
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        this.isLoading = false;
      },
      error: () => {
        console.error('Failed to fetch orders');
        this.isLoading = false;
      }
    });
  }
}
