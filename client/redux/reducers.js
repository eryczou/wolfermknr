import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import auth from './modules/auth'
import sidebar from './modules/sidebar'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // sync reducers here
    auth,
    sidebar,
    router,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
