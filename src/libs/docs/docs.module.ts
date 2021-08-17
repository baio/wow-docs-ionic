import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTagsModule } from '@app/tags';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DbModule } from '../db/db.module';
import { YaDiskModule } from '../ya-disk';
import { AppDocDisplayContentComponent } from './components/doc-display-content/doc-display-content.component';
import { AppDocDisplayComponent } from './components/doc-display/doc-display.component';
import { AppDocEditFormComponent } from './components/doc-edit-form/doc-edit-form.component';
import { AppDocEditWorkspaceComponent } from './components/doc-edit-workspace/doc-edit-workspace.component';
import { AppDocImageComponent } from './components/doc-image/doc-image.component';
import { AppDocListImageComponent } from './components/doc-list-image/doc-list-image.component';
import { AppDocTagsComponent } from './components/doc-tags/doc-tags.component';
import { AppDocWorkspaceComponent } from './components/doc-workspace/doc-workspace.component';
import { AppDocumentsWorkspaceComponent } from './components/documents-workspace/documents-workspace.component';
import { AppFullScreenImageComponent } from './components/full-screen-image/full-screen-image.component';
import { CloudEffects } from './ngrx/cloud-effects';
import { DocsEffects } from './ngrx/docs-effects';
import { docsReducer } from './ngrx/reducer';
import { ScanDocEffects } from './ngrx/scan-doc-effects';
import { DocsRepositoryService } from './repository/docs.repository';
import { CameraService, DocsApiService } from './services';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    StoreModule.forFeature('docs', docsReducer),
    EffectsModule.forFeature([DocsEffects, CloudEffects, ScanDocEffects]),
    DbModule,
    FormsModule,
    ReactiveFormsModule,
    AppTagsModule,
    YaDiskModule,
  ],
  declarations: [
    AppDocumentsWorkspaceComponent,
    AppDocImageComponent,
    AppDocListImageComponent,
    AppDocEditWorkspaceComponent,
    AppDocDisplayComponent,
    AppDocWorkspaceComponent,
    AppDocEditFormComponent,
    AppFullScreenImageComponent,
    AppDocTagsComponent,
    AppDocDisplayContentComponent,
  ],
  providers: [DocsRepositoryService, CameraService, DocsApiService],
  exports: [AppDocumentsWorkspaceComponent, AppDocEditWorkspaceComponent],
})
export class AppDocsModule {}
