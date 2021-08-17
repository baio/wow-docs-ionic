import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { YaAuthService } from '@app/social-auth';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ProfileEffects } from './ngrx/effects';
import { profileReducer } from './ngrx/reducer';
import { AppProfileConfigComponent } from './profile-config/profile-config.component';
import { AppProfileSocialProvidersComponent } from './profile-social-providers/profile-social-providers.component';
import { AppProfileWorkspaceComponent } from './profile-workspace/profile-workspace.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    StoreModule.forFeature('profile', profileReducer),
    EffectsModule.forFeature([ProfileEffects]),
  ],
  declarations: [
    AppProfileSocialProvidersComponent,
    AppProfileWorkspaceComponent,
    AppProfileConfigComponent,
  ],
  providers: [YaAuthService],
  exports: [AppProfileWorkspaceComponent],
})
export class AppProfileModule {}
