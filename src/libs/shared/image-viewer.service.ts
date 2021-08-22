import { Injectable } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Injectable({ providedIn: 'root' })
export class ImageViewerService {
  private readonly photoViewer = new PhotoViewer();
  constructor() {}
  show(url: string) {
    this.photoViewer.show(url);
  }
}
