import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/login/login';
import { RegisterEnterprise } from './features/register-enterprise/register-enterprise';
import { Dashboard } from './features/dashboard/dashboard';
import { Enterprise } from './features/enterprise/enterprise';
import { Register } from './features/register/register';

export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'home',component:Home},
    {path:'login',component:Login},
    {path:'register-enterprise',component:RegisterEnterprise},
    {path:'register',component:Register},
    {path:'dashboard',component:Dashboard},
    {path:'enterprise/:id',component:Enterprise},
];
