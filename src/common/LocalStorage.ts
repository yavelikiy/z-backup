import {SESSION} from './constants';

interface SessionObject {
  step: number;
  credentials: object;
}

export function setVendorData(vendor: string, data: object): Promise<any> {
  return setStorage({[vendor]: data});
}

export function getVendorData(vendor: string): Promise<any> {
  return getStorage(vendor);
}

export function setSession(session: SessionObject): Promise<any> {
  return setStorage({session});
}

export function getSession(): Promise<SESSION> {
  return getStorage('session');
}

export function setError(error: any): Promise<any> {
  return setStorage({error});
}

export function getError(): Promise<SESSION> {
  return getStorage('error');
}

export function listenToStorageChanges(callback: (changes: object) => void): void {
  chrome.storage.onChanged.addListener(callback);
}

function setStorage(obj: object): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(obj, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

function getStorage(name: string): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(name, data => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(data[name]);
      }
    });
  });
}
