import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../shared/auth/controllers/notfound/notfound.component';
import { HomeComponent } from './components/home/home.component';
import { UserGuard } from '../shared/guards/userguard';
import { AuthguardService } from '../shared/services/authguard.service';
import { SavemetersComponent } from './components/savemeters/savemeters.component';
import { CondodatasComponent } from './components/condodatas/condodatas.component';
import { MyprofileComponent } from './components/myprofile/myprofile.component';
import { CostsComponent } from './components/costs/costs.component';




const userRoutes: Routes = [

    {
        path: 'lako',
        canActivate: [UserGuard],
        children: [
            { path: 'fooldal', component: HomeComponent },
            { path: 'adatok', component: CondodatasComponent },
            { path: 'koltsegek', component: CostsComponent },
            { path: "diktalas", component: SavemetersComponent },
            { path: "profilom", component: MyprofileComponent },
            { path: '**', component: NotfoundComponent },

        ]
    },
    { path: '', component: HomeComponent, canActivate: [UserGuard] },




];


@NgModule({
    imports: [RouterModule.forChild(userRoutes)],
    exports: [RouterModule],
    providers: [UserGuard, AuthguardService]
})
export class UserRoutingModule { }
