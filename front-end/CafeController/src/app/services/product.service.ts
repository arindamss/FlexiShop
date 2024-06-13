import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url=environment.apiURL

  constructor(private http:HttpClient) { }

  add(data:any){
    return this.http.post(this.url+'/product/add',data,{headers: new HttpHeaders().set('Content-Type','application/json')})
  }

  update(data:any){
    return this.http.post(this.url+'/product/update',data,{headers: new HttpHeaders().set('Content-Type','application/json')})
  }

  getProduct(){
    return this.http.get(this.url+'/product/get')
  }

  delete(id:any){
    return this.http.post(this.url+'/product/delete/'+id,{headers: new HttpHeaders().set('Content-Type','application/json')})
  }

  updateStatus(data:any){
    return this.http.post(this.url+'/product/updateStatus',data,{headers: new HttpHeaders().set('Content-Type','application/json')})
  }
}
