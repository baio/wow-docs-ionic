import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { take, first, rest, drop } from 'lodash/fp';
import { DocFormField, DocView } from '../../models';

@Component({
  selector: 'app-doc-display-content',
  templateUrl: 'doc-display-content.component.html',
  styleUrls: ['doc-display-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDocDisplayContentComponent {
  isSecondaryExpanded = false;
  @Input() docView: DocView;

  get primaryFields() {
    return this.docView && this.docView.fields
      ? take(3, this.docView.fields)
      : [];
  }

  get secondaryFields() {
    return this.docView && this.docView.fields
      ? drop(3, this.docView.fields)
      : [];
  }

  trackByField(_, doc: DocFormField) {
    return doc.name;
  }

  onToggleSecondaryExpanded() {
    this.isSecondaryExpanded = !this.isSecondaryExpanded;
  }
}
