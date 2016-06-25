/* @flow */
import { routerActions } from 'react-router-redux'
import cookie from 'react-cookie'
import Constants from '../../utils/constants'
import { checkHttpStatus, parseJSON } from '../../utils/webUtils'
import { actions as sidebarActions } from './sidebar'

// ------------------------------------
// Constants
// ------------------------------------
export const ISSUE_AUTH_REQUEST = 'ISSUE_AUTH_REQUEST'
export const AUTH_USER_FAILURE = 'AUTH_USER_FAILURE'
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS'
export const LOGOUT_USER = 'LOGOUT_USER'
export const SHOW_ERROR = 'SHOW_ERROR'

// ------------------------------------
// Actions
// ------------------------------------
export const loginUserSuccess = (user): Action => {
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      user: user
    }
  }
}

export const authUserFailure = (error): Action => {
  return {
    type: AUTH_USER_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  }
}

export const issueAuthRequest = (): Action => {
  return {
    type: ISSUE_AUTH_REQUEST
  }
}

export const loginUser = (email, password, rememberMe, redirect='/') => {
  return function(dispatch, getState) {
    dispatch(issueAuthRequest())
    let state = getState()

    return fetch(`${__NODE_API_URL__}/auth/login`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password ,
        rememberMe: rememberMe
      })
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then((response) => {
        try {
          dispatch(loginUserSuccess(response.payload.user))
          let redirectLocation = state.router.locationBeforeTransitions.query.fromLoc
          if (typeof redirectLocation != 'undefined' && redirectLocation) {
            dispatch(routerActions.push(`${redirectLocation}`))
          }
        } catch (error) {
          dispatch(authUserFailure({
            response: {
              status: 403,
              statusText: 'Login failed, please try again'
            }
          }))
        }
      })
      .catch((error) => {
        dispatch(authUserFailure(error))
      })
  }
}

export const registerUser = (email, password, redirect='/') => {
  return (dispatch, getState) => {
    dispatch(issueAuthRequest())
    let state = getState()

    return fetch(`${__NODE_API_URL__}/auth/register`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password })
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then((response) => {
        if (response.errorCode == Constants.serverErrorCode.AUTH_DUPLICAT_EMAIL) {
          dispatch(authUserFailure({
            response: {
              status: 202,
              statusText: 'Register failed, please try again with another email'
            }
          }))
        } else {
          try {
            dispatch(loginUserSuccess(response.payload.user))
            let redirectLocation = state.router.locationBeforeTransitions.query.fromLoc
            if (typeof redirectLocation != 'undefined' && redirectLocation) {
              dispatch(routerActions.push(`${redirectLocation}`))
            }
          } catch (error) {
            dispatch(authUserFailure({
              response: {
                status: 403,
                statusText: 'Register failed, please try again'
              }
            }))
          }
        }
      })
      .catch((error) => {
        dispatch(authUserFailure(error))
      })
  }
}

export const logout = (): Action => {
  cookie.remove('wfx_token')
  cookie.remove('wfx_refresh')
  return {
    type: LOGOUT_USER
  }
}

export const logoutAndRedirect = () => {
  return (dispatch, state) => {
    dispatch(logout())
    dispatch(routerActions.push('/'))
    dispatch(sidebarActions.showSidebar())
  }
}

export const isLoggedIn = () => {
  return (dispatch, getState) => {
    let state = getState()
    const curLocation = state.router.locationBeforeTransitions.pathname
    fetch(`${__NODE_API_URL__}/auth/isLoggedIn`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then((response) => {
        let redirectLocation = state.router.locationBeforeTransitions.query.fromLoc
        if (typeof redirectLocation != 'undefined' && redirectLocation) {
          dispatch(routerActions.push(`/${redirectLocation}`))
        }
      })
      .catch((error) => {
        dispatch(authUserFailure({
          response: {
            status: 401,
            statusText: 'Please login to access the protected content'
          }
        }))
        dispatch(routerActions.push(`/?fromLoc=${curLocation}`))
        dispatch(sidebarActions.showSidebar())
      })
  }

}

export const updateError = (target, errorCode) => {
  return (dispatch, getState) => {
    const state = getState()
    const error = Object.assign({}, state.auth.error, { [target]: errorCode })
    dispatch(showError(error))
  }
}

export const showError = (error): Action => {
  return {
    type: SHOW_ERROR,
    payload: {
      error: error
    }
  }
}

export const removeError = (target) => {
  return (dispatch, getState) => {
    const state = getState()
    let preError = state.auth.error
    if (preError.hasOwnProperty(target)) {
      delete preError[target]
      const error = Object.assign({}, preError)
      dispatch(showError(error))
    }
  }
}

export const actions = {
  loginUserSuccess,
  authUserFailure,
  issueAuthRequest,
  loginUser,
  registerUser,
  logout,
  logoutAndRedirect,
  isLoggedIn,
  updateError,
  showError,
  removeError
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ISSUE_AUTH_REQUEST]: (state, action) => {
    return Object.assign({}, state, {
      isRequesting : true,
      statusText : 'You are authenticating'
    })
  },
  [LOGIN_USER_SUCCESS]: (state, { payload }) => {
    return Object.assign({}, state, {
      isRequesting : false,
      isAuthenticated : true,
      user : payload.user,
      statusText : `You have been successfully logged in.`
    })
  },
  [AUTH_USER_FAILURE]: (state, { payload }) => {
    return Object.assign({}, state, {
      isRequesting: false,
      isAuthenticated: false,
      user: null,
      statusText: `Status: (${payload.status}) ${payload.statusText}`
    })
  },
  [LOGOUT_USER]: (state, action) => {
    return Object.assign({}, state, {
      isAuthenticated: false,
      user: null,
      statusText: 'You have been successfully logged out.'
    })
  },
  [SHOW_ERROR]: (state, { payload }) => {
    return Object.assign({}, state, {
      error: payload.error
    })
  }
}


// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  user: null,
  isAuthenticated: false,
  isRequesting: false,
  statusText: '',
  error: {}
}

export default function authReducer (state: obj = initialState, action: Action): Object {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
