import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { TextField, FlatButton, Checkbox } from 'material-ui'

import { isValidEmail } from '../../utils/webUtils'
import Constants from '../../utils/constants'
import classes from './Login.scss'
import { actions as authActions } from '../../redux/modules/auth'

const styles = {
  textFieldStyle: {
    width: '100%',
    height: '62px',
    marginBottom: '5px'
  },
  inputStyle: {
    marginTop: '8px',
    color: 'white'
  },
  floatingLabelStyle: {
    top: '27px',
    color: '#777777'
  },
  errorStyle: {
    position: 'absolute',
    top: '56px'
  },
  underlineStyle: {
    bottom: '9px'
  },
  submitButton: {
    paddingLeft: '0px',
    paddingRight: '0px',
    color: 'steelblue',
    fontSize: '20px'
  },
  labelStyle: {
    paddingLeft: '0px',
    paddingRight: '0px'
  },
  checkBoxStyle: {
    width: '130px'
  },
  checkBoxLabel: {
    width: 'calc(100% - 27px)',
    color: '#E0E0E0'
  },
  checkBoxIcon: {
    fill: 'wheat',
    marginRight: '3px'
  }
}

class Login extends React.Component {

  static propTypes = {
    statusText: PropTypes.string.isRequired,
    isRequesting: PropTypes.bool.isRequired,
    loginUser: PropTypes.func.isRequired,
    error: PropTypes.object.isRequired,
    updateError: PropTypes.func.isRequired,
    removeError: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props)
    this.inputHandler = this.inputHandler.bind(this)
    this.submitHandler = this.submitHandler.bind(this)
  }

  submitHandler(e) {
    e.preventDefault()
    e.stopPropagation()
    const { updateError, loginUser } = this.props

    const email = $('#login-input-email').val()
    const password = $('#login-input-password').val()
    const rememberMe = $('#login-input-remember').is(':checked')

    let hasError = false
    if (!isValidEmail(email)) {
      updateError(Constants.EMAIL_INPUT, Constants.NOT_VALID_EMAIL)
      hasError = true
    }

    if (!hasError) {
      loginUser(email, password, rememberMe)
    }
  }

  inputHandler(e) {
    e.stopPropagation()
    const { error } = this.props
    const { removeError } = this.props


    switch (e.target.name) {
      case 'email':
        if (error.EMAIL_INPUT) {
          removeError(Constants.EMAIL_INPUT)
        }
        break
      case 'password':
      case 'passwordConfirm':
        if (error.PASSWORD_CONFIRM_INPUT) {
          removeError(Constants.PASSWORD_CONFIRM_INPUT)
        }
        break
    }
  }

  render() {

    const { isRequesting, statusText, error } = this.props

    return (
      <div className={classes.loginContainer}>
        {statusText ? <p className={classes.statusText}>{statusText}</p> : ''}
        <TextField id='login-input-email'
                   name='email'
                   type='text'
                   autoComplete='off'
                   style={styles.textFieldStyle}
                   inputStyle={styles.inputStyle}
                   floatingLabelStyle={styles.floatingLabelStyle}
                   errorStyle={styles.errorStyle}
                   underlineStyle={styles.underlineStyle}
                   floatingLabelText='Email'
                   errorText={error.EMAIL_INPUT? error.EMAIL_INPUT : ''}
                   onClick={this.inputHandler}
        />
        <TextField id='login-input-password'
                   name='password'
                   type='password'
                   autoComplete='off'
                   style={styles.textFieldStyle}
                   inputStyle={styles.inputStyle}
                   floatingLabelStyle={styles.floatingLabelStyle}
                   errorStyle={styles.errorStyle}
                   underlineStyle={styles.underlineStyle}
                   onClick={this.inputHandler}
                   floatingLabelText='Password'
        />
        <div className={classes.submitRow}>
          <FlatButton label='Submit'
                      style={styles.submitButton}
                      labelStyle={styles.labelStyle}
                      disabled={isRequesting}
                      onClick={this.submitHandler}
          />
          <Checkbox id='login-input-remember'
                    label='Remember Me'
                    labelStyle={styles.checkBoxLabel}
                    iconStyle={styles.checkBoxIcon}
                    style={styles.checkBoxStyle}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isRequesting : state.auth.isRequesting,
  statusText : state.auth.statusText,
  user : state.auth.user,
  error: state.auth.error
})

export default connect(mapStateToProps, authActions)(Login)
