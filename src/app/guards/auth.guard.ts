import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthService} from "../services/auth.service";
import {environment} from "../../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  server =  environment.djangoServer;
  authent = false;
  constructor(private auth: AuthService) {
     this.is_auth()
  }

  is_auth(){
    return this.auth.auth()['auth']
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    /**
    alert(this.is_auth());
    if (this.is_auth()) {
      return true;
    } else {
      window.location.href = encodeURI(`${this.server}/admin/login/?next=/calc/`);
      return false;
    }
     **/
    return true;
  }
}
