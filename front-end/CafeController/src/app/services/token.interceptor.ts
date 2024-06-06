import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const rout=inject(Router)
  const token=localStorage.getItem('token')

  if(token){
    req=req.clone({
      setHeaders: {Authorization:`Bearer ${token}`}
    })
  }


  return next(req).pipe(catchError((err) =>{
    if(err instanceof HttpErrorResponse){
      console.log(err.url);
      if(err.status === 401 || err.status === 403){
        if(rout.url === '/'){}
        else{
          localStorage.clear();
          rout.navigate(['/']);
        }
      }
    }
    return throwError(err);
  }));
};
