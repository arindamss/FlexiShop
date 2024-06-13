import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { authGuard } from './services/auth.guard';
import { DashbordComponent } from './components/dashbord/dashbord.component';
import { CategoryComponent } from './components/category/category.component';

export const routes: Routes = [
    {path:'', component:DashbordComponent},
    {
        path:'cafe', 
        // component:MainComponent,
        // canActivateChild:[authGuard],
        // data:{
        //     roles:['admin','user']
        // },
        children:[
            {
                path:'',
                redirectTo:'cafe/dashbord',
                pathMatch:'full'
            },
            {
                path:'dashbord',
                canActivate:[authGuard],
                data:{
                    roles:['admin','user']
                },
                loadComponent: () => import('./components/login-dashbord/login-dashbord.component').then((c) =>{
                    return c.LoginDashbordComponent
                })
            },
            {
                path:'category',
                canActivate:[authGuard],
                data:{
                    roles:['admin']
                },
                loadComponent: () => import('./components/category/category.component').then((d) =>{
                    return d.CategoryComponent  
                })
            },
            {
                path:'product',
                canActivate:[authGuard],
                data:{
                    roles:['admin']
                },
                loadComponent:() => import('./components/manage-product/manage-product.component').then((d) =>{
                    return d.ManageProductComponent
                })
            }

        ]
    }
    
];
