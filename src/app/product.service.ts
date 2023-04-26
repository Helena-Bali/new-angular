import { Injectable } from '@angular/core';
import {environment} from "../environments/environment.prod";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  server =  environment.djangoServer;
  citiesUrl = `${this.server}/api/products/`;

  constructor(private http: HttpClient) { }

  getProducts(q?) {
    let r: any;
    console.log(q);
    if(q){
      let params = new HttpParams();
      params = params.append('q', q);
      r = this.http.get(this.citiesUrl, {params: params})
    } else {
      r = this.http.get(this.citiesUrl);
    }
    return r;
  }
}
