import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProductsComponent } from './components/products/products.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminComponent } from './components/admin/admin.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'home', component:HomeComponent ,title:"Home Page", },
    {path:'products', component:ProductsComponent, title:'Products Page'},
    {path:'cart', component:CartComponent, title:'Shopping Cart', canActivate: [authGuard]},
    {path:'admin', component:AdminComponent, title:'Admin Dashboard', canActivate: [adminGuard]},
    {path:'signup', component:SignupComponent, title:"Signup Page"},
    {path:'register', redirectTo:'signup', pathMatch:'full'},
    {path:'login', component:LoginComponent, title:'Login Page'},
    {path:'**', component:NotFoundComponent}
];


