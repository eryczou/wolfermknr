/* @flow */
import { checkHttpStatus, parseJSON } from '../../../utils/webUtils'

// ------------------------------------
// Constants
// ------------------------------------
export const REQUESTING_CREATE_POST = 'SENDING_CREATE_POST'
export const RECEIVED_CREATE_POST = 'RECEIVED_CREATE_POST'
export const FAILED_CREATE_POST = 'FAILED_CREATE_POST'

// ------------------------------------
// Actions
// ------------------------------------
export const sendingCreatePost = () => {
  return {
    type: REQUESTING_CREATE_POST
  }
}

export const receivedCreatePost = (data) => {
  return {
    type: RECEIVED_CREATE_POST,
    payload: {
      data: data
    }
  }
}

export const failedCreatePost = (error) => {
  return {
    type: FAILED_CREATE_POST,
    error: error
  }
}

export const createPost = (postTitle, postBody, coverUrl, musicIds, tag) => (dispatch, state) => {
  dispatch(sendingCreatePost)
  return fetch(__JAVA_API_URL__ + '/post', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: 1,
      postTitle: postTitle,
      postBody: postBody,
      postCoverUrl: coverUrl,
      musicIds: musicIds,
      tag: tag
    })
  })
    .then((response) => dispatch(receivedCreatePost(response.payload)))
    .catch((error) => dispatch(failedCreatePost(error)))
}

export const fetchPost = () => (dispatch, state) => {
  dispatch(sendingCreatePost())
  return fetch(__JAVA_API_URL__ + '/post')
    .then(checkHttpStatus)
    .then(parseJSON)
    .then((response) => dispatch(receivedCreatePost(response.payload)))
    .catch((error) => dispatch(failedCreatePost(error)))
}

export const actions = {
  createPost,
  fetchPost,
  sendingCreatePost,
  receivedCreatePost,
  failedCreatePost
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REQUESTING_CREATE_POST]: (state, action) => {
    return Object.assign({}, state, {
      'isFetching': true,
      'statusText': 'Creating a New Post...'
    })
  },
  [RECEIVED_CREATE_POST]: (state, { payload }) => {
    console.log(payload.data)
    return Object.assign({}, state, {
      'isFetching': false,
      postData: payload.data,
      'statusText': 'Successfully Received Post Data'
    })

  },
  [FAILED_CREATE_POST]: (state, action) => {
    return Object.assign({}, state, {
      'isFetching': false,
      postData: [],
      'statusText': `Failed when fetch post data, due to ${action.error}`
    })
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isFetching: false,
  statusText: 'Using the form below to create a new post...',
  postData: []
}

export default function postCreatorReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}

