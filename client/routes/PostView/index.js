import { injectReducer } from '../../redux/reducers'

const PostViewRoute = (store) => ({
  path: 'post',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const PostView = require('./PostView').default
      const postReducer = require('./modules/post').default

      injectReducer(store, {key: 'post', reducer: postReducer})

      cb(null, PostView)

    }, 'PostView')
  }
})

export default PostViewRoute
