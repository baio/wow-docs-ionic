import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Tab2Page } from './tab2.page';

export const tab2Routes: Routes = [
  {
    path: '',
    component: Tab2Page,
  },
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [Tab2Page],
})
export class Tab2PageModule {}
