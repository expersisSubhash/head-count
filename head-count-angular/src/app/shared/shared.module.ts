import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertComponent} from './_components/alert/alert.component';
import {AlertService} from './_components/alert/alert.service';
import {LoaderService} from './_components/loader/loader.service';
import {LoaderComponent} from './_components/loader/loader.component';
import {BreadcrumbComponent} from './_components/breadcrumb/breadcrumb.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [
    AlertComponent,
    LoaderComponent,
    BreadcrumbComponent,
  ],
  exports: [
    AlertComponent,
    LoaderComponent,
    BreadcrumbComponent,
  ],
  providers: [
    AlertService,
    LoaderService
  ]
})
export class SharedModule { }
