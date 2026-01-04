import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private apiUrl = `${environment.authServiceUrl}/users`;

    constructor(private http: HttpClient) { }

    getCustomers(): Observable<any[]> {
        const token = localStorage.getItem('tokenAdmin');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get<any[]>(this.apiUrl, { headers });
    }
}
