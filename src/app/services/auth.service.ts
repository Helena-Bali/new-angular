import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment.prod";
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  server =  environment.djangoServer;
  authUrl = `${this.server}/api/auth/`;

  constructor(private http: HttpClient) { }

  auth(){
    return this.http.get(this.authUrl).subscribe((response) => {
      return response
    });
  }
}
