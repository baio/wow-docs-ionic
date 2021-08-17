import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocFormatted } from '../../models';
@Injectable()
export class DocsApiService {
  private readonly uploadBaseUrl = 'https://vow.perimeter.pw';
  private readonly queryBaseUrl = 'https://vow.perimeter.pw';
  // private readonly uploadBaseUrl = 'http://192.168.0.103:3010';
  // private readonly queryBaseUrl = 'http://192.168.0.103:3050';

  constructor(private readonly http: HttpClient) {}

  private getUploadUrl(path: string) {
    return this.uploadBaseUrl + path;
  }
  private getQueryUrl(path: string) {
    return this.queryBaseUrl + path;
  }

  upload(id: string, base64: string) {
    const url = this.getUploadUrl('/upload/base64');
    return this.http.post(url, { base64, docKey: id });
  }

  getParsedDoc(id: string) {
    const url = this.getQueryUrl(`/docs/${id}/parsed?format=true`);
    return this.http.get<DocFormatted>(url);
  }
}
