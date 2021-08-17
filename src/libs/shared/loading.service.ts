/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AlertButton } from '@ionic/core';

export enum LoadingType {
  DocScan,
}

export interface LoadingShowOptions {
  header: string;
  message: string;
  buttons: (AlertButton | string)[];
}

const getOptions = (type: LoadingType): LoadingShowOptions => {
  switch (type) {
    case LoadingType.DocScan:
      return {
        header: 'Сканирование документа.',
        message:
          // eslint-disable-next-line max-len
          'После успешного сканирования данные формы будут заполнены автоматически. Вы можете изменить конфигурацию автоматического сканирования документов в настройках.',
        buttons: [
          {
            text: 'Отмена',
            role: 'cancel',
            cssClass: 'danger',
          },
        ],
      };
    default:
      return null;
  }
};

@Injectable({ providedIn: 'root' })
export class LoadingService {
  constructor(
    private readonly alertController: AlertController,
    private readonly loadingController: LoadingController
  ) {}

  async showWithOptions(opts: LoadingShowOptions) {
    /*
    const alert = await this.alertController.create({
      header: opts.header,
      message: opts.message,
      buttons: opts.buttons,
    });

    await alert.present();

    return alert;
    */
    const loading = await this.loadingController.create({
      message: opts.header + '\n' + opts.message,
      backdropDismiss: true,
      duration: 0,
      spinner: 'lines',
    });

    await loading.present();

    return loading;
  }

  async show(type: LoadingType) {
    const opts = getOptions(type);
    if (!opts) {
      console.error(`LoadingType ${type} not found`);
      return;
    }
    return this.showWithOptions(opts);
  }
}
