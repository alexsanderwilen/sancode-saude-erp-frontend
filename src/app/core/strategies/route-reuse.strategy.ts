import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class ReuseRouteStrategy implements RouteReuseStrategy {
  private stored = new Map<string, DetachedRouteHandle>();

  private buildKey(route: ActivatedRouteSnapshot): string | null {
    const cfg = route.routeConfig;
    if (!cfg || !cfg.path) return null;
    // Key by route path; for list routes without params this is sufficient
    return cfg.path;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const cfg = route.routeConfig as any;
    const compName: string | undefined = cfg?.component?.name;
    const flag = !!route.data && !!route.data['reuse'];
    const isListComponent = !!compName && /ListComponent$/.test(compName);
    return flag || isListComponent;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    const key = this.buildKey(route);
    if (key && handle) {
      this.stored.set(key, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.buildKey(route);
    if (!key) return false;
    if (!this.stored.has(key)) return false;
    const cfg = route.routeConfig as any;
    const compName: string | undefined = cfg?.component?.name;
    const flag = !!route.data && !!route.data['reuse'];
    const isListComponent = !!compName && /ListComponent$/.test(compName);
    return flag || isListComponent;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.buildKey(route);
    return key ? (this.stored.get(key) || null) : null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
