import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url=environment.apiURL

  constructor(private http:HttpClient,
    private route:Router
  ) { }

  login(data:any){
    return this.http.post(this.url+"/user/login",data,{headers:new HttpHeaders().set('Content-Type','application/json')})
  }

  isLogined(){
    let token=localStorage.getItem('token')
    if(token == undefined || token == '' || token == null){
      return false;
    }
    else{
      // this.route.navigate(['/shop/dashbord'])
      return true;
    }
  }

  checkToken(){
    return this.http.get(this.url+"/user/checkToken");
  }

  logout(){
    localStorage.removeItem('token');
    return true;
  }

  getToken(){
    return localStorage.getItem('token');
  }

}
