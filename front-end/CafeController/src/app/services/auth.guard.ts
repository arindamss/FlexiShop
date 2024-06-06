import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';
import { jwtDecode } from 'jwt-decode';
import { SnackbarService } from './snackbar.service';
import { GlobalConstants } from '../components/shared/global-constants';

export const authGuard: CanActivateFn = (route, state) => {
  debugger

  const loginService=inject(LoginService)
  const rout=inject(Router)

  const snackbar=inject(SnackbarService)
  console.log(route.data['roles']);
  

  let expectedRoleArray=route.data['roles']
  // const expectedRoleArray:string[]=route.data;

  const token:any=localStorage.getItem('token')

  var tokenPayload:any;

  try{
    tokenPayload=jwtDecode(token)
  }
  catch(err){
    localStorage.clear();
    rout.navigate(['/'])
  }
  
  var expectedRole='';
  console.log("ExpectedRoleArray Length : ", expectedRoleArray.length);
  
  for(var i=0;i<expectedRoleArray.length;i++){
    if(expectedRoleArray[i] == tokenPayload.role){
      expectedRole=tokenPayload.role;
    }
  }

  if(tokenPayload.role == 'user' || tokenPayload.role == 'admin'){
    if(loginService.isLogined() && tokenPayload.role == expectedRole){
      return true;
    }
    snackbar.openSnackbar(GlobalConstants.unauthorized,GlobalConstants.error)
    rout.navigate(['/cafe/dashbord'])
    return false;
  }
  else{
    rout.navigate(['/'])
    localStorage.clear();
    return false;
  }






  // if(loginService.isLogined()){
    
  //   return true;
  // }
  // else{
  //   rout.navigate([''])
  //   return false;
  // }
};
