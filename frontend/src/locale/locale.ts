import type {I18n} from 'vue-i18n';
import {createI18n as vueCreateI18n} from 'vue-i18n';
import {messagesEn, datetimeFormatsEn} from '@/locale/en';
import {messagesDe, datetimeFormatsDe} from '@/locale/de';

const messages = {
  en: messagesEn,
  de: messagesDe,
}

const datetimeFormats = {
  en: datetimeFormatsEn,
  de: datetimeFormatsDe,
}

export function createI18n(): I18n {
  return vueCreateI18n({
    locale: 'de',
    fallbackLocale: 'en',
    messages: messages,
    datetimeFormats: datetimeFormats as any,
    legacy: true,
  });
}

export function setDocumentLocale(locale: string): void {
  document.documentElement.setAttribute("lang", locale);
}
