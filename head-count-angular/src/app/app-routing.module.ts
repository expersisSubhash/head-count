import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found.component';
import {LoginComponent} from './core/_components/login/login.component';
import {LandingComponent} from './core/_components/landing/landing.component';
import {AuthGuard} from './guards/auth.guard';
import {DashboardComponent} from './core/_components/dashboard/dashboard.component';


const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', component: LandingComponent, children: [
      {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    ]
  },
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
