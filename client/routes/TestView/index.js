
const TestViewRoute = (store) => ({
  path: 'test',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const TestView = require('./TestView').default

      cb(null, TestView)

    }, 'TestView')
  }
})

export default TestViewRoute
