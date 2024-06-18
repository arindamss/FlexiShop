import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css'
})
export class DashbordComponent implements OnInit {

  constructor(private loginService:LoginService, private route:Router){
    if(this.loginService.isLogined()){
      this.route.navigate(['/shop/dashbord'])
    }
  }

  ngOnInit(){
    
  }

}
