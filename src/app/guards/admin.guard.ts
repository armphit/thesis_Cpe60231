import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../services/http.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private notfoundPath: string = '/notfound';
  constructor(public service: HttpService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (JSON.parse(localStorage.getItem('userLogin')).status == '3000') {
      return true;
    } else {
      this.service.navRouter(this.notfoundPath);
      return false;
    }
  }
}
