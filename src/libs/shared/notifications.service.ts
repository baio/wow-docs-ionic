/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export enum Notification {
  LoginSuccess,
  SetPinSuccess,
  CloudAuthSuccess,
  CloudAuthError,
  CloudDocumentsImportStarted,
  CloudDocumentsImportSuccess,
  CloudDocumentsImportError,
  CloudDocumentExportSuccess,
  CloudDocumentExportError,
  SaveDocError,
  DocCopiedToClipboard,
  TakePhotoError,
  ScanDocError,
  ScanDocSuccess,
}

type NotificationType = 'success' | 'error' | 'info';

const getText = (notification: Notification) => {
  switch (notification) {
    case Notification.LoginSuccess:
      return 'Успешный вход';
    case Notification.SetPinSuccess:
      return 'Пин установлен';
    case Notification.LoginSuccess:
      return 'Успешный вход';
    case Notification.CloudAuthSuccess:
      return 'Вход в облако выполнен';
    case Notification.CloudAuthError:
      return 'Вход в облако не выполнен';
    case Notification.CloudDocumentsImportStarted:
      return 'Синхронизация с облаком начата';
    case Notification.CloudDocumentsImportSuccess:
      return 'Синхронизация с облаком успешна';
    case Notification.CloudDocumentsImportError:
      return 'Ошибка синхронизации с облаком, повторите позднее';
    case Notification.CloudDocumentExportSuccess:
      return 'Документ обновлен в облаке';
    case Notification.CloudDocumentExportError:
      return 'Ошибка обновления документа в облаке';
    case Notification.SaveDocError:
      return 'Ошибка сохранения документа';
    case Notification.DocCopiedToClipboard:
      return 'Документ скоирован в буфер обмена';
    case Notification.TakePhotoError:
      return 'Ошибка згрузки изображения, попробуйте выбрать другое';
    case Notification.ScanDocError:
      return 'Ошибка извлечения данных, заполните форму в ручную';
    case Notification.ScanDocSuccess:
      return 'Данные извлечены успешно';
    default:
      return null;
  }
};

const getType = (notification: Notification): NotificationType => {
  switch (notification) {
    case Notification.LoginSuccess:
      return 'success';
    case Notification.SetPinSuccess:
      return 'success';
    case Notification.CloudAuthSuccess:
      return 'success';
    case Notification.CloudAuthError:
      return 'error';
    case Notification.CloudDocumentsImportStarted:
      return 'info';
    case Notification.CloudDocumentsImportSuccess:
      return 'success';
    case Notification.CloudDocumentsImportError:
      return 'error';
    case Notification.CloudDocumentExportSuccess:
      return 'success';
    case Notification.CloudDocumentExportError:
      return 'error';
    case Notification.SaveDocError:
      return 'error';
    case Notification.DocCopiedToClipboard:
      return 'info';
    case Notification.ScanDocSuccess:
      return 'success';
    default:
      return 'error';
  }
};

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  constructor(private readonly toastController: ToastController) {}

  notify(notification: Notification) {
    const text = getText(notification);
    const type = getType(notification);
    return this.show(text, type);
  }

  private async show(text: string, type: NotificationType) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000,
      position: 'top',
      color:
        type === 'success'
          ? 'success'
          : type === 'error'
          ? 'danger'
          : 'secondary',
    });
    return toast.present();
  }
}
