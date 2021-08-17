import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ProfileConfig, SocialAuthProvider } from '../models';

export type SocialAuthProviderWithOffline = SocialAuthProvider | 'offline';

@Component({
  selector: 'app-profile-config',
  templateUrl: 'profile-config.component.html',
  styleUrls: ['profile-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppProfileConfigComponent {
  @Input() config: ProfileConfig;
  @Input() cloudActive = false;

  @Output() configChange = new EventEmitter<ProfileConfig>();

  constructor() {}

  onCloudUploadChange($event: any) {
    const checked = $event.detail.checked;
    this.configChange.emit({
      ...this.config,
      uploadToCloudAutomatically: checked,
    });
  }

  onExtractImageDataAutomaticallyChange($event: any) {
    const checked = $event.detail.checked;
    this.configChange.emit({
      ...this.config,
      extractImageDataAutomatically: checked,
    });
  }
}
