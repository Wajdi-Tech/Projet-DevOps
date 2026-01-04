import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


import { AppConfigService } from './app-config.service';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    constructor(private http: HttpClient, private configService: AppConfigService) { }

    private get apiUrl() {
        return `${this.configService.authServiceUrl}/users`;
    }

    getCustomers(): Observable<any[]> {
        const token = localStorage.getItem('tokenAdmin');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<any[]>(this.apiUrl, { headers });
    }
}
