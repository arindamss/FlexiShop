import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';
import { jwtDecode } from 'jwt-decode';
import { SnackbarService } from './snackbar.service';
import { GlobalConstants } from '../components/shared/global-constants';

export const authGuard: CanActivateFn = (route, state) => {

  const loginService=inject(LoginService)
  const rout=inject(Router)
  // const snackbarService=inject(SnackbarService)

  // let expectedRoleArray=route.data;
  // let expectedRoleArray2:string[]=expectedRoleArray['expectedRole']

  // const token=localStorage.getItem('token')

  // var tokenPayload:any;
  // if(typeof token === 'string'){

  //   try{
  //     tokenPayload=jwtDecode(token)
  //   }
  //   catch(err){
  //     localStorage.clear();
  //     rout.navigate(['/']);
  //   }

  //   let expectedrole= '';

  //   for(let i=0;i<expectedRoleArray2.length;i++){
  //     if(expectedRoleArray2[i] == tokenPayload.role){
  //       expectedrole=tokenPayload.role;
  //     }
  //   }

  //   if(tokenPayload.role == 'user' || tokenPayload.role == 'admin'){
  //     if(loginService.isLogined() && tokenPayload.role == expectedrole){
  //       return true;
  //     }
  //     snackbarService.openSnackbar(GlobalConstants.unauthorized, GlobalConstants.error);
  //     rout.navigate(['/cafe/dashbord'])
  //     return false;
  //   }
  //   rout.navigate(['/'])
  //   localStorage.clear();
  //   return false;


  // }
  // else{
  //   console.log("No JWT Token found in LocalStorage");
  //   return false;
  // }

  if(loginService.isLogined()){
    
    return true;
  }
  else{
    rout.navigate([''])
    return false;
  }
};
