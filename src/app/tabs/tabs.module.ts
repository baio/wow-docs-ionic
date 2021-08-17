import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Tab1PageModule, tab1Routes } from '../tab1/tab1.module';
import { Tab2PageModule, tab2Routes } from '../tab2/tab2.module';
import { Tab3PageModule, tab3Routes } from '../tab3/tab3.module';
import { TabsPage } from './tabs.page';

export const tabsRoutes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: tab1Routes,
      },
      {
        path: 'tab2',
        children: tab2Routes,
      },
      {
        path: 'tab3',
        children: tab3Routes,
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageModule,
    Tab2PageModule,
    Tab3PageModule,
  ],
  declarations: [TabsPage],
})
export class TabsPageModule {}
