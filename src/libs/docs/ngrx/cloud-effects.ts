import { Injectable } from '@angular/core';
import {
  profileSocialLogin,
  selectProfileState,
  selectSocialAuthState,
} from '@app/profile';
import {
  appDownloadDocsFromCloud,
  Notification,
  NotificationsService,
} from '@app/shared';
import { AlertController } from '@ionic/angular';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { fromPairs } from 'lodash';
import { EMPTY, forkJoin, of, throwError } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { YaDiskService } from 'src/libs/ya-disk';
import { Doc, DocAttachment } from '../models';
import { DocsRepositoryService } from '../repository/docs.repository';
import {
  addCloudDocConfirmed,
  addDocAttachment,
  addDocTag,
  addDocument,
  cloudDocImported,
  deleteDocConfirmed,
  removeCloudDoc,
  removeCloudDocConfirmed,
  removeCloudDocError,
  removeCloudDocSuccess,
  removeDocAttachment,
  removeDocTag,
  setDocComment,
  setDocCommentDebounced,
  updateCloudDocImageConfirmed,
  updateDocFormatted,
  updateDocImage,
  uploadCloudDoc,
  uploadCloudDocConfirmed,
  uploadCloudDocError,
  uploadCloudDocSuccess,
} from './actions';
import { selectDoc, selectDocs, selectDocWithAttachments } from './selectors';
import { formatCloudText, parseCloudText } from './utils/cloud-text';

