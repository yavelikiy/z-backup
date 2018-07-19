import Adaptor from './Adaptor';
import axios, {CancelToken, CancelTokenStatic} from "axios";
import {DATA_TYPES, PAGE_PER_CALL, ZAuthenticationData} from '../../common/constants';

const forEach = require('lodash/forEach');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const values = require('lodash/values');
const noop = require('lodash/noop');

interface ZFetchData {
  cachedData?: any;
  dataTypes: DATA_TYPES[];
  limit?: number;
}
interface ZStatusData {
  article?: object;
  categories?: object;
  sections?: object;
}
interface ZResponse {
  page: number;
  count: number;
  per_page: number;
  next_page: string;
  articles?: object[];
  categories?: object[];
  sections?: object[];
}

enum RESPONSE_ERRORS {
  MERGE_CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  RATE_LIMIT_ERROR = 429,
  DATABASE_TIMEOUT = 503
}

const DEFAULT_TIMEOUT = 5;
const INITIAL_PAGE = 1;
const MAX_RETRIES = 3;
const delaySeconds = (timeout = DEFAULT_TIMEOUT) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout * 1000);
  });
};

function validateStatus(status) {
  let isValid = status < 400;

  switch (status) {
    case RESPONSE_ERRORS.MERGE_CONFLICT:
    case RESPONSE_ERRORS.UNPROCESSABLE_ENTITY:
    case RESPONSE_ERRORS.RATE_LIMIT_ERROR:
    case RESPONSE_ERRORS.DATABASE_TIMEOUT:
      isValid = false;
      break;
  }

  return isValid
}

export default class ZAdaptor implements Adaptor<ZAuthenticationData, ZFetchData, ZStatusData> {
  private listener: Function;
  private data: ZStatusData;
  private url: string;
  private email: string;
  private token: string;
  private source: any;

  constructor() {
    this.data = {};
    this.listener = noop;
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
  }

  authenticate(params: ZAuthenticationData) {
    const {url, email, token} = params;
    this.email = email;
    this.token = token;
    this.url = `https://${url.replace(/^https?:\/\//, '')}`;

    return this.getData({dataTypes: values(DATA_TYPES), limit: 1})
      .then((data) => {
        this.data = data;
        return data;
      });
  }

  onProgress(callback: (status: ZStatusData) => void) {
    this.listener = callback;
  }

  getData(params: ZFetchData = {dataTypes: [], cachedData: {}, limit: Infinity}) {
    const {dataTypes, cachedData, limit = Infinity} = params;
    const promises = [];
    this.data = isEmpty(cachedData) ? this.data : cachedData;

    forEach(dataTypes, (type: string) => {
      promises.push(this.fetchData(type, limit));
    });

    return Promise.all(promises)
      .then(() => {
        return this.data;
      });
  }

  stop() {
    this.source.cancel('Canceled by the user.');
  }

  private fetchData(type: string, limit: number) {
    const nextPage = this.getInitialPage(type);
    let errorCount = 0;

    return new Promise(async (resolve, reject) => {
      let isRejected = false;
      let count = 0;
      let apiUrl = this.getApiUrl(type, nextPage);

      while (apiUrl && count < limit) {
        try {
          apiUrl = await this.fetchPageAndUpdate(type, apiUrl);
          count++;
          errorCount = 0;
        } catch (error) {
          if (!axios.isCancel(error)) {
            errorCount++;
            const status = get(error, 'response.status');
            const timeout = get(error, 'response.headers["Retry-After"]');

            if (timeout || status === RESPONSE_ERRORS.RATE_LIMIT_ERROR || errorCount < MAX_RETRIES) {
              await delaySeconds(timeout);
            } else {
              errorCount = 0;
              isRejected = true;
              reject(error);
              break;
            }
          } else {
            break;
          }
        }
      }

      if (!isRejected) {
        resolve();
      }
    });
  }

  private getInitialPage(type: string): number {
    const total = get(this.data, `['${type}'].data.length`, 0);
    const perPage = get(this.data, `['${type}'].amountPerPage`, 1);

    return total ? Math.ceil(total / perPage) + 1 : INITIAL_PAGE;
  }

  private fetchPageAndUpdate(type: string, apiUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.get(apiUrl)
        .then((page: ZResponse) => {
          this.processNewData(page, type);
          this.listener(this.data);
          resolve(page.next_page);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  private get(apiUrl: string) {
    return axios.get(apiUrl, {
      auth: {username: this.email + '/token', password: this.token},
      validateStatus,
      cancelToken: this.source.token
    }).then(res => res.data);
  }

  private getApiUrl(type: string, page: number) {
    let endpoint = null;
    const perPage = PAGE_PER_CALL > 0 ? `per_page=${PAGE_PER_CALL}` : '';

    switch (type) {
      case DATA_TYPES.ARTICLES:
        endpoint = `/api/v2/help_center/articles.json?${perPage}&sort_by=updated_at&sort_order=asc&include=translations&page=${page}`;
        break;
      case DATA_TYPES.CATEGORIES:
        endpoint = `/api/v2/help_center/categories.json?${perPage}&include=translations&page=${page}`;
        break;
      case DATA_TYPES.SECTIONS:
        endpoint = `/api/v2/help_center/sections.json?${perPage}&include=translations&sort_by=updated_at&sort_order=asc&page=${page}`;
        break;
      // enable if we need users
      // case DATA_TYPES.USERS:
      //   endpoint = `/api/v2/users.json?page=${page}`;
      //   break;
      case DATA_TYPES.TICKETS:
        endpoint = `/api/v2/tickets.json?page=${page}&sort_by=created_at&sort_order=asc`;
        break;
    }

    return this.url + endpoint;
  }

  private processNewData(page: ZResponse, type: string) {
    if (!this.data[type]) {
      this.data[type] = {data: []};
    }
    this.data[type].amountPerPage = this.data[type].amountPerPage || page.per_page || page[type].length;
    this.data[type].totalCount = this.data[type].totalCount || page.count;
    this.data[type].data.push(...page[type]);
  }
};
