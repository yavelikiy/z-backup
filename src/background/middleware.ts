import {actions} from './actions';
import Messages from "../common/Messages";
import {DATA_TYPES, DATA_TYPES_TO_LOAD, LOGOS, VENDORS} from '../common/constants';
import ZAdaptor from "./Adaptors/ZAdaptor";
import {getError, getSession, getVendorData, listenToStorageChanges} from "../common/LocalStorage";

const reduce = require('lodash/reduce');

interface MiddlewareHandlerObject {
  [key: string]: (store?: object, payload?: object) => void
}

let apiAdaptor = null;

function init (store) {
  Messages.onPopupOpen(() => {
    store.dispatch({type: actions.POPUP_OPEN});
  });
  Messages.onAuthenticationRequest((params, sendResponse) => {
    store.dispatch({type: actions.AUTHENTICATE, payload: {params, sendResponse}});
  });
  Messages.onFetchRequest((params, sendResponse) => {
    store.dispatch({type: actions.FETCH, payload: {params, sendResponse}});
  });
  Messages.onSendDataSaved((params, sendResponse) => {
    setTimeout(() => dispatchInit(store), 1500);
    sendResponseSafely({received: true}, sendResponse);
  });
  Messages.onPopupClose(() => {
    store.dispatch({type: actions.POPUP_CLOSE});
  });
  Messages.onSendStartOver((params, sendResponse) => {
    sendResponseSafely({received: true}, sendResponse);
    apiAdaptor.stop();
    setIdleBadge();
    dispatchInit(store);
  });
  Messages.onVendorSelect((params: {vendor: string}, sendResponse) => {
    store.dispatch({type: actions.SELECT_VENDOR, payload: {vendor: params.vendor}});
    sendResponseSafely({received: true}, sendResponse);
  });

  listenToStorageChanges((changes: {[key: string]: {newValue?: object}}) => {
    const state = store.getState();

    const isCleared = reduce(state, (acc, value, key) => {
      return acc && (!changes[key] || !changes[key].newValue);
    }, true);

    if (isCleared) {
      dispatchInit(store);
    }
  });

  Promise.all([
    getSession(),
    getError()
  ]).then(([session, error]) => {
    store.dispatch({type: actions.INIT_SESSION, payload: {session, error}});
  });
}

function onVendorSelect (store, payload) {
  const { vendor } = payload;

  switch (vendor) {
    case VENDORS.Z:
      apiAdaptor = new ZAdaptor();
      break;
  }

  getVendorData(vendor)
    .then(data => {
      store.dispatch({type: actions.INIT_VENDOR_DATA, payload: {vendor, data}})
    });
}

function onPopupOpen (store) {
  const state = store.getState();

  if (!state.session.isFetching) {
    setIdleBadge();
  }
}

function onPopupClose () {
  // TODO?
}

function onAuthenticateRequest (store, payload) {
  const { params, sendResponse } = payload;

  apiAdaptor.authenticate(params)
    .then((countData) => {
      sendResponseSafely(countData, sendResponse);
      store.dispatch({type: actions.AUTHENTICATE_SUCCESS, payload: {credentials: params, countData}});
    })
    .catch(error => {
      saveError(store, error);
      sendResponseSafely({error}, sendResponse);
    });
}

function onFetchRequest (store, payload) {
  apiAdaptor.onProgress(data => {
    store.dispatch({type: actions.ON_PROGRESS, payload: {data}});
  });

  const { sendResponse, params = {dataTypes: DATA_TYPES_TO_LOAD} } = payload;
  const { dataTypes } = params;
  const state = store.getState();
  const cachedData = state[state.session.vendor];

  stayAwake();
  setFetchBadge();
  apiAdaptor.getData({cachedData, dataTypes})
    .then((data) => {
      store.dispatch({type: actions.FETCH_SUCCESS, payload: {data}});
      setIdleBadge();

      if (isPopupOpen()) {
        sendResponseSafely(data, sendResponse);
      } else {
        setSuccessBadge();
      }

      youCanSleepNow();
    })
    .catch(error => {
      saveError(store, error);
      setIdleBadge();

      if (isPopupOpen()) {
        sendResponseSafely({error}, sendResponse);
      } else {
        setErrorBadge();
      }
      youCanSleepNow();
    });
}

// HELPER FUNCTIONS
function isPopupOpen() {
  return chrome.extension.getViews({ type: "popup" }).length > 0;
}

function setSuccessBadge() {
  chrome.browserAction.setIcon(LOGOS.SUCCESS);
}

function setIdleBadge() {
  chrome.browserAction.setIcon(LOGOS.IDLE);
}

function setFetchBadge() {
  chrome.browserAction.setIcon(LOGOS.FETCH);
}

function setErrorBadge() {
  chrome.browserAction.setIcon(LOGOS.ERROR);
}

function stayAwake() {
  chrome.power.requestKeepAwake('system');
}

function youCanSleepNow() {
  chrome.power.releaseKeepAwake();
}

function saveError(store, error) {
  store.dispatch({type: actions.ERROR, payload: {error}});
}

function sendResponseSafely (response, sendResponse) {
  try {
    sendResponse(response);
  } catch (error) {
    // port probably disconnected - i.e. popup was closed
    console.log(error);
  }
}

export function dispatchInit(store) {
  store.dispatch({type: actions.INIT});

  //TODO remove this after adding vendor select
  store.dispatch({type: actions.SELECT_VENDOR, payload: {vendor: VENDORS.Z}});
}

const handlers: MiddlewareHandlerObject = {
  [actions.INIT]: init,
  [actions.SELECT_VENDOR]: onVendorSelect,
  [actions.POPUP_OPEN]: onPopupOpen,
  [actions.POPUP_CLOSE]: onPopupClose,
  [actions.AUTHENTICATE]: onAuthenticateRequest,
  [actions.FETCH]: onFetchRequest,
};

export const middleware = store => next => action => {
  const { type, payload = {} } = action;
  const handler = handlers[type];
  const result = next(action);

  if (handler) {
    handler(store, payload);
  }

  return result
};
