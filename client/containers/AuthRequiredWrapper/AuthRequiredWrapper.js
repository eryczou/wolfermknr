import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { actions as authActions } from '../../redux/modules/auth'

class AuthRequiredWrapper extends React.Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    isLoggedIn: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.isLoggedIn()
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

export default connect(null, authActions)(AuthRequiredWrapper)

