import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = environment.productServiceUrl;

    constructor(private http: HttpClient) { }

    getProducts(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getProduct(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createProduct(product: FormData, token: string): Observable<any> {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.post<any>(this.apiUrl, product, { headers });
    }

    updateProduct(id: number, product: FormData | any, token: string): Observable<any> {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.put<any>(`${this.apiUrl}/${id}`, product, { headers });
    }

    deleteProduct(id: number, token: string): Observable<any> {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
    }
}
