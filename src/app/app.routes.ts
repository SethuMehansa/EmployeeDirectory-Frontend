import { Routes } from '@angular/router';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserSignupComponent } from './components/user-signup/user-signup.component';
import { ManageEmployeeComponent } from './components/manage-employee/manage-employee.component';

export const routes: Routes = [
    {
        path: '',
        component: UserLoginComponent,
        pathMatch: 'full'
      },
      {
        path: 'user-signup',
        component: UserSignupComponent
      },
      {
        path: 'manage-employee',
        component: ManageEmployeeComponent
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
];
