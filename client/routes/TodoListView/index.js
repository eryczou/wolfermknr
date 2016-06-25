import { injectReducer } from '../../redux/reducers'

const TodoListViewRoute = (store) => ({
  path: 'todo',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const TodoListView = require('./TodoListView').default
      const todoListReducer = require('./modules/todoList').default

      injectReducer(store, {key: 'todoList', reducer: todoListReducer})

      cb(null, TodoListView)

    }, 'TodoListView')
  }
})

export default TodoListViewRoute
