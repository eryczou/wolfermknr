import React from 'react';
import TodoList from './containers/TodoList'

class TodoListView extends React.Component {
  constructor() {
    super();
  }

  render() {
    return(
      <div>
        <TodoList />
      </div>
    )
  }
}

export default TodoListView

