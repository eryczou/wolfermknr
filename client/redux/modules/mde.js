/* @flow */
// ------------------------------------
// Constants
// ------------------------------------
export const UPDATE_MDE_CONTENT = 'UPDATE_MDE_CONTENT'
export const CLEAR_MDE_CONTENT = 'CLEAR_MDE_CONTENT'

// ------------------------------------
// Actions
// ------------------------------------
export const updateContent = (value: string): Action => ({
  type: UPDATE_MDE_CONTENT,
  payload: value
})

export const clearContent = (): Action => ({
  type: CLEAR_MDE_CONTENT
})


export const actions = {
  updateContent,
  clearContent
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [UPDATE_MDE_CONTENT]: (state, { payload }) => {
    return Object.assign({}, state, { mdContent: payload })
  },
  [CLEAR_MDE_CONTENT]: (state) => {
    return Object.assign({}, state, { mdContent: '' })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  mdContent: ''
}
export default function mdeReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
