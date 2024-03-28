import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { SharedRoutingModule } from './shared/shared-routing.module';
import { UserRoutingModule } from './user/user-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';
import { AuthguardService } from './shared/services/authguard.service';

import { HttpClientModule } from '@angular/common/http';
import { AdminGuard } from './shared/guards/adminguard';
import { UserGuard } from './shared/guards/userguard';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    AdminRoutingModule,
    UserRoutingModule,
    SharedRoutingModule,
    HttpClientModule,
    AdminModule,
    UserModule
  ],
  providers: [AuthguardService, AdminGuard, UserGuard],
  bootstrap: [AppComponent],
})
export class AppModule { }
