import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Import helper method to check platform

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(): boolean {
    // Check if we are on the browser (client-side)
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('tokenAdmin');
      if (!token) {
        this.router.navigate(['/login']);
        return false;
      }
    }
    return true;
  }
}
