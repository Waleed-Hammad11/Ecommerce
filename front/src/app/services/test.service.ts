import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private _HttpClient:HttpClient) { }

    getProducts(): Observable<any>{
      return this._HttpClient.get('http://localhost:3000/admin/products');
    }
}