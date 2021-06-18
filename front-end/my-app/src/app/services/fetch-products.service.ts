import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FetchProductsService {
  URL ="http://localhost:8080";

  constructor(private Http:HttpClient) { }

  getProducts(url)
  {
    let header = new HttpHeaders;
    header = header.append('Content-Type', 'application/json');
    return this.Http.get(this.URL+url, {headers:header});
  }

  getProductDetails(url)
  {
    let header = new HttpHeaders;
    header = header.append('Content-Type', 'application/json');
    console.log("URL", this.URL+url);
    return this.Http.get(this.URL+url, {headers:header});
  }
}
