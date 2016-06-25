import React from 'react'
import Counter from './containers/Counter'

class CounterView extends React.Component {
  render() {
    return (
      <div id='wfx-price'>
        <div className='container wfx-mainWrapper wfx-align-vCenter'>
          <Counter />
        </div>
      </div>
    )
  }
}

export default CounterView
