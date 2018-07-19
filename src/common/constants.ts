const reduce = require('lodash/reduce');

export enum LoadingStatus {
  DONE = 'DONE',
  FAILED = 'FAILED'
}

export enum VENDORS {
  Z =  'z',
}

export enum STEPS {
  VENDOR_SELECT,
  LOGIN,
  FETCH,
  DOWNLOAD
}

interface Logos {
  [key: string]: {path: object}
}
export const LOGOS: Logos = (() => {
  const logos = {
    IDLE: {
      '16': 'logo_16.png',
      '24': 'logo_24.png',
      '32': 'logo_32.png'
    },
    SUCCESS: {
      '16': 'logo_success_16.png',
      '24': 'logo_success_24.png',
      '32': 'logo_success_32.png'
    },
    ERROR: {
      '16': 'logo_error_16.png',
      '24': 'logo_error_24.png',
      '32': 'logo_error_32.png'
    },
    FETCH: {
      '16': 'logo_fetch_16.png',
      '24': 'logo_fetch_24.png',
      '32': 'logo_fetch_32.png'
    }
  };

  return reduce(logos, (acc, value, key) => {
    acc[key] = {path: value};
    return acc;
  }, {});
})();

export interface SESSION {
  step: STEPS;
  credentials: any; // TODO-DR improve it
}

export interface ZAuthenticationData {
  url: string;
  email: string;
  token: string;
}

export enum DATA_TYPES {
  ARTICLES = 'articles',
  CATEGORIES = 'categories',
  SECTIONS = 'sections',
  // USERS = 'users', // enable if we need users
  TICKETS = 'tickets',
}

export const DATA_TYPES_TO_LOAD = [
  DATA_TYPES.CATEGORIES,
  DATA_TYPES.SECTIONS,
  DATA_TYPES.ARTICLES,
  DATA_TYPES.TICKETS
];

// user 0 to use maximum available items per page for Z provider
export const PAGE_PER_CALL = 0;
export const VERSION = '1.0.0';
export const DOWNLOAD_FILE_NAME = 'backup';
