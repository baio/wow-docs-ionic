/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { ActionSheetButton } from '@ionic/core';

export enum ConfirmType {
  RemoveDocument,
  RemoveDocumentEverywhere,
  RemoveTag,
  UnLinkTag,
}

export interface ConfirmShowOptions {
  header: string;

  buttons: (ActionSheetButton | string)[];
}

const getOptions = (type: ConfirmType): ConfirmShowOptions => {
  switch (type) {
    case ConfirmType.RemoveDocument:
    case ConfirmType.RemoveDocumentEverywhere: {
      const buttons = [
        {
          text: 'Удалить с телефона',
          icon: 'alert-outline',
          role: 'remove-device',
        },
        {
          text: 'Отмена',
          icon: 'close-outline',
          role: 'cancel',
        },
      ];
      if (type === ConfirmType.RemoveDocumentEverywhere) {
        buttons.splice(1, 0, {
          text: 'Удалить везде',
          icon: 'cloud-offline-outline',
          role: 'remove-everywhere',
        });
      }

      return {
        header: 'Удалить документ',
        buttons,
      };
    }
    case ConfirmType.RemoveTag:
      return {
        header: 'Удалить таг',
        buttons: [
          {
            text: 'Удалить безвозвратно',
            icon: 'alert-outline',
            role: 'confirm',
          },
          {
            text: 'Отмена',
            icon: 'close-outline',
            role: 'cancel',
          },
        ],
      };
    case ConfirmType.UnLinkTag:
      return {
        header: 'Отвязать таг от документа',
        buttons: [
          {
            text: 'Отвязать таг',
            icon: 'alert-outline',
            role: 'confirm',
          },
          {
            text: 'Отмена',
            icon: 'close-outline',
            role: 'cancel',
          },
        ],
      };
    default:
      return null;
  }
};

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  constructor(private readonly actionSheetController: ActionSheetController) {}

  async showWithOptions(opts: ConfirmShowOptions) {
    const actionSheet = await this.actionSheetController.create({
      header: opts.header,
      buttons: opts.buttons,
    });

    await actionSheet.present();

    return await actionSheet.onWillDismiss();
  }

  async show(type: ConfirmType) {
    const opts = getOptions(type);
    if (!opts) {
      console.error(`ConfirmType ${type} not found`);
      return;
    }
    return this.showWithOptions(opts);
  }
}
