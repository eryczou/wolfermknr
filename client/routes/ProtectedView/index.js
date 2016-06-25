
const ProtectedViewRoute = (store) => ({
  path: 'protected',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const ProtectedView = require('./ProtectedView').default
      cb(null, ProtectedView)

    }, 'ProtectedView')
  }
})

export default ProtectedViewRoute
