import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found.component';
import {LoginComponent} from './core/_components/login/login.component';
import {LandingComponent} from './core/_components/landing/landing.component';
import {AuthGuard} from './guards/auth.guard';
import {UserSnacksDetailComponent} from './core/_components/user-snacks-detail/user-snacks-detail.component';
import {SnacksListComponent} from './core/_components/snacks-list/snacks-list.component';
import {UserListComponent} from './core/_components/user-list/user-list.component';
import {SnackDayComponent} from './core/_components/snack-day/snack-day.component';


const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '', component: LandingComponent, children: [
      {path: '', redirectTo: '/snack-detail', pathMatch: 'full'},
      {path: 'snack-detail', component: UserSnacksDetailComponent, canActivate: [AuthGuard]},
      {path: 'snacks', component: SnacksListComponent, canActivate: [AuthGuard]},
      {path: 'users', component: UserListComponent, canActivate: [AuthGuard]},
      {path: 'snack-day', component: SnackDayComponent, canActivate: [AuthGuard]},
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
