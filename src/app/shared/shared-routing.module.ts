import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/controllers/login/login.component';
import { PasswordresetComponent } from './auth/controllers/passwordreset/passwordreset.component';
import { ChangepasswordComponent } from './auth/controllers/changepassword/changepassword.component';
import { LoginFailedComponent } from './auth/controllers/login-failed/login-failed.component';

const sharedRoutes: Routes = [
    { path: 'login', component: LoginComponent },

    {
        path: 'login',
        children: [
            { path: 'forgotpassword', component: PasswordresetComponent },
            { path: 'changepassword', component: ChangepasswordComponent },
            { path: 'login-failed', component: LoginFailedComponent }
        ]
    },



];

@NgModule({
    imports: [RouterModule.forRoot(sharedRoutes)],
    exports: [RouterModule],


})
export class SharedRoutingModule { }