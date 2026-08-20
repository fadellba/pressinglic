import { InjectionToken } from '@angular/core';

export interface KeyValueStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export const STORAGE_PROVIDER = new InjectionToken<KeyValueStorage>('STORAGE_PROVIDER');

export class LocalStorageProvider implements KeyValueStorage {
  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}