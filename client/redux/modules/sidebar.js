/* @flow */

// ------------------------------------
// Constants
// ------------------------------------
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'
export const SHOW_SIDEBAR = 'SHOW_SIDEBAR'
export const SWITCH_OPTION = 'SWITCH_OPTION'


// ------------------------------------
// Actions
// ------------------------------------
export const toggleSidebar = (): Action => {
  return {
    type: TOGGLE_SIDEBAR
  }
}

export const showSidebar = (): Action => {
  return {
    type: SHOW_SIDEBAR
  }
}

export const switchOption = (option): Action => {
  return {
    type: SWITCH_OPTION,
    payload: {
      option: option
    }
  }
}

export const actions = {
  toggleSidebar,
  showSidebar,
  switchOption
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TOGGLE_SIDEBAR]: (state, action) => {
    const isToggled = !state.isToggled
    return Object.assign({}, state, { isToggled })
  },
  [SHOW_SIDEBAR]: (state, action) => {
    return Object.assign({}, state, { isToggled: false })
  },
  [SWITCH_OPTION]: (state, { payload }) => {
    return Object.assign({}, state, { option: payload.option })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isToggled: true,
  option: 'logIn'
}
export default function sidebarReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
