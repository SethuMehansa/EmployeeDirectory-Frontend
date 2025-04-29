import { Routes } from '@angular/router';
import { ManageEmployeeComponent } from './components/manage-employee/manage-employee.component';
import { ChartsComponent } from './components/charts/charts.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo:"/manage-employee",
        pathMatch: 'full'
      },
      {
        path:"manage-employee",
        component:ManageEmployeeComponent
      },
      {
        path:"charts",
        component:ChartsComponent
      }
];
