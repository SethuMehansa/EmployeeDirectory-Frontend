import { Routes } from '@angular/router';
import { ManageEmployeeComponent } from './components/manage-employee/manage-employee.component';

export const routes: Routes = [
    {
        path: '',
        component: ManageEmployeeComponent,
        pathMatch: 'full'
      }
];
