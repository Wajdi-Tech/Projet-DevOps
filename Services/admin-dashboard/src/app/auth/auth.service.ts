import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { AppConfigService } from '../services/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient, private configService: AppConfigService) { }

  private get baseUrl() {
    return this.configService.authServiceUrl;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/adminsignin`, { email, password });
  }
}
