import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiErrorResponse } from '../../models/product.model';

export const apiErrorInterceptor: HttpInterceptorFn = (request, next) => {
  return next(request).pipe(
    catchError((error: unknown) => {
      return throwError(() => mapApiError(error));
    })
  );
};

export function mapApiError(error: unknown): Error {
  if (error instanceof HttpErrorResponse) {
    const apiError = error.error as ApiErrorResponse | null;
    const message = apiError?.errors?.length
      ? apiError.errors.join(' ')
      : apiError?.message || 'A request failed while talking to the API.';

    return new Error(message);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error('An unexpected client error occurred.');
}
