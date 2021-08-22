import { Injectable } from '@angular/core';
import { selectSocialAuthState } from '@app/profile';
import {
  appStarted,
  ConfirmService,
  ConfirmType,
  ImageViewerService,
  Notification,
  NotificationsService,
} from '@app/shared';
import { Clipboard } from '@capacitor/clipboard';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import {
  ActionSheetController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { AppDocEditWorkspaceComponent } from '../components/doc-edit-workspace/doc-edit-workspace.component';
import { AppDocWorkspaceComponent } from '../components/doc-workspace/doc-workspace.component';
import { DocsRepositoryService } from '../repository/docs.repository';
import { docToText } from '../utils';
import {
  addDocAttachment,
  addDocSuccess,
  addDocTag,
  addDocument,
  cloudDocImported,
  copyClipboard,
  deleteDoc,
  deleteDocConfirmed,
  displayDoc,
  editDoc,
  rehydrateDocs,
  rehydrateDocsSuccess,
  removeDocAttachment,
  removeDocTag,
  setDocComment,
  shareDoc,
  showFullScreenImage,
  updateDocFormatted,
  updateDocImage,
  updateDocState,
} from './actions';
import { selectAttachments, selectDoc } from './selectors';

@Injectable()
export class DocsEffects {
  handleDocSaveError = ($: Observable<any>) =>
    $.pipe(
      catchError(() => {
        this.notificationsService.notify(Notification.SaveDocError);
        return EMPTY;
      })
    );

  constructor(
    private readonly actions$: Actions,
    private readonly modalController: ModalController,
    private readonly docRepository: DocsRepositoryService,
    private readonly toastController: ToastController,
    private readonly store: Store,
    private readonly actionSheetController: ActionSheetController,
    private readonly notificationsService: NotificationsService,
    private readonly confirmService: ConfirmService,
    private readonly imageViewerService: ImageViewerService
  ) {}

  appStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appStarted),
      map(() => rehydrateDocs())
    )
  );

  rehydrateDocs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rehydrateDocs),
      switchMap(async () => {
        const docs = await this.docRepository.getDocs();
        const attachments = await this.docRepository.getAttachments();
        return { docs, attachments };
      }),
      map((result) => rehydrateDocsSuccess(result))
    )
  );

  /*
  addDoc$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addDocument),
      switchMap(({ id, base64 }) =>
        this.docsDataAccess.uploadImage(id, base64).pipe(mapTo(id))
      ),
      map((id) => addDocSuccess({ id })),
      catchError((_) => of(addDocError()))
    )
  );
  */
  addDoc$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addDocument),
      map((doc) => addDocSuccess({ id: doc.id }))
    )
  );

  addDocToDb$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addDocument),
        switchMap(({ id, base64 }) => this.docRepository.addDoc(id, base64)),
        this.handleDocSaveError
      ),
    { dispatch: false }
  );

  updateDocImageInDb$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateDocImage),
        switchMap(({ doc, base64 }) =>
          this.docRepository.updateDocImage(doc.id, base64)
        ),
        this.handleDocSaveError
      ),
    { dispatch: false }
  );

  /*
    pollDocState$ = createEffect(() =>
        this.actions$.pipe(
            ofType(uploadImageSuccess),
            switchMap(({ id }) => {
                // poll every 3 seconds 5 times or till state completed
                const stop$ = new Subject();
                return timer(100, 100).pipe(
                    takeUntil(stop$),
                    take(5),
                    switchMap(() => this.docsDataAccess.getDocumentState(id)),
                    switchMap((result) => {
                        if (
                            result.formatted &&
                            result.labeled &&
                            result.parsed &&
                            result.stored
                        ) {
                            stop$.next();
                        }
                        return of({ id, docState: result });
                    })
                );
            }),
            map((payload) => updateDocState(payload))
        )
    );
    */

  uploadImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addDocument),
      switchMap(async ({ id }) => {
        const modal = await this.modalController.create({
          component: AppDocEditWorkspaceComponent,
          componentProps: {
            documentId: id,
            title: 'Новый документ',
            isNew: true,
          },
        });
        await modal.present();
        await modal.onWillDismiss();
        return displayDoc({ id });
      })
    )
  );

  displayDocShowModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(displayDoc),
        tap(async ({ id }) => {
          const modal = await this.modalController.create({
            component: AppDocWorkspaceComponent,
            componentProps: {
              documentId: id,
            },
          });
          await modal.present();
          const { data } = await modal.onWillDismiss();
        })
      ),
    { dispatch: false }
  );

  editDocShowModal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(editDoc),
        tap(async ({ id }) => {
          const modal = await this.modalController.create({
            component: AppDocEditWorkspaceComponent,
            componentProps: {
              documentId: id,
              title: 'Данные документа',
            },
          });
          await modal.present();
          const { data } = await modal.onWillDismiss();
        })
      ),
    { dispatch: false }
  );

  updateDocState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateDocState),
        tap(({ id, docState }) =>
          this.docRepository.updateDocState(id, docState)
        ),
        this.handleDocSaveError
      ),
    { dispatch: false }
  );

  setDocComment$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setDocComment),
        tap(({ id, comment }) => this.docRepository.setDocComment(id, comment)),
        this.handleDocSaveError
      ),
    { dispatch: false }
  );

  deleteDoc$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteDoc),
      withLatestFrom(this.store.select(selectSocialAuthState)),
      switchMap(async ([{ doc }, socialAuthState]) => {
        const { role } = await this.confirmService.show(
          socialAuthState && doc.stored
            ? ConfirmType.RemoveDocumentEverywhere
            : ConfirmType.RemoveDocument
        );

        if (role === 'remove-device' || role === 'remove-everywhere') {
          return deleteDocConfirmed({
            doc,
            deleteFromCloud: role === 'remove-everywhere',
          });
        } else {
          return null;
        }
      }),
      filter((f) => !!f)
    )
  );

  deleteDocConfirmed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteDocConfirmed),
        tap(async ({ doc }) => {
          await this.modalController.dismiss();
          await this.docRepository.deleteDoc(doc.id, doc.attachments);
        }),
        this.handleDocSaveError
      ),
    { dispatch: false }
  );

  updateDocFormatted$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateDocFormatted),
        tap(({ id, docFormatted }) =>
          this.docRepository.updateDocFormatted(id, docFormatted)
        ),
        this.handleDocSaveError
      ),
    { dispatch: false }
  );

  shareDoc$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(shareDoc),
        tap(async ({ doc, share }) => {
          const text = docToText(doc);
          const base64 = doc.imgBase64.split(',')[1];
          let filePath: string;
          let url: string;
          if (share !== 'doc-only') {
            filePath = `vow-doc-${new Date().getTime()}.jpg`;
            const res = await Filesystem.writeFile({
              path: filePath,
              data: base64,
              directory: Directory.Cache,
            });
            url = res.uri;
          }
          await Share.share({
            title: 'Документ',
            text: share !== 'image-only' ? text : null,
            url,
            dialogTitle: 'Отпраивть данные',
          });
          if (url) {
            await Filesystem.deleteFile({
              path: filePath,
              directory: Directory.Cache,
            });
          }
        })
      ),
    { dispatch: false }
  );

  copyClipboard$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(copyClipboard),
        tap(async ({ doc }) => {
          const text = docToText(doc);
          await Clipboard.write({
            // eslint-disable-next-line id-blacklist
            string: text,
            image: doc.imgBase64,
            label: 'Документ',
          });
          const toast = await this.toastController.create({
            header: 'Скопировано',
            position: 'top',
            duration: 1000,
          });
          await toast.present();
          await this.notificationsService.notify(
            Notification.DocCopiedToClipboard
          );
        })
      ),
    { dispatch: false }
  );

  fullScreenImage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(showFullScreenImage),
        withLatestFrom(this.store.select(selectAttachments)),
        tap(async ([{ doc, attachmentIndex }, attachments]) => {
          const imgBase64 =
            attachmentIndex === undefined
              ? doc.imgBase64
              : attachments[doc.attachments[attachmentIndex]].imgBase64;
          this.imageViewerService.show(imgBase64);
        })
      ),
    { dispatch: false }
  );

  setDocTags$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addDocTag, removeDocTag),
        switchMap(({ id }) => this.store.select(selectDoc(id)).pipe(take(1))),
        tap((doc) => {
          this.docRepository.setDocTags(doc.id, doc.tags);
        }),
        this.handleDocSaveError
      ),
    { dispatch: false }
  );

  addDocAttachment$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addDocAttachment),
        tap(({ doc, id, base64 }) => {
          this.docRepository.addDocAttachment(doc, id, base64);
        }),
        this.handleDocSaveError
      ),
    { dispatch: false }
  );

  removeDocAttachment$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeDocAttachment),
        tap(({ doc, attachmentIndex }) => {
          this.docRepository.removeDocAttachment(doc, attachmentIndex);
        })
      ),
    { dispatch: false }
  );

  cloudDocImported$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(cloudDocImported),
        tap(({ doc, docAttachments }) =>
          Promise.all([
            this.docRepository.createDoc(doc),
            ...(docAttachments || []).map((m) =>
              this.docRepository.addDocAttachmentToAttachments(
                m.id,
                m.imgBase64
              )
            ),
          ])
        ),
        this.handleDocSaveError
      ),
    { dispatch: false }
  );
}
