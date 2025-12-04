import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { Enterprise } from './features/enterprise/enterprise';
import { RegisterEnterprise } from './features/register/register-enterprise/register-enterprise';
import { RegisterVessel } from './features/register/register-vessel/register-vessel';
import { RegisterUser } from './features/register/register-user/register-user';
import { EditEnterprise } from './features/edit/edit-enterprise/edit-enterprise';

export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'home',component:Home},
    {path:'login',component:Login},
    {path:'register-enterprise',component:RegisterEnterprise},
    {path:'edit-enterprise/:id',component:EditEnterprise},
    {path:'register-vessel/:id',component:RegisterVessel},
    {path:'register',component:RegisterUser},
    {path:'dashboard',component:Dashboard},
    {path:'enterprise/:id',component:Enterprise},
];
