import type {ExportedGlobalComposer, VueI18n} from 'vue-i18n';
import {toast} from 'vue3-toastify';

export function deletedToast($i18n: VueI18n | ExportedGlobalComposer, closeAfterMs: number | false = 3000) {
  const i18n = $i18n as VueI18n;
  toast.info(i18n.t('general.deleted'), {autoClose: closeAfterMs});
}

export function savedToast($i18n: VueI18n | ExportedGlobalComposer, closeAfterMs: number | false = 3000) {
  const i18n = $i18n as VueI18n;
  toast.info(i18n.t('general.saved'), {autoClose: closeAfterMs});
}

export function errorToast(message: string, closeAfterMs: number | false = 3000) {
  toast.error(message, {autoClose: closeAfterMs});
}