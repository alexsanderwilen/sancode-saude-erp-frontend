import { HttpEvent, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const loading = inject(LoadingService);

  // Opt-out header: skip global loading for grid/paginated data fetches
  const skipGlobalLoading = req.headers.has('x-no-global-loading') ||
    (req.method === 'GET' && typeof req.params?.has === 'function' && req.params.has('page') && req.params.has('size'));
  if (skipGlobalLoading) {
    return next(req);
  }

  loading.show();
  return next(req).pipe(finalize(() => loading.hide()));
};
