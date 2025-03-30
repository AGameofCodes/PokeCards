import {messagesEn} from '@/locale/en';

export const messagesDe = {
  auth: {
    login: 'Einloggen',
    loginInProgress: 'Logge ein ...',
    register: 'Registrieren',
    logout: 'Ausloggen',
    password: 'Passwort',
    username: 'Username',
  },
  card: {
    model: {
      id: 'Id',
      name: 'Name',
      number: 'Nummer',
      language: 'Sprache',
      rarity: 'Seltenheit',
      set: 'Set',
      variants: {
        holo: 'Holo',
        normal: 'Normal',
        reverse: 'Reverse Holo',
        variant: 'Variante',
      },
    },
    search: {
      noCardsFound: 'Keine Karten gefunden',
    },
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
  label: {
    create: {
      button: 'Erstellen',
      modalTitle: 'Label erstellen',
    },
    edit: {
      button: 'Speichern',
      modalTitle: 'Label bearbeiten',
    },
    delete: {
      reallyDelete: 'Dieses Label wirklich löschen?',
    },
    list: {
      actions: 'Aktionen',
    },
    model: {
      color: 'Farbe',
      enumValues: 'Werte',
      name: 'Name',
      type: 'Typ',
      typeOptions: {
        enum: 'Aufzählung',
        boolean: 'Ja/Nein',
      },
    },
  },
  locale: 'Sprache',
  locales: messagesEn.locales,
  menu: {
    about: 'Über',
    labels: 'Labels',
    cards: 'Karten',
    main: 'Dashboard',
    profile: 'Profil',
    search: 'Suche',
    settings: 'Einstellungen',
    userCards: 'Meine Karten',
  },
  settings: {
    settings: 'Einstellungen',
    currentlyNoSettings: 'Aktuell gibt es keine Einstellungen.',
  },
  userCard: {
    edit: {
      modal: {
        title: {
          add: 'Karte hinzufügen',
          update: 'Karte bearbeiten',
        },
        save: {
          add: 'Hinzufügen',
          update: 'Speichern',
        },
      },
    },
    model: {
      labels: 'Labels',
    },
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
  validation: {
    patternMismatch: 'Eingabe entspricht nicht dem Muster! "{pattern}".',
    rangeOverflow: 'Eingabe ist zu groß! Maximaler Wert: {max}.',
    rangeUnderflow: 'Eingabe ist zu klein! Minimaler Wert: {min}.',
    tooLong: 'Eingabe ist zu lang! Maximale Länge: {maxLength}.',
    tooShort: 'Eingabe ist zu kurz! Minimale Länge: {minLength}.',
    typeMismatch: {
      email: 'Bitte gebe eine gültige Emailadresse ein!',
      unknown: 'Ungültige Eingabe für Type {type}!',
    },
    unknown: 'Unbekannter Validierungsfehler!',
    valueMissing: 'Dieses Feld ist notwendig!',
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