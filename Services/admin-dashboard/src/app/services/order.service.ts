import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private configService: AppConfigService) { }

  private get apiUrl() {
    return `${this.configService.orderServiceUrl}/api/orders`;
  }

  // Fetch all orders
  getOrders(): Observable<any> {
    const token = localStorage.getItem('tokenAdmin');
    if (!token) {
      throw new Error('No admin token found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(this.apiUrl, { headers });
  }
}
