import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AppConfig {
    productServiceUrl: string;
    authServiceUrl: string;
    orderServiceUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    private config: AppConfig | undefined;

    constructor(private http: HttpClient) { }

    loadConfig(): Promise<void> {
        return lastValueFrom(this.http.get<AppConfig>('/config.json'))
            .then(config => {
                this.config = config;
                console.log('Runtime config loaded:', this.config);
            })
            .catch(err => {
                console.error('Could not load config.json, using environment fallback', err);
                // Fallback to environment.ts if config.json fails (e.g. locally if not set up)
                this.config = {
                    productServiceUrl: environment.productServiceUrl,
                    authServiceUrl: environment.authServiceUrl,
                    orderServiceUrl: environment.orderServiceUrl
                };
            });
    }

    get productServiceUrl(): string {
        return this.config?.productServiceUrl || '';
    }

    get authServiceUrl(): string {
        return this.config?.authServiceUrl || '';
    }

    get orderServiceUrl(): string {
        return this.config?.orderServiceUrl || '';
    }
}
