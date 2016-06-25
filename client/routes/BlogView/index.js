import { injectReducer } from '../../redux/reducers'

const BlogViewRoute = (store) => ({
  path: 'blog',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const BlogView = require('./BlogView').default
      const mdeReducer = require('../../redux/modules/mde').default

      injectReducer(store, {key: 'mde', reducer: mdeReducer})

      cb(null, BlogView)
    }, 'BlogView')
  }
})

export default BlogViewRoute
