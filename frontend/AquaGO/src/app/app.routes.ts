import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { Enterprise } from './features/enterprise/enterprise';
import { RegisterEnterprise } from './features/register/register-enterprise/register-enterprise';
import { RegisterVessel } from './features/register/register-vessel/register-vessel';
import { RegisterUser } from './features/register/register-user/register-user';
import { EditEnterprise } from './features/edit/edit-enterprise/edit-enterprise';
import { Checkout } from './features/checkout/checkout';
import { RegisterTrip } from './features/register/register-trip/register-trip';
import { EditVessel } from './features/edit/edit-vessel/edit-vessel';
import { Tickets } from './features/tickets/tickets';
import { Vessel } from './features/vessel/vessel';
import { RegisterTripSegment } from './features/register/register-trip-segment/register-trip-segment';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'home',component:Home},
    {path:'login',component:Login},

    {path:'edit-enterprise/:id',component:EditEnterprise},
    {path:'edit-vessel/:id',component:EditVessel},
    
    {path:'register-user', component:RegisterUser},
    {path:'register-enterprise',canActivate:[authGuard], component:RegisterEnterprise},
    {path:'register-vessel/:id',canActivate:[authGuard],component:RegisterVessel},
    {path:'register-trip/:id',canActivate:[authGuard],component:RegisterTrip},
    {path:'register-trip-segment/:id',canActivate:[authGuard],component:RegisterTripSegment},

    {path:'dashboard',canActivate:[authGuard],component:Dashboard},
    {path:'enterprise/:id',canActivate:[authGuard],component:Enterprise},
    {path:'vessel/:id',canActivate:[authGuard],component:Vessel},
    
    {path: 'checkout/:id',canActivate:[authGuard], component:Checkout},
    {path: 'tickets',canActivate:[authGuard], component:Tickets}
];
