enum MessageNames {
  POPUP_CLOSE = 'POPUP_CLOSE',
  START_OVER = 'START_OVER',
  VENDOR_SELECT = 'VENDOR_SELECT',
  DOWNLOAD = 'DOWNLOAD',
  POPUP_OPEN = 'POPUP_OPEN',
  AUTHENTICATE = 'AUTHENTICATE',
  FETCH_DATA = 'FETCH_DATA'
}
declare global {
  interface Window { onPopupClose: any; }
}

window.onPopupClose = window.onPopupClose || {};

export default class Messages {
  private static listeners = {};
  private static isListening = false;

  static selectVendor(params: object): Promise<any> {
    return Messages.sendMessage(MessageNames.VENDOR_SELECT, params);
  }

  static requestAuthentication(params: object): Promise<any> {
    return Messages.sendMessage(MessageNames.AUTHENTICATE, params);
  }

  static requestDataFetch(): Promise<any> {
    return Messages.sendMessage(MessageNames.FETCH_DATA);
  }

  static sendDataSaved(): Promise<any> {
    return Messages.sendMessage(MessageNames.DOWNLOAD);
  }

  static sendStartOver(): Promise<any> {
    return Messages.sendMessage(MessageNames.START_OVER);
  }

  static onVendorSelect(callback: (params: object, sendResponse?: () => void) => void) {
    Messages.listenTo(MessageNames.VENDOR_SELECT, callback);
  }

  static onAuthenticationRequest(callback: (params: object, sendResponse?: () => void) => void) {
    Messages.listenTo(MessageNames.AUTHENTICATE, callback);
  }

  static onFetchRequest(callback: (params: object, sendResponse?: () => void) => void) {
    Messages.listenTo(MessageNames.FETCH_DATA, callback);
  }

  static onSendDataSaved(callback: (params: object, sendResponse?: (any) => void) => void) {
    Messages.listenTo(MessageNames.DOWNLOAD, callback);
  }

  static onSendStartOver(callback: (params: object, sendResponse?: (any) => void) => void) {
    Messages.listenTo(MessageNames.START_OVER, callback);
  }

  static sendPopupOpen() {
    Messages.sendSyncMessage(MessageNames.POPUP_OPEN);
  }

  static sendPopupClose() {
    const background = chrome.extension.getBackgroundPage();

    if (background.onPopupClose) {
      background.onPopupClose();
    }
    Messages.sendSyncMessage(MessageNames.POPUP_CLOSE);
  }

  static onPopupOpen(callback: () => void) {
    Messages.listenTo(MessageNames.POPUP_OPEN, callback);
  }

  static onPopupClose(callback: () => void) {
    window.onPopupClose = callback;
    Messages.listenTo(MessageNames.POPUP_CLOSE, callback);
  }

  private static listenTo(messageName: string, callback: (payload: any, sendResponse?: () => void) => void): void {
    Messages.listeners[messageName] = callback;

    if (!Messages.isListening) {
      Messages.isListening = true;
      Messages.listen();
    }
  }

  private static sendMessage(messageName: string, payload?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({messageName, payload}, (response = {}) => {
        const error = response.error || chrome.runtime.lastError;

        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  private static sendSyncMessage(messageName: string, payload?: any) {
    chrome.runtime.sendMessage({messageName, payload});
  }

  private static listen(): void {
    chrome.runtime.onMessage.addListener((request = {}, sender, sendResponse) => {
      const { messageName } = request;
      const callback = Messages.listeners[messageName];

      if (callback) {
        callback(request.payload, sendResponse);
      }

      return true;
    });
  }
}
