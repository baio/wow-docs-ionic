import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-doc-list-image',
  templateUrl: 'doc-list-image.component.html',
  styleUrls: ['doc-list-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDocListImageComponent {
  @Input() imgBase64: string;
  @Input() title: string;
  constructor() {}
}
