import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashbordService {

  url=environment.apiURL;

  constructor(private httpClient:HttpClient) { }

  getDetails(){
    return this.httpClient.get(this.url+"/dashbord/details");
  }
}
