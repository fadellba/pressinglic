import { HttpErrorResponse } from '@angular/common/http';

export class ApiError {
  readonly status: number;
  readonly message: string;
  readonly errors: Record<string, string[]> | null;

  constructor(status: number, message: string, errors: Record<string, string[]> | null = null) {
    this.status = status;
    this.message = message;
    this.errors = errors;
  }

  fieldError(field: string): string | null {
    const list = this.errors?.[field];
    return list && list.length > 0 ? list[0] : null;
  }

  static fromHttp(response: HttpErrorResponse): ApiError {
    const body = response.error as { message?: string; errors?: Record<string, string[]> } | null;
    return new ApiError(
      response.status,
      body?.message ?? (response.status === 0 ? 'Impossible de joindre le serveur.' : 'Une erreur est survenue.'),
      body?.errors ?? null,
    );
  }
}