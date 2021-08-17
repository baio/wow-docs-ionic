import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { selectSocialAuthState } from '@app/profile';
import { ActionSheetController, IonSelect, IonTextarea } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { v4 } from 'uuid';
import { getDocForm } from '../../definitions';
import { Doc, DocView } from '../../models';
import {
  addDocAttachment,
  addDocTag,
  copyClipboard,
  deleteDoc,
  editDoc,
  removeCloudDoc,
  removeDocAttachment,
  removeDocTag,
  setDocComment,
  shareDoc,
  showFullScreenImage,
  updateDocImage,
  uploadCloudDoc,
} from '../../ngrx/actions';
import { selectDocWithAttachments } from '../../ngrx/selectors';
import { CameraService } from '../../services/camera.service';
import { docFormToView } from '../../utils';
import { ImageClickEvent } from '../doc-image/doc-image.component';

/**
 * hidden - no provider and doc is online
 * online - provider and is doc is online
 * online - provider / no provider and doc is in error
 * offline - provider / no provider and doc is offline
 */
export type CloudUploadStatus =
  | 'hidden'
  | 'offline'
  | 'online'
  | 'online-error'
  | 'online-progress';

export interface UploadImageModalView {
  doc: Doc;
  docView: DocView;
  cloudUploadStatus: CloudUploadStatus;
  attachmentsBase64: string[];
}

@Component({
  selector: 'app-doc-workspace',
  templateUrl: 'doc-workspace.component.html',
  styleUrls: ['doc-workspace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDocWorkspaceComponent implements OnInit {
  view$: Observable<UploadImageModalView>;
  @Input() documentId: string;

  @ViewChild(IonSelect) docTypeSelect: IonSelect;
  @ViewChild(IonTextarea) commentTextArea: IonTextarea;

  constructor(
    private readonly store: Store,
    private readonly actionSheetController: ActionSheetController,
    private readonly cameraService: CameraService,
  ) {}

  ngOnInit() {
    const id$ = of(this.documentId);
    const socialAuthState$ = this.store.select(selectSocialAuthState);
    this.view$ = id$.pipe(
      switchMap((id) => this.store.select(selectDocWithAttachments(id))),
      withLatestFrom(socialAuthState$),
      map(([result, socialAuthState]) => {
        if (!result) {
          return null;
        } else {
          const { doc, attachments } = result;
          const docForm = doc.formatted && getDocForm(doc.formatted.kind);
          return doc
            ? ({
                doc,
                docView:
                  doc.formatted && docForm
                    ? docFormToView(doc.formatted, docForm)
                    : null,
                attachmentsBase64: attachments.map((m) => m.imgBase64),
                cloudUploadStatus: socialAuthState
                  ? doc.stored
                    ? doc.stored.status === 'error'
                      ? 'online-error'
                      : doc.stored.status === 'progress'
                      ? 'online-progress'
                      : 'online'
                    : 'offline'
                  : doc.stored
                  ? 'hidden'
                  : 'offline',
              } as UploadImageModalView)
            : null;
        }
      })
    );
  }

  async onDelete(doc: Doc) {
    this.store.dispatch(deleteDoc({ doc }));
  }

  onEdit(doc: Doc) {
    this.store.dispatch(editDoc({ id: doc.id }));
  }

  async onShare(doc: Doc) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Поделиться документом',
      buttons: [
        {
          text: 'Изображение и данные',
          icon: 'images-outline',
          handler: () => {
            this.store.dispatch(shareDoc({ doc, share: 'doc-and-image' }));
          },
        },
        {
          text: 'Только данные',
          icon: 'document-outline',
          handler: () => {
            this.store.dispatch(shareDoc({ doc, share: 'doc-only' }));
          },
        },
        {
          text: 'Только изображение',
          icon: 'image-outline',
          handler: () => {
            this.store.dispatch(shareDoc({ doc, share: 'image-only' }));
          },
        },
        {
          text: 'Отмена',
          icon: 'close-outline',
          handler: () => {},
        },
      ],
    });

    await actionSheet.present();
  }

  onViewImage(doc: Doc, $event: ImageClickEvent) {
    this.store.dispatch(
      showFullScreenImage({ doc, attachmentIndex: $event.attachmentIndex })
    );
  }

  onCopyClipboard(doc: Doc) {
    this.store.dispatch(copyClipboard({ doc }));
  }

  onAddTag(doc: Doc, tag: string) {
    this.store.dispatch(addDocTag({ id: doc.id, tag }));
  }

  onRemoveTag(doc: Doc, tag: string) {
    this.store.dispatch(removeDocTag({ id: doc.id, tag }));
  }

  onCommentChange(doc: Doc, event$: any) {
    const comment = event$.detail.value;
    this.store.dispatch(setDocComment({ id: doc.id, comment }));
  }

  onCloudUpload(doc: Doc) {
    this.store.dispatch(uploadCloudDoc({ doc, date: new Date().getTime() }));
  }

  onCloudRemove(doc: Doc) {
    this.store.dispatch(removeCloudDoc({ doc }));
  }

  async onImageCameraClick(doc: Doc) {
    const result = await this.cameraService.getPhoto();
    if (result) {
      this.store.dispatch(updateDocImage({ doc, base64: result.dataString }));
    }
  }

  async onImageLinkClick(doc: Doc) {
    const result = await this.cameraService.getPhoto();
    if (result) {
      const id = v4();
      this.store.dispatch(
        addDocAttachment({ doc, id, base64: result.dataString })
      );
    }
  }

  async onImageUnLinkClick(doc: Doc, index: number) {
    this.store.dispatch(removeDocAttachment({ doc, attachmentIndex: index }));
  }

}
