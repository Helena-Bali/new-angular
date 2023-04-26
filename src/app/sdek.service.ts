import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../environments/environment.prod";

@Injectable({
  providedIn: 'root'
})

export class SdekService {
  server =  environment.djangoServer;
  citiesUrl = `${this.server}/api/dl_towns/`;
  calculateUrl = `${this.server}/api/dl_calc/`;

  constructor(private http: HttpClient) {
  }

  getCities() {
    return this.http.get(this.citiesUrl);
  }

   calculate(data){
    return this.http.post(this.calculateUrl, {data});
  }
}

