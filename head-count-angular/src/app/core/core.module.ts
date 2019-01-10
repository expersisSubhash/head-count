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
import {SoftwareService} from './_services/software.service';

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
  ],
  providers: [
    AuthService,
    SoftwareService,
  ],
})
export class CoreModule { }
