import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly counter = new BehaviorSubject<number>(0);
  private readonly loading$ = new BehaviorSubject<boolean>(false);

  get isLoading$(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  show(): void {
    const next = this.counter.value + 1;
    this.counter.next(next);
    if (!this.loading$.value) this.loading$.next(true);
  }

  hide(): void {
    const next = Math.max(0, this.counter.value - 1);
    this.counter.next(next);
    if (next === 0 && this.loading$.value) this.loading$.next(false);
  }
}

