import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url=environment.apiURL

  constructor(private http:HttpClient) { }

  addCategory(data:any){
    return this.http.post(this.url+"/category/add",data,{headers:new HttpHeaders().set('Content-Type','application/json')})
  }

  updateCategory(data:any){
    return this.http.post(this.url+'/category/update',data,{headers:new HttpHeaders().set('Content-Type','application/json')})
  }

  getCategory(){
    return this.http.get(this.url+'/category/get')
  }

  getFilteredCategorys(){
    return this.http.get(this.url+'/category/get?filterValue=true')
  }
}
