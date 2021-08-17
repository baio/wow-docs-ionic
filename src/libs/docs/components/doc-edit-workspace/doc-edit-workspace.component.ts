import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { selectProfileConfig } from '@app/profile';
import {
  LoadingService,
  LoadingType,
  Notification,
  NotificationsService,
} from '@app/shared';
import { ModalController } from '@ionic/angular';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { startsWith } from 'lodash';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { Doc, DocFormatted, DocLabel, OptItem } from '../../models';
import {
  queryFormattedDocCancel,
  queryFormattedDocError,
  queryFormattedDocSuccess,
  scanDoc,
  showFullScreenImage,
  updateDocFormatted,
} from '../../ngrx/actions';
import { selectDoc } from '../../ngrx/selectors';

export interface UploadImageModalView {
  doc: Doc;
  activeDocLabel: DocLabel;
  activeDocFormatted: DocFormatted;
  showScanButton: boolean;
}

@Component({
  selector: 'app-doc-edit-workspace',
  templateUrl: 'doc-edit-workspace.component.html',
  styleUrls: ['doc-edit-workspace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDocEditWorkspaceComponent implements OnInit {
  private readonly showScanButton$ = new BehaviorSubject(false);
  view$: Observable<UploadImageModalView>;
  activeDocLabel$ = new BehaviorSubject<DocLabel>(null);

  @Input() title: string;
  @Input() documentId: string;
  @Input() isNew = false;

  readonly formTypes: OptItem[] = [
    {
      key: 'unknown',
      label: 'Другое',
    },
    {
      key: 'passport-rf',
      label: 'Паспорт РФ',
    },
    {
      key: 'passport-foreign-rf',
      label: 'Загран РФ',
    },
    {
      key: 'snils-rf',
      label: 'СНИЛС РФ',
    },
    {
      key: 'driver-license-rf',
      label: 'Водительское РФ',
    },
    {
      key: 'pts-rf',
      label: 'ПТС РФ',
    },
    {
      key: 'kasko-rf',
      label: 'КАСКО РФ',
    },
    {
      key: 'osago-rf',
      label: 'ОСАГО РФ',
    },
    {
      key: 'birth-certificate-rf',
      label: 'Свидетельство о Рождении РФ',
    },
    {
      key: 'inn-rf',
      label: 'ИНН РФ',
    },
    {
      key: 'med-insurance-international-rf',
      label: 'МЕЖДУНАРОДНАЯ МЕД СТРАХОВКА РФ',
    },
    {
      key: 'med-insurance-rf',
      label: 'МЕД СТРАХОВКА РФ',
    },
  ];

  constructor(
    private readonly store: Store,
    private readonly actions: Actions,
    private readonly modalController: ModalController,
    private readonly loadingService: LoadingService,
    private readonly notificationsService: NotificationsService
  ) {}

  async ngOnInit() {
    this.showScanButton$.next(this.isNew);
    const id$ = of(this.documentId);
    const doc$ = id$.pipe(switchMap((id) => this.store.select(selectDoc(id))));
    this.view$ = combineLatest([
      doc$,
      this.activeDocLabel$,
      this.showScanButton$,
    ]).pipe(
      map(([doc, activeDocLabel, showScanButton]) => ({
        doc,
        activeDocLabel: !activeDocLabel
          ? doc.labeled?.label || 'unknown'
          : activeDocLabel,
        activeDocFormatted: doc.formatted,
        showScanButton,
      }))
    );
    if (this.isNew) {
      const config = await this.store
        .select(selectProfileConfig)
        .pipe(take(1))
        .toPromise();
      if (config.extractImageDataAutomatically) {
        const doc = await doc$.pipe(take(1)).toPromise();
        this.onScanDoc(doc);
      }
    }
  }

  trackByOptItem(_, optItem: OptItem) {
    return optItem.key;
  }

  onSave(doc: Doc, docLabel: DocLabel, docFormatted: DocFormatted) {
    this.store.dispatch(
      updateDocFormatted({
        id: doc.id,
        docFormatted: { ...docFormatted, kind: docLabel } as any,
      })
    );

    this.modalController.dismiss();
  }

  onDocTypeChanged(docType: any) {
    this.activeDocLabel$.next(docType.detail.value);
  }

  onViewImage(doc: Doc) {
    this.store.dispatch(showFullScreenImage({ doc }));
  }

  async onScanDoc(doc: Doc) {
    const loading = await this.loadingService.show(LoadingType.DocScan);

    this.store.dispatch(scanDoc({ id: doc.id, base64: doc.imgBase64 }));

    const success = this.actions
      .pipe(ofType(queryFormattedDocSuccess), take(1))
      .toPromise()
      .then(() => 'success');

    const error = this.actions
      .pipe(ofType(queryFormattedDocError), take(1))
      .toPromise()
      .then(() => 'error');

    const cancel = loading.onWillDismiss().then(() => 'cancel');

    const result = await Promise.race([success, error, cancel]);

    if (result === 'cancel') {
      this.store.dispatch(queryFormattedDocCancel());
    } else {
      loading.dismiss();
      if (result === 'error') {
        this.notificationsService.notify(Notification.ScanDocError);
      } else if (result === 'success') {
        this.notificationsService.notify(Notification.ScanDocSuccess);
        this.showScanButton$.next(false);
      }
    }
  }
}
