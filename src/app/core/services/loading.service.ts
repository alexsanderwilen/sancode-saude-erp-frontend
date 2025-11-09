import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly counter = new BehaviorSubject<number>(0);
  private readonly loading$ = new BehaviorSubject<boolean>(false);
  private showDelayTimer?: number;
  private hideDelayTimer?: number;
  private visibleSince: number | null = null;

  // Tuning: avoid flicker for fast requests and keep overlay stable briefly
  private readonly showDelayMs = 150;
  private readonly minVisibleMs = 250;

  get isLoading$(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  show(): void {
    const next = this.counter.value + 1;
    this.counter.next(next);

    // If already visible or scheduled, do nothing further
    if (this.loading$.value) {
      return;
    }

    // Cancel any pending hide while more requests start
    if (this.hideDelayTimer) {
      clearTimeout(this.hideDelayTimer);
      this.hideDelayTimer = undefined;
    }

    // Schedule showing after a small delay to avoid flashing for quick requests
    if (!this.showDelayTimer) {
      this.showDelayTimer = window.setTimeout(() => {
        this.showDelayTimer = undefined;
        // Only show if there are still active requests
        if (this.counter.value > 0 && !this.loading$.value) {
          this.loading$.next(true);
          this.visibleSince = Date.now();
        }
      }, this.showDelayMs);
    }
  }

  hide(): void {
    const next = Math.max(0, this.counter.value - 1);
    this.counter.next(next);

    // If no more active requests, decide when to hide
    if (next === 0) {
      // If we haven't shown yet (still in show delay), cancel it and ensure hidden
      if (this.showDelayTimer) {
        clearTimeout(this.showDelayTimer);
        this.showDelayTimer = undefined;
        this.visibleSince = null;
        if (this.loading$.value) {
          this.loading$.next(false);
        }
        return;
      }

      if (this.loading$.value) {
        const elapsed = this.visibleSince ? Date.now() - this.visibleSince : 0;
        const remaining = Math.max(0, this.minVisibleMs - elapsed);

        if (this.hideDelayTimer) {
          clearTimeout(this.hideDelayTimer);
        }
        this.hideDelayTimer = window.setTimeout(() => {
          this.hideDelayTimer = undefined;
          // Guard against late hide if new requests started
          if (this.counter.value === 0 && this.loading$.value) {
            this.loading$.next(false);
            this.visibleSince = null;
          }
        }, remaining);
      }
    }
  }
}
