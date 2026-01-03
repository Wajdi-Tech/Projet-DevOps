import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  errorMessage: string = '';

  selectedOrder: any = null;
  isModalOpen: boolean = false;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (response) => {
        this.orders = response.orders;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.errorMessage = 'Failed to fetch orders. Please try again.';
      }
    });
  }

  viewDetails(order: any): void {
    this.selectedOrder = order;
    this.isModalOpen = true;
  }

  closeDetails(): void {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }
}
