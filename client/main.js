import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Router, useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import createStore from './redux/createStore'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Root from './containers/Root'
import { AppContainer } from 'react-hot-loader'

// ========================================================
// Browser History Setup
// ========================================================
const browserHistory = useRouterHistory(createBrowserHistory)({
  basename: __BASENAME__
})

// ========================================================
// Store and History Instantiation
// ========================================================
// Create redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the routerKey "router" in src/routes/index.js,
// so we need to provide a custom `selectLocationState` to inform
// react-router-redux of its location.
const store = createStore(window.__INITIAL_STATE__, browserHistory)
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
})

// ========================================================
// Developer Tools Setup
// ========================================================
if (false && __DEBUG__) {
  if (window.devToolsExtension) window.devToolsExtension.open()
}

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

const render = (routerKey = null) => {
  const nextRoutes = require('./routes/index').default(store)
  const Root = require('./containers/Root').default
  ReactDOM.render(
    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      <AppContainer>
        <Root
          store={store}
          history={history}
          routes={nextRoutes}
          routerKey={routerKey}
        />
      </AppContainer>,
    </MuiThemeProvider>,
    MOUNT_NODE
  )
}

// Enable HMR and catch runtime errors in RedBox
// This code is excluded from production bundle
if (__DEV__ && module.hot) {
  module.hot.accept([
    './containers/Root',
    './routes/index'
  ], () => render(Date.now()))
}

// ========================================================
// Render!
// ========================================================
render()
