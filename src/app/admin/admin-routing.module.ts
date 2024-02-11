import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminhomeComponent } from './components/adminhome/adminhome.component';
import { AdminGuard } from '../shared/guards/adminguard';
import { AuthguardService } from '../shared/services/authguard.service';
import { BboardComponent } from './components/bboard/bboard.component';
import { UsersComponent } from './components/listusers/users.component';
import { MetersComponent } from './components/meters/meters.component';
import { SettingsComponent } from './components/settings/settings.component';
import { UpdateuserComponent } from './components/updateuser/updateuser.component';
import { AdduserComponent } from './components/adduser/adduser.component';
import { NotfoundComponent } from '../shared/auth/controllers/notfound/notfound.component';

const adminRoutes: Routes = [
    {
        path: 'admin',
        canActivate: [AdminGuard],  // Guard itt alkalmazva
        children: [
            { path: 'home', component: AdminhomeComponent },
            { path: 'bboard', component: BboardComponent },
            { path: 'users', component: UsersComponent },
            { path: 'meters', component: MetersComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'update/:id', component: UpdateuserComponent },
            { path: 'add', component: AdduserComponent },
            { path: '**', component: NotfoundComponent },

        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(adminRoutes)],
    exports: [RouterModule],
    providers: [AdminGuard, AuthguardService]
})
export class AdminRoutingModule { }