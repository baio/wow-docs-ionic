import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { chunk } from 'lodash';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 } from 'uuid';
import { Doc } from '../../models';
import { addDocument, displayDoc } from '../../ngrx/actions';
import { selectDocsAsSortedList } from '../../ngrx/selectors';
import { CameraService } from '../../services/camera.service';
import { searchDocs } from './search-docs';
import { DocCaption, getCaption } from './utils/get-caption';

export interface DocView extends Doc {
  caption?: DocCaption;
}

export interface DocsRow {
  first: DocView;
  second: DocView;
}

export interface DocumentsWorkspaceView {
  rows: DocsRow[];
}

const getDocView = (doc: Doc): DocView => {
  const caption = doc.formatted ? getCaption(doc.formatted) : null;
  return {
    ...doc,
    caption,
  };
};

@Component({
  selector: 'app-documents-workspace',
  templateUrl: 'documents-workspace.component.html',
  styleUrls: ['documents-workspace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDocumentsWorkspaceComponent {
  readonly search$ = new BehaviorSubject<string>(null);
  readonly view$: Observable<DocumentsWorkspaceView>;

  constructor(
    private readonly store: Store,
    private readonly cameraService: CameraService
  ) {
    const docs$ = store.select(selectDocsAsSortedList);
    const rows$ = combineLatest([docs$, this.search$]).pipe(
      map(([docs, search]) => searchDocs(docs, search)),
      map((list) =>
        chunk(list, 2).map(([first, second]) => ({
          first: getDocView(first),
          second: second && getDocView(second),
        }))
      )
    );
    this.view$ = rows$.pipe(map((rows) => ({ rows })));
  }

  onDocClick(doc: Doc) {
    this.store.dispatch(displayDoc({ id: doc.id }));
  }

  trackByRow(_, row: DocsRow) {
    return row.first.id;
  }

  async onFileSelected() {
    const result = await this.cameraService.getPhoto();
    if (result) {
      const id = v4();
      this.store.dispatch(
        addDocument({
          id,
          base64: result.dataString,
          date: new Date().getTime(),
        })
      );
    }
  }

  onSearchChange(evt: any) {
    const search = evt.detail.value;
    this.search$.next(search);
  }

  getTitle(doc: DocView) {
    return doc.caption
      ? (doc.caption.subTitle || '') + ' ' + (doc.caption.title || '')
      : null;
  }
}
