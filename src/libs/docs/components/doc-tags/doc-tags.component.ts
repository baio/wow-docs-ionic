import { ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { TagsSelectorService } from '@app/tags';
import { ConfirmService, ConfirmType } from '@app/shared';

@Component({
  selector: 'app-doc-tags',
  templateUrl: 'doc-tags.component.html',
  styleUrls: ['doc-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDocTagsComponent {
  @Input() tags: string[];
  @Output() addTag = new EventEmitter<string>();
  @Output() removeTag = new EventEmitter<string>();
  constructor(
    private readonly tagsSelectorService: TagsSelectorService,
    private readonly confirmService: ConfirmService
  ) {}

  trackByTag(_, tag: string) {
    return tag;
  }

  async onRemove(tag: string) {
    const { role } = await this.confirmService.show(ConfirmType.UnLinkTag);
    if (role === 'confirm') {
      this.removeTag.emit(tag);
    }
  }

  async onAddTag() {
    const tag = await this.tagsSelectorService.selectTag(this.tags || []);
    if (tag) {
      this.addTag.next(tag);
    }
  }
}
