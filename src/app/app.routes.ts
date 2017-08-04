import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  CanActivateGuard,
  LayoutAuthComponent,
  LayoutLoginComponent,
  LayoutRegisterComponent
} from './ngx-admin-lte/index';

import { HomeComponent } from './pages/home/home.component';
import { ControlComponent } from './pages/control/control.component';
import { SensorComponent } from './pages/sensor/sensor.component';

const routes: Routes = [
  {
    children: [
      {
        component: HomeComponent,
        path: ''
      }
    ],
    component: LayoutAuthComponent,
    path: '',
  },
  {
    children: [
      {
        component: ControlComponent,
        path: 'control'
      }
    ],
    component: LayoutAuthComponent,
    path: '',
  },
  {
    children: [
      {
        component: SensorComponent,
        path: 'sensor'
      }
    ],
    component: LayoutAuthComponent,
    path: '',
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
