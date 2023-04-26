import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})


export class PekService {
  server =  environment.djangoServer;
  // citiesUrl = `${this.server}/api/pecom_towns/`;
  citiesUrl = `${this.server}/api/pecom_towns_V_2/`;
  // calculateUrl = `${this.server}/api/pecom_calc/`; pecom_calc_V_2/
  calculateUrl = `${this.server}/api/pecom_calc_V_2/`;

  constructor(private http: HttpClient) {
  }

  getCities() {
    return this.http.get(this.citiesUrl);
  }

  calculate(data) {
    return this.http.post(this.calculateUrl, {data});
  }
}
