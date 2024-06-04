import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from './login.service';
import { jwtDecode } from 'jwt-decode';
import { SnackbarService } from './snackbar.service';
import { GlobalConstants } from '../components/shared/global-constants';

export const authGuard: CanActivateFn = (route, state) => {

  const loginService=inject(LoginService)
  const rout=inject(Router)
  

  if(loginService.isLogined()){
    
    return true;
  }
  else{
    rout.navigate([''])
    return false;
  }
};
