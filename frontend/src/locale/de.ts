import {messagesEn} from '@/locale/en';

export const messagesDe = {
  auth: {
    login: 'Einloggen',
    loginInProgress: 'Logge ein ...',
    register: 'Registrieren',
    logout: 'Ausloggen',
  },
  design: 'Design',
  error: {
    badRequest: 'Ungültige Anforderung',
    conflict: 'Konflikt',
    error: 'Fehler',
    failedToLoad: 'Fehler beim Laden',
    internalServerError: 'Interner Serverfehler',
    notFound: 'Nicht gefunden',
    unauthorized: 'Nicht autorisiert',
    unknownReason: 'Unbekannter Grund',
  },
  general: {
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    confirmation: 'Bestätigung',
    copyToClipboard: {
      copyToClipboard: 'In die Zwischenablage kopieren',
      fail: 'In die Zwischenablage kopieren fehlgeschlagen',
      success: 'In die Zwischenablage kopiert',
    },
    delete: 'Löschen',
    deleted: 'Gelöscht',
    deleting: 'Lösche ...',
    name: 'Name',
    reload: 'Neu laden',
    save: 'Speichern',
    saved: 'Gespeichert',
    saving: 'Wird gespeichert ...',
    search: 'Suche',
  },
  locale: 'Sprache',
  locales: messagesEn.locales,
  menu: {
    about: 'Über',
    cards: 'Karten',
    main: 'Dashboard',
    profile: 'Profil',
    settings: 'Einstellungen',
  },
  settings: {
    settings: 'Einstellungen',
    currentlyNoSettings: 'Aktuell gibt es keine Einstellungen.',
  },
  userCard: {
    add: {
      modal: {
        title: 'Karte tracken',
        addUserCard: 'Tracken',
      },
    },
    model: {
      id: 'Id',
      name: 'Name',
      number: 'Nummer',
      language: 'Sprache',
    }
  },
  userinfo: {
    model: {
      displayName: 'Anzeigename',
      email: 'Email',
      name: 'Name',
    },
    password: 'Passwort',
    passwordRepeat: 'Passwort (wiederholen)',
    passwordsDoNotMatch: 'Passwörter stimmen nicht überein',
  },
};

export const datetimeFormatsDe = {
  date: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
  datetime: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  },
  datetimeSeconds: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    seconds: '2-digit',
  },
};