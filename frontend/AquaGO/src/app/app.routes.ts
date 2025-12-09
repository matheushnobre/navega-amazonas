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

export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'home',component:Home},
    {path:'login',component:Login},
    {path:'edit-enterprise/:id',component:EditEnterprise},
    {path:'edit-vessel/:id',component:EditVessel},
    
    {path:'register-enterprise',component:RegisterEnterprise},
    {path:'register-vessel/:id',component:RegisterVessel},
    {path:'register-trip/:id',component:RegisterTrip},
    {path:'register-trip-segment/:id',component:RegisterTripSegment},

    {path:'dashboard',component:Dashboard},
    {path:'enterprise/:id',component:Enterprise},
    {path:'vessel/:id',component:Vessel},
    
    {path: 'checkout/:id', component:Checkout},
    {path: 'tickets', component:Tickets}
];
