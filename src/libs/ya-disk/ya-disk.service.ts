import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { base64Str2Blob } from './base64str-to-blob';
import { text2Blob } from './text-to-blob';

export const WOW_DOCS_FOLDER_NAME = 'WOW-DOCS';

@Injectable({ providedIn: 'root' })
export class YaDiskService {
  constructor(private readonly http: HttpClient) {}

  getUrl(path: string) {
    return `https://cloud-api.yandex.net/v1/disk/${path}`;
  }

  getHeaders(token: string) {
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `OAuth ${token}`,
    };
  }

  private createAppFolder(token: string) {
    const url = this.getUrl(`resources?path=${WOW_DOCS_FOLDER_NAME}`);
    const headers = this.getHeaders(token);
    return this.http.put(url, null, { headers });
  }

  uploadImage(token: string, imageBase64: string, fileName: string) {
    const blob = base64Str2Blob(imageBase64);
    const url = this.getUrl(
      `resources/upload?path=${WOW_DOCS_FOLDER_NAME}/${fileName}&overwrite=true`
    );
    const headers = this.getHeaders(token);
    return this.http.get(url, { headers }).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 409) {
          // folder not exists
          return this.createAppFolder(token).pipe(
            // try to upload again
            switchMap(() => this.http.get(url, { headers }))
          );
        } else {
          return throwError(err);
        }
      }),
      switchMap((res: any) => {
        const uploadUrl = res.href;
        return this.http.put(uploadUrl, blob).pipe(
          map(
            () =>
              // eslint-disable-next-line max-len
              `https://disk.yandex.com/client/disk/${WOW_DOCS_FOLDER_NAME}?idApp=client&dialog=slider&idDialog=%2Fdisk%2F${WOW_DOCS_FOLDER_NAME}%2F${fileName}`
          )
        );
      })
    );
  }

  removeFile(token: string, fileName: string) {
    const url = this.getUrl(
      `resources?path=${WOW_DOCS_FOLDER_NAME}/${fileName}`
    );
    const headers = this.getHeaders(token);
    return this.http.delete(url, { headers });
  }

  uploadText(token: string, text: string, fileName: string) {
    const blob = text2Blob(text);
    const url = this.getUrl(
      `resources/upload?path=${WOW_DOCS_FOLDER_NAME}/${fileName}&overwrite=true`
    );
    const headers = this.getHeaders(token);
    return this.http.get(url, { headers }).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 409) {
          // folder not exists
          return this.createAppFolder(token).pipe(
            // try to upload again
            switchMap(() => this.http.get(url, { headers }))
          );
        } else {
          return throwError(err);
        }
      }),
      switchMap((res: any) => {
        const uploadUrl = res.href;
        return this.http.put(uploadUrl, blob).pipe(
          map(
            () =>
              // eslint-disable-next-line max-len
              `https://disk.yandex.com/client/disk/${WOW_DOCS_FOLDER_NAME}?idApp=client&dialog=slider&idDialog=%2Fdisk%2F${WOW_DOCS_FOLDER_NAME}%2F${fileName}`
          )
        );
      })
    );
  }

  uploadDocument(data: {
    token: string;
    imageBase64: string;
    imgFileName: string;
    text: string;
    textFileName: string;
  }) {
    return forkJoin([
      this.uploadImage(data.token, data.imageBase64, data.imgFileName),
      this.uploadText(data.token, data.text, data.textFileName),
    ]).pipe(
      map(([imageFileUrl, textFileUrl]) => ({ imageFileUrl, textFileUrl }))
    );
  }

  removeFiles(data: {
    token: string;
    imgFileName: string;
    textFileName: string;
  }) {
    return forkJoin([
      this.removeFile(data.token, data.imgFileName),
      this.removeFile(data.token, data.textFileName),
    ]);
  }

  readAllFiles(
    token: string
  ): Observable<{ url: string; name: string; viewUrl: string }[]> {
    const url = this.getUrl(
      `resources?path=${WOW_DOCS_FOLDER_NAME}&limit=1000`
    );
    const headers = this.getHeaders(token);
    return this.http.get<any>(url, { headers }).pipe(
      map((result) =>
        result._embedded.items.map((m) => ({
          url: m.file,
          name: m.name,
          // eslint-disable-next-line max-len
          viewUrl: `https://disk.yandex.com/client/disk/${WOW_DOCS_FOLDER_NAME}?idApp=client&dialog=slider&idDialog=%2Fdisk%2F${WOW_DOCS_FOLDER_NAME}%2F${m.name}`,
        }))
      )
    );
  }

  readFileRawUrlAsImageBase64(
    url: string
  ): Observable<{ data: string; type: string }> {
    return this.readFileRawUrl(url).pipe(
      map((m) => ({ data: `data:${m.type};base64,${m.data}`, type: m.type }))
    );
  }

  readFile(
    token: string,
    fileName: string
  ): Observable<{ data: string; type: string }> {
    // TODO
    return this.http
      .get<{ href: string }>(
        this.getUrl(
          `resources/download?path=${WOW_DOCS_FOLDER_NAME}/${fileName} `
        ),
        { headers: this.getHeaders(token) }
      )
      .pipe(switchMap(({ href }) => this.readFileRawUrl(href)));
  }

  readFileRawUrl(url: string): Observable<{ data: string; type: string }> {
    // TODO
    const encodedUrl = encodeURIComponent(url);
    return this.http.get<any>(
      `https://functions.yandexcloud.net/d4e8j27s7u3veqcvh8p2?url=${encodedUrl}`
    );
    /*
    //const headers = this.getHeaders(token);
    return this.http
      .get<{ href: string }>(
        this.getUrl(
          'resources/download?path=VOW-DOCS/4572b055-b941-4b85-8e9a-a6ec92a743fb.jpeg'
        ),
        { headers: this.getHeaders(token) }
      )
      .pipe(
        switchMap(async ({ href }) => {
          /*
          const options = {
            url: href,
            name: '4572b055-b941-4b85-8e9a-a6ec92a743fb',
            filePath: '4572b055-b941-4b85-8e9a-a6ec92a743fb.jpeg',
            fileDirectory: Directory.Data,
            method: 'GET',
          };

          const response = await Http.downloadFile(options);
          console.log(response);
          return null;

          const headers = new Headers({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Accept: 'application/octet-stream',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Host: 'webdav.yandex.ru',
          });
          /*
          fetch({
            url: href,
            method: 'GET',
            headers
          });

          const res = await fetch(href, { mode: 'no-cors' });

          console.log('???', res);

          return null;
          /*
          const headers = new HttpHeaders()
            .append('Accept', 'application/octet-stream');
            //.append('Host', 'webdav.yandex.ru');

          const req = new HttpRequest('GET', href, {
            responseType: 'blob',
            reportProgress: true,
            headers,
          });

          return this.http.request(req).pipe(map((m) => ({ href: '' })));
          
        })
        */
  }
}