@Injectable()
export class CloudEffects {
  private readonly token$ = this.store
    .select(selectSocialAuthState)
    .pipe(map((state) => state && state.token));

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly yaDisk: YaDiskService,
    private readonly docsRepository: DocsRepositoryService,
    private readonly alertController: AlertController,
    private readonly notificationsService: NotificationsService
  ) {}

  addDoc$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addDocument),
      withLatestFrom(this.store.select(selectProfileState)),
      filter(
        ([_, profileState]) =>
          !!profileState.socialAuthState &&
          !!profileState.config.uploadToCloudAutomatically
      ),
      switchMap(([{ id, date }, profileState]) =>
        this.store.select(selectDoc(id)).pipe(
          take(1),
          map((doc) =>
            addCloudDocConfirmed({
              doc,
              socialAuthState: profileState.socialAuthState,
              date,
            })
          )
        )
      )
    )
  );

  uploadCloudDocImageConfirmed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCloudDocConfirmed, updateCloudDocImageConfirmed),
      switchMap(({ doc, socialAuthState }) =>
        this.yaDisk
          .uploadImage(socialAuthState.token, doc.imgBase64, `${doc.id}.jpeg`)
          .pipe(
            map((url) =>
              uploadCloudDocSuccess({
                doc,
                url,
                provider: socialAuthState.provider,
              })
            ),
            catchError((error) => of(uploadCloudDocError({ error, doc })))
          )
      )
    )
  );

  updateDocImageInCloud$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateDocImage),
      withLatestFrom(this.store.select(selectProfileState)),
      filter(
        ([{ doc }, profileState]) =>
          !!profileState.socialAuthState && !!doc.stored
      ),
      map(([{ doc }, profileState]) =>
        updateCloudDocImageConfirmed({
          doc: { ...doc, imgBase64: doc.imgBase64 },
          socialAuthState: profileState.socialAuthState,
        })
      )
    )
  );

  updateDocImage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateDocImage),
        filter(({ doc }) => !!doc.stored),
        withLatestFrom(this.store.select(selectSocialAuthState)),
        filter(([_, socialAuthState]) => !!socialAuthState),
        switchMap(([{ doc, base64 }, socialAuthState]) =>
          this.yaDisk.uploadImage(
            socialAuthState.token,
            base64,
            `${doc.id}.jpeg`
          )
        )
      ),
    { dispatch: false }
  );

  uploadDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadCloudDoc),
      withLatestFrom(this.store.select(selectProfileState)),
      switchMap(async ([{ doc, date }, profile]) => {
        if (profile.socialAuthState) {
          if (profile.config.uploadToCloudAutomatically) {
            // provider connected and we can upload doc automatically
            return uploadCloudDocConfirmed({ doc, date });
          } else {
            // asking permission to upload doc
            const alert = await this.alertController.create({
              header: 'Загрузить документ в облако?',
              message: `Ваш документ будет загружен на ваш ${profile.socialAuthState.provider} диск`,
              buttons: [
                { text: 'Отмена', role: 'cancel' },
                { text: 'Загрузить', role: 'ok' },
              ],
            });

            await alert.present();

            const { role } = await alert.onDidDismiss();

            return role === 'ok'
              ? uploadCloudDocConfirmed({ doc, date })
              : null;
          }
        } else {
          // ask connect provider first !
          const alert = await this.alertController.create({
            header: 'Войти в облако',
            message: `Для сохрвнения вашего документа в облаке необходим вход на ваш облачный диск`,
            inputs: [
              {
                name: 'yandex',
                type: 'radio',
                label: 'Yandex',
                value: 'yandex',
                checked: true,
              },
            ],
            buttons: [
              { text: 'Отмена', role: 'cancel' },
              { text: 'Войти', role: 'ok' },
            ],
          });
          await alert.present();

          const { role } = await alert.onDidDismiss();

          if (role === 'ok') {
            return profileSocialLogin({
              provider: 'yandex',
              continuation: uploadCloudDocConfirmed({ doc, date }),
            });
          }
        }
      }),
      filter((f) => !!f)
    )
  );

  uploadDocumentConfirmed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadCloudDocConfirmed),
      withLatestFrom(this.store.select(selectSocialAuthState)),
      filter(([_, socialAuthState]) => !!socialAuthState),
      switchMap(([{ doc }, socialAuthState]) =>
        this.store.select(selectDocWithAttachments(doc.id)).pipe(
          take(1),
          map(({ attachments }) => ({ attachments, doc, socialAuthState }))
        )
      ),
      switchMap(({ doc, attachments, socialAuthState }) => {
        const cloudText = formatCloudText(doc);
        if (!cloudText) {
          return EMPTY;
        }
        return forkJoin([
          this.yaDisk.uploadDocument({
            token: socialAuthState.token,
            imageBase64: doc.imgBase64,
            imgFileName: `${doc.id}.jpeg`,
            text: cloudText,
            textFileName: `${doc.id}.json`,
          }),
          ...attachments.map((m) =>
            this.yaDisk.uploadImage(
              socialAuthState.token,
              m.imgBase64,
              `attachment-${m.id}.jpeg`
            )
          ),
        ]).pipe(
          map(([{ imageFileUrl }]: any) =>
            uploadCloudDocSuccess({
              doc,
              url: imageFileUrl,
              provider: socialAuthState.provider,
            })
          ),
          catchError((error) => of(uploadCloudDocError({ error, doc })))
        );
      })
    )
  );

  uploadDocumentUpdateRepository$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          uploadCloudDocConfirmed,
          uploadCloudDocSuccess,
          uploadCloudDocError
        ),
        switchMap(({ doc }) =>
          this.store.select(selectDoc(doc.id)).pipe(take(1))
        ),
        switchMap((doc) =>
          this.docsRepository.updateDocStored(doc.id, doc.stored)
        )
      ),
    { dispatch: false }
  );

  removeDoc$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteDocConfirmed),
      filter((f) => f.deleteFromCloud),
      map(({ doc }) => removeCloudDocConfirmed({ doc }))
    )
  );

  removeCloudDoc$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeCloudDoc),
      withLatestFrom(this.store.select(selectSocialAuthState)),
      filter(([_, socialAuthState]) => !!socialAuthState),
      switchMap(async ([{ doc }, socialAuthState]) => {
        const alert = await this.alertController.create({
          header: 'Удалить документ из облака?',
          message: `Документ будет удален с вашего ${socialAuthState.provider} диска`,
          buttons: [
            { text: 'Отмена', role: 'cancel' },
            { text: 'Удалить', role: 'ok' },
          ],
        });

        await alert.present();

        const { role } = await alert.onDidDismiss();

        return role === 'ok' ? removeCloudDocConfirmed({ doc }) : null;
      }),
      filter((f) => !!f)
    )
  );

  removeCloudDocConfirmed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeCloudDocConfirmed),
      withLatestFrom(this.token$),
      filter(([_, token]) => !!token),
      switchMap(([{ doc }, token]) =>
        forkJoin(
          [
            `${doc.id}.jpeg`,
            `${doc.id}.json`,
            ...(doc.attachments || []).map((m) => `attachment-${m}.jpeg`),
          ].map((m) => this.yaDisk.removeFile(token, m))
        ).pipe(
          map(() => removeCloudDocSuccess({ id: doc.id })),
          catchError((error) => of(removeCloudDocError({ error, id: doc.id })))
        )
      )
    )
  );

  removeDocumentUpdateRepository$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeCloudDocConfirmed),
        switchMap(({ doc }) =>
          this.docsRepository.updateDocStored(doc.id, null)
        )
      ),
    { dispatch: false }
  );

  // TODO
  /*
  commentsChangeDebounce$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setDocComment),
      bufferTime(5000),
      filter((arr) => arr.length > 0),
      mergeMap((res) =>
        res.reduceRight(
          (acc, val) =>
            acc.some((s) => s.id === val.id)
              ? acc
              : [
                  setDocCommentDebounced({ id: val.id, comment: val.comment }),
                  ...acc,
                ],
          []
        )
      )
    )
  );
  */
  commentsChangeDebounce$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setDocComment),
      debounceTime(5000),
      map(({ id, comment }) => setDocCommentDebounced({ id, comment }))
    )
  );

  updateDocFormatted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        updateDocFormatted,
        addDocTag,
        removeDocTag,
        setDocCommentDebounced
      ),
      withLatestFrom(this.store.select(selectSocialAuthState)),
      filter(([_, socialAuthState]) => !!socialAuthState),
      switchMap(([{ id }, socialAuthState]) =>
        this.store.select(selectDoc(id)).pipe(
          take(1),
          map((doc) => ({ doc, socialAuthState }))
        )
      ),
      filter(({ doc }) => !!doc.stored),
      switchMap(({ doc, socialAuthState }) => {
        const cloudText = formatCloudText(doc);
        return this.yaDisk
          .uploadText(socialAuthState.token, cloudText, `${doc.id}.json`)
          .pipe(
            switchMap(() => EMPTY),
            catchError((error) => of(uploadCloudDocError({ error, doc })))
          );
      })
    )
  );

  //
  addDocAttachment$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addDocAttachment),
        withLatestFrom(this.token$),
        filter(([{ doc }, token]) => !!token && !!doc.stored),
        switchMap(([{ doc, base64, id }, token]) =>
          this.store.select(selectDoc(doc.id)).pipe(
            take(1),
            map((selectedDoc) => ({
              doc: selectedDoc,
              token,
              base64,
              attachmentId: id,
            }))
          )
        ),
        switchMap(({ doc, base64, token, attachmentId }) => {
          const cloudText = formatCloudText(doc);
          if (!cloudText) {
            return EMPTY;
          }
          return this.yaDisk.uploadDocument({
            token,
            imageBase64: base64,
            imgFileName: `attachment-${attachmentId}.jpeg`,
            text: cloudText,
            textFileName: `${doc.id}.json`,
          });
        })
      ),
    { dispatch: false }
  );

  removeDocAttachments$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeDocAttachment),
        withLatestFrom(this.token$),
        filter(([{ doc }, token]) => !!token && !!doc.stored),
        switchMap(([{ doc, attachmentIndex }, token]) => {
          const cloudText = formatCloudText(doc);
          const attachmentId = doc.attachments[attachmentIndex];
          if (!cloudText) {
            return EMPTY;
          }
          return forkJoin([
            this.yaDisk.uploadText(token, cloudText, `${doc.id}.json`),
            this.yaDisk.removeFile(token, `attachment-${attachmentId}.jpeg`),
          ]);
        })
      ),
    { dispatch: false }
  );

  downloadDocsFromCloud$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appDownloadDocsFromCloud),
      withLatestFrom(this.store.select(selectSocialAuthState)),
      filter(([_, socialAuthState]) => !!socialAuthState),
      switchMap(([_, { token, provider }]) => {
        this.notificationsService.notify(
          Notification.CloudDocumentsImportStarted
        );
        return this.yaDisk
          .readAllFiles(token)
          .pipe(
            map((diskFilesResult) => ({ diskFilesResult, provider, token }))
          );
      }),
      withLatestFrom(this.store.select(selectDocs)),
      // eslint-disable-next-line arrow-body-style
      switchMap(([{ diskFilesResult, provider, token }, docs]) => {
        const diskFiles = diskFilesResult
          .map((f) => ({
            // id not uniq here !!!
            id: f.name.replace(/^attachment-|\.json$|\.jpeg$/g, ''),
            name: f.name,
            file: f.url,
            type: /^attachment-/.test(f.name)
              ? 'attachment'
              : /\.json$/.test(f.name)
              ? 'data'
              : 'image',
            viewUrl: f.viewUrl,
          }))
          .filter((f) => f.name !== 'tags.json');

        const docIds = Object.keys(docs);
        const newDiskFiles = diskFiles.filter(
          (f) => f.type === 'data' && !docIds.includes(f.id)
        );
        console.log('111', newDiskFiles);
        const diskFilesHash = fromPairs(diskFiles.map((m) => [m.name, m]));
        console.log('222', diskFilesHash);

        // TODO
        this.notificationsService.notify(
          Notification.CloudDocumentsImportSuccess
        );

        return newDiskFiles.map((f) => {
          const imgFile = diskFilesHash[f.id + '.jpeg'];

          if (!imgFile) {
            // data here but image not, ignore
            return of(null);
          }
          console.log('333', f.file, imgFile.file);

          return forkJoin([
            this.yaDisk.readFileRawUrl(f.file),
            this.yaDisk.readFileRawUrlAsImageBase64(imgFile.file),
          ]).pipe(
            map(([dataFile, imageFile]) =>
              parseCloudText(
                f.id,
                provider,
                dataFile.data,
                imageFile.data,
                imgFile.viewUrl
              )
            ),
            filter((doc: Doc) => !!doc),
            switchMap((doc) => {
              const attachments = (doc.attachments || []).map(
                (m) => diskFilesHash[`attachment-${m}.jpeg`]
              );
              return attachments.length === 0
                ? of({
                    doc,
                    docAttachments: [],
                  })
                : forkJoin(
                    attachments.map((m) =>
                      m
                        ? this.yaDisk
                            .readFileRawUrlAsImageBase64(m.file)
                            .pipe(map((r) => ({ ...r, id: m.id })))
                            .pipe(catchError(() => of(null)))
                        : of(null)
                    )
                  ).pipe(
                    map((attachmentsResult: { id: string; data: string }[]) => {
                      const existentAttachments = attachmentsResult.filter(
                        (r) => !!r
                      );
                      const docAttachments = existentAttachments.map(
                        (m) =>
                          ({ id: m.id, imgBase64: m.data } as DocAttachment)
                      );
                      return {
                        doc: {
                          ...doc,
                          attachments: existentAttachments.map((m) => m.id),
                        },
                        docAttachments,
                      };
                    })
                  );
            })
          );
        });
      }),
      catchError((err) => {
        this.notificationsService.notify(
          Notification.CloudDocumentsImportError
        );
        return throwError(err);
      }),
      mergeMap((m) => m),
      //tap(console.log),
      map((m) => cloudDocImported(m))
    )
  );
}
