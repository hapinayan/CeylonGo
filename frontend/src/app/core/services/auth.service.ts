import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Defaults to null (Guest state). Ready for future FastAPI backend integration.
  private readonly _currentUser = signal<User | null>(this.getStoredUser());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  private getStoredUser(): User | null {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const stored = localStorage.getItem('ceylongo_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  setUser(user: User | null): void {
    this._currentUser.set(user);
    if (typeof window !== 'undefined') {
      try {
        if (user) {
          localStorage.setItem('ceylongo_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('ceylongo_user');
        }
      } catch {
        // Ignore storage exceptions
      }
    }
  }

  logout(): void {
    this.setUser(null);
  }
}
