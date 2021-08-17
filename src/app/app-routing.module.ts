import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AppAuthenticateComponent,
  AppAuthGuard,
  AppAuthModule,
  AppIgnoreAuthGuard,
} from '@app/auth';
import { tabsRoutes } from './tabs/tabs.module';

const routes: Routes = [
  {
    path: 'login',
    component: AppAuthenticateComponent,
    canActivate: [AppIgnoreAuthGuard],
  },

  {
    path: '',
    children: tabsRoutes,
    canActivateChild: [AppAuthGuard],
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false }),
    AppAuthModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
