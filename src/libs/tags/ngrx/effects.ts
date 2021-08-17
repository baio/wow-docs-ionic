import { Injectable } from '@angular/core';
import { selectSocialAuthState } from '@app/profile';
import { appDownloadDocsFromCloud, appStarted } from '@app/shared';
import { YaDiskService } from '@app/ya-disk';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { TagsRepositoryService } from '../repository/tags.repository';
import {
  createTag,
  importTagsFromCloudSuccess,
  rehydrateTags,
  rehydrateTagsSuccess,
  removeTag,
} from './actions';
import { selectTags } from './selectors';

@Injectable()
export class TagsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly tagsRepository: TagsRepositoryService,
    private readonly yaDisk: YaDiskService,
    private readonly store: Store
  ) {}

  appStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appStarted),
      map(() => rehydrateTags())
    )
  );

  createTag$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createTag),
        switchMap(({ name, date }) =>
          this.tagsRepository.addTag({ name, date })
        )
      ),
    { dispatch: false }
  );

  removeTag$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeTag),
        switchMap(({ name }) => this.tagsRepository.removeTag(name))
      ),
    { dispatch: false }
  );

  rehydrateTags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rehydrateTags),
      switchMap(() => this.tagsRepository.getTags()),
      map((tags) => rehydrateTagsSuccess({ tags }))
    )
  );

  uploadTagToCloud$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createTag, removeTag),
        withLatestFrom(this.store.select(selectSocialAuthState)),
        map(([_, socialAuthState]) => socialAuthState),
        filter((f) => !!f),
        withLatestFrom(this.store.select(selectTags)),
        switchMap(([socialAuthState, tags]) => {
          const tagsJsonStr = JSON.stringify(Object.keys(tags));
          return this.yaDisk.uploadText(
            socialAuthState.token,
            tagsJsonStr,
            'tags.json'
          );
        })
      ),
    { dispatch: false }
  );

  importTagsFromCloud$ = createEffect(() =>
    this.actions$.pipe(
      // use the same event as for docs
      ofType(appDownloadDocsFromCloud),
      withLatestFrom(this.store.select(selectSocialAuthState)),
      map(([_, socialAuthState]) => socialAuthState),
      filter((f) => !!f),
      switchMap((socialAuthState) =>
        this.yaDisk.readFile(socialAuthState.token, 'tags.json').pipe(
          map((m) =>
            m.data
              ? JSON.parse(m.data).map((name: string) => ({
                  name,
                  date: new Date().getTime(),
                }))
              : []
          )
        )
      ),
      map((tags) => importTagsFromCloudSuccess({ tags }))
    )
  );

  importTagsFromCloudSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(importTagsFromCloudSuccess),
        withLatestFrom(this.store.select(selectTags)),
        tap(([, tags]) => {
          this.tagsRepository.setTags(Object.values(tags));
        })
      ),
    { dispatch: false }
  );
}
