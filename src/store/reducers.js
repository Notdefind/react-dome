import { combineReducers } from 'redux'
import locationReducer from './location'
import reducers from '../containers/reducers';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    ...asyncReducers,
    ...reducers
  })
}


export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
