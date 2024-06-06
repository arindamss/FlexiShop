import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
    {
        path:'cafe', 
        // component:MainComponent,
        canActivateChild:[authGuard],
        data:{
            roles:['admin','user']
        },
        children:[
            {
                path:'',
                redirectTo:'cafe/dashbord',
                pathMatch:'full'
            },
            {
                path:'dashbord',
                loadComponent: () => import('./components/login-dashbord/login-dashbord.component').then((c) =>{
                    return c.LoginDashbordComponent
                })
            }
        ]
    }
    
];
