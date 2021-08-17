import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AppAuthGuard implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivateChild(): boolean {
    if (!this.authService.isAuthenticated) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } else {
      return true;
    }
  }
}
