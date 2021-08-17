import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes } from '@angular/router';
import { AppProfileModule } from '@app/profile';
import { IonicModule } from '@ionic/angular';
import { Tab3Page } from './tab3.page';

export const tab3Routes: Routes = [
  {
    path: '',
    component: Tab3Page,
  },
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, AppProfileModule],
  declarations: [Tab3Page],
})
export class Tab3PageModule {}
