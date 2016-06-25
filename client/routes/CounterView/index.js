import { injectReducer } from '../../redux/reducers'

export default (store) => ({
  path: 'counter',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const CounterView = require('./CounterView').default
      const counterReducer = require('./modules/counter').default

      injectReducer(store, { key: 'counter', reducer: counterReducer })

      cb(null, CounterView)

    }, 'CounterView')
  }
})
