import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SocialAuthProvider } from '../models';

export type SocialAuthProviderWithOffline = SocialAuthProvider | 'offline';

@Component({
  selector: 'app-profile-social-providers',
  templateUrl: 'profile-social-providers.component.html',
  styleUrls: ['profile-social-providers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppProfileSocialProvidersComponent {
  @Input() selectedProvider: SocialAuthProviderWithOffline;

  @Output() selectedProviderChange =
    new EventEmitter<SocialAuthProviderWithOffline>();

  constructor() {}

  onChange($event: any) {
    console.log($event);
    this.selectedProviderChange.emit($event.detail.value);
  }

  onSelect($event: MouseEvent, value: SocialAuthProviderWithOffline) {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.selectedProvider !== value) {
      this.selectedProviderChange.emit(value);
    }
  }
}
