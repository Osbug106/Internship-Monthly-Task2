import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FetchCategoriesService {

  constructor(private Http: HttpClient) { }

  getCategories()
  {
    let header = new HttpHeaders;
    header = header.append('Content-Type', 'application/json');
    return this.Http.get('http://localhost:8080/categories', {headers:header});
  }
}
