import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, delay, map, switchMap, takeUntil } from 'rxjs/operators';
import { DocsApiService } from '../services';
import {
  queryFormattedDoc,
  queryFormattedDocCancel,
  queryFormattedDocError,
  queryFormattedDocSuccess,
  scanDoc,
  updateDocFormatted,
} from './actions';

const QUERY_FORMATTED_DOC_DELAY = 3 * 1000;
const QUERY_FORMATTED_DOC_TIMER = 15 * 1000;

@Injectable()
export class ScanDocEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly docsApi: DocsApiService
  ) {}

  scanDoc$ = createEffect(() =>
    this.actions$.pipe(
      ofType(scanDoc),
      switchMap(({ id, base64 }) => {
        const startTime = new Date().getTime();
        const dataBase64 = base64.split(',')[1];
        return this.docsApi.upload(id, dataBase64).pipe(
          map(() => queryFormattedDoc({ id, startTime })),
          delay(QUERY_FORMATTED_DOC_DELAY),
          catchError((err) => of(queryFormattedDocError({ id, startTime }))),
          takeUntil(this.actions$.pipe(ofType(queryFormattedDocCancel)))
        );
      })
    )
  );

  queryFormattedDoc$ = createEffect(() =>
    this.actions$.pipe(
      ofType(queryFormattedDoc),
      switchMap(({ id, startTime }) =>
        this.docsApi.getParsedDoc(id).pipe(
          map((docFormatted) =>
            docFormatted
              ? queryFormattedDocSuccess({ id, startTime, docFormatted })
              : queryFormattedDocError({ id, startTime })
          ),
          catchError((err: HttpErrorResponse) => {
            console.error('error', err);
            return err.status === 404 &&
              new Date().getTime() - startTime <= QUERY_FORMATTED_DOC_TIMER
              ? of(queryFormattedDoc({ id, startTime })).pipe(
                  delay(QUERY_FORMATTED_DOC_DELAY)
                )
              : of(queryFormattedDocError({ id, startTime }));
          }),
          takeUntil(this.actions$.pipe(ofType(queryFormattedDocCancel)))
        )
      )
    )
  );

  queryFormattedDocSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(queryFormattedDocSuccess),
      map(({ id, docFormatted }) => updateDocFormatted({ id, docFormatted }))
    )
  );
}
