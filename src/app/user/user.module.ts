import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { UserRoutingModule } from './user-routing.module';
import { UsermenuComponent } from './components/usermenu/usermenu.component';
import { AuthService } from '../shared/services/auth.service';
import { UserGuard } from '../shared/guards/userguard';
import { UserfooterComponent } from './components/userfooter/userfooter.component';
import { SavemetersComponent } from './components/savemeters/savemeters.component';
import { CondodatasComponent } from './components/condodatas/condodatas.component';
import { MyprofileComponent } from './components/myprofile/myprofile.component';
import { CostsComponent } from './components/costs/costs.component';
import { HeaderComponent } from './components/header/header.component';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    HomeComponent,
    UsermenuComponent,
    UserfooterComponent,
    SavemetersComponent,
    CondodatasComponent,
    MyprofileComponent,
    CostsComponent,
    HeaderComponent,

  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule
  ],
  providers: [
    AuthService,
    UserGuard

  ],
})
export class UserModule { }
