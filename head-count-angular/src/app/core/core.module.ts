import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from './_services/auth.service';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {LoginComponent} from './_components/login/login.component';
import {LandingComponent} from './_components/landing/landing.component';
import { DashboardComponent } from './_components/dashboard/dashboard.component';
import {NavbarComponent} from './_components/navbar/navbar.component';
import {SidebarComponent} from './_components/sidebar/sidebar.component';
import {BsDropdownModule, ModalModule} from 'ngx-bootstrap';
import {UserSnacksDetailComponent} from './_components/user-snacks-detail/user-snacks-detail.component';
import {SnacksListComponent} from './_components/snacks-list/snacks-list.component';
import {NewSnackComponent} from './_components/new-snack/new-snack.component';
import {UserListComponent} from './_components/user-list/user-list.component';
import {NewUserComponent} from './_components/new-user/new-user.component';
import {SidebarService} from './_services/sidebar.service';
import { SnackDayComponent } from './_components/snack-day/snack-day.component';
import {ConfirmAlertBoxComponent} from './_components/confirm-alert-box/confirm-alert-box.component';
import { ChangePasswordComponent } from './_components/change-password/change-password.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    SharedModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
  ],
  declarations: [
    LoginComponent,
    LandingComponent,
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    UserSnacksDetailComponent,
    SnacksListComponent,
    NewSnackComponent,
    UserListComponent,
    NewUserComponent,
    SnackDayComponent,
    ConfirmAlertBoxComponent,
    ChangePasswordComponent
  ],
  providers: [
    AuthService,
    SidebarService
  ],
  entryComponents: [
    NewUserComponent,
    NewSnackComponent,
    ConfirmAlertBoxComponent,
    ChangePasswordComponent
  ],

})
export class CoreModule { }
