import { createStore, applyMiddleware } from 'redux';
import {reducer} from './reducer';
import {dispatchInit, middleware} from './middleware';

const store = createStore(reducer, applyMiddleware(middleware));
dispatchInit(store);
