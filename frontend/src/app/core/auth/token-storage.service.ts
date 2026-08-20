import { inject, Injectable } from '@angular/core';
import { STORAGE_PROVIDER } from '../storage/storage-provider';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private readonly storage = inject(STORAGE_PROVIDER);

  getToken(): string | null {
    return this.storage.get(TOKEN_KEY);
  }

  setToken(token: string): void {
    this.storage.set(TOKEN_KEY, token);
  }

  hasToken(): boolean {
    return this.getToken() !== null;
  }

  clear(): void {
    this.storage.remove(TOKEN_KEY);
  }
}