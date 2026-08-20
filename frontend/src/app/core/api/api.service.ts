import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { APP_CONFIG } from '../config/config';
import { ApiError } from './api-error';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = APP_CONFIG.apiUrl.replace(/\/+$/, '');

  private path(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.http
      .get<T>(this.path(path), { params: params as never })
      .pipe(catchError((err) => this.fail(err)));
  }

  getUnwrapped<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T[]> {
    return this.get<{ data: T[] } | T[]>(path, params).pipe(map((body) => (Array.isArray(body) ? body : body.data)));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.path(path), body).pipe(catchError((err) => this.fail(err)));
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(this.path(path), body).pipe(catchError((err) => this.fail(err)));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.path(path), body).pipe(catchError((err) => this.fail(err)));
  }

  delete(path: string): Observable<void> {
    return this.http.delete<void>(this.path(path)).pipe(catchError((err) => this.fail(err)));
  }

  download(path: string): Observable<Blob> {
    return this.http.get(this.path(path), { responseType: 'blob' }).pipe(catchError((err) => this.fail(err)));
  }

  private fail(response: unknown): Observable<never> {
    return throwError(() => ApiError.fromHttp(response as never));
  }
}