import {STEPS, VENDORS} from '../common/constants';
import {actions} from "./actions";
import {setError, setSession, setVendorData} from "../common/LocalStorage";

const forEach = require('lodash/forEach');

interface State {
  session: {
    step: number,
    vendor: string,
    credentials: object,
    isFetching: boolean
  },
  error: any,
  Z: object
}
interface ReducerHandlerObject {
  [key: string]: (state: State, payload?: object) => State
}

const INITIAL_STATE: State = {
  session: {
    step: STEPS.VENDOR_SELECT,
    vendor: '',
    credentials: {},
    isFetching: false
  },
  error: null,
  Z: {}
};

const handlers: ReducerHandlerObject = {
  [actions.INIT_SESSION]: (state, payload: {session: object, error: any}) => {
    const { session, error } = payload;
    return assignState(state, {session, error});
  },

  [actions.INIT_VENDOR_DATA]: (state, payload: {vendor: string, data: object}) => {
    const { vendor, data } = payload;
    return assignState(state, {[vendor]: data, error: null});
  },

  [actions.SELECT_VENDOR]: (state, payload: {vendor: string}) => {
    const { vendor } = payload;
    return assignState(state, {session: {vendor, step: STEPS.LOGIN}});
  },

  [actions.AUTHENTICATE]: (state) => {
    return assignState(state, {session: {isFetching: true}, error: null});
  },

  [actions.AUTHENTICATE_SUCCESS]: (state, payload: {countData, credentials}) => {
    const { credentials, countData } = payload;
    return assignState(state, {session: {isFetching: false, step: STEPS.FETCH, credentials}, [state.session.vendor]: countData, error: null});
  },

  [actions.ON_PROGRESS]: (state, payload: {data: object}) => {
    return assignState(state, {[state.session.vendor]: payload.data, error: null});
  },

  [actions.FETCH]: (state: State) => {
    return assignState(state, {session: {step: STEPS.DOWNLOAD, isFetching: true}, error: null});
  },

  [actions.FETCH_SUCCESS]: (state, payload: {vendor: string, data: object}) => {
    return assignState(state, {[state.session.vendor]: payload.data, error: null, session: {isFetching: false}});
  },

  [actions.INIT]: () => {
    return assignState(INITIAL_STATE, {session: {step: STEPS.LOGIN, vendor: VENDORS.Z}});
  },

  [actions.ERROR]: (state: State, payload: {error: any}) => {
    const { error } = payload;
    return assignState(state, {error, session: {isFetching: false}});
  }
};

function assignState(state, extra) {
  const newState = Object.assign({}, state);

  forEach(extra, (value, key) => {
    const newValue = Object.assign({}, state[key], value);
    Object.assign(newState, {[key]: newValue});
  });

  return newState;
}

export function reducer(state = INITIAL_STATE, action) {
  const handler = handlers[action.type];
  let newState = state;

  if (handler) {
    newState = handler(state, action.payload);

    if (newState.session !== state.session) {
      setSession(newState.session);
    }

    if (newState.error !== state.error) {
      setError(newState.error);
    }

    if (newState.Z !== state.Z) {
      setVendorData(VENDORS.Z, newState.Z);
    }
  }

  return newState;
}
