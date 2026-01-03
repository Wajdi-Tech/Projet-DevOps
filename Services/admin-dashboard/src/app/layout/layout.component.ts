import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  showNotifications = false;
  notifications: any[] = [];
  unreadCount = 0;

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    // 1. Check for Low Stock Products
    this.productService.getProducts().subscribe({
      next: (products) => {
        const lowStock = products.filter((p: any) => p.Stock < 5);
        lowStock.forEach(p => {
          this.notifications.push({
            title: 'Low Stock Alert',
            message: `${p.Name} is running low (${p.Stock} left).`,
            time: 'Just now',
            type: 'warning',
            icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
            color: 'text-yellow-500 bg-yellow-50'
          });
        });
        this.updateUnreadCount();
      }
    });

    // 2. Check for Recent Orders
    this.orderService.getOrders().subscribe({
      next: (response) => {
        const orders = response.orders || [];
        // Mocking "New Order" since we don't have real-time sockets yet
        // taking the latest order as a notification
        if (orders.length > 0) {
          const latest = orders[0]; // Assuming sorted or just taking first
          this.notifications.push({
            title: 'New Order Received',
            message: `Order #${latest._id.slice(-6).toUpperCase()} from ${latest.user?.firstName}`,
            time: new Date(latest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'info',
            icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
            color: 'text-blue-500 bg-blue-50'
          });
        }
        this.updateUnreadCount();
      }
    });
  }

  updateUnreadCount(): void {
    this.unreadCount = this.notifications.length;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  onLogout(): void {
    localStorage.removeItem('tokenAdmin');
    window.location.href = '/';  // Remove JWT token
  }
}