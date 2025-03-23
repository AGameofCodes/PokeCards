import type {ExportedGlobalComposer, VueI18n} from 'vue-i18n';
import {errorToast} from '@/util/toast';
import {ApiException} from 'pokecards-oas';

export function handleError($i18n: VueI18n | ExportedGlobalComposer, err: any) {
  const i18n = $i18n as VueI18n; // in this project we are in legacy mode, so we get a VueI18n instance
  let msg: string;
  if (!err) {
    msg = i18n.t('error.unknownReason');
  } else if (err instanceof ApiException) {
    switch (err.code) {
      case 400:
        msg = i18n.t('error.badRequest');
        if (err.body && err.headers['content-type'].includes('application/json')) {
          const j = typeof err.body === 'string' ? JSON.parse(err.body) : err.body;
          if (j.error) {
            if (j.error.type && j.error.message) {//ValidationError
              msg += ': ' + j.error.type + ': ' + j.error.message;
            }
          }
        }
        break;
      case 401:
        msg = i18n.t('error.unauthorized');
        break;
      case 404:
        msg = i18n.t('error.notFound');
        break;
      case 409:
        msg = i18n.t('error.conflict');
        break;
      case 500:
        msg = i18n.t('error.internalServerError');
        break;
      default:
        msg = err.message;
        break;
    }
  } else {
    msg = typeof err === 'string' ? err : JSON.stringify(err);
    if (err.body) {
      try {
        err = JSON.parse(err.body);
      } catch (_) {
      }
    }

    if (err.error) {
      err = err.error;
    }

    if (err.message) {
      msg = err.message;
    } else if (err.reason) {
      msg = err.reason;
    }
  }
  errorToast(i18n.t('error.error') + ': ' + msg);
}

const emptyUUIDString = '00000000-0000-0000-0000-000000000000';

export function emptyUUID(): string {
  return emptyUUIDString;
}

export function blobDownload(data: BufferSource | string, fileName: string, fileType: string = 'octet/stream'): void {
  const a = document.createElement('a');
  a.style.display = 'none';
  document.body.appendChild(a);
  const blob = new Blob([data], {type: fileType});
  a.href = window.URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  a.remove();
}