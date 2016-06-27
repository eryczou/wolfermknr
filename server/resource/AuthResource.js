import Router from 'koa-router'
import jwt from 'koa-jwt'
import config from '../../config'
import { log } from '../utils/devUtils'
import Constants from '../utils/constants'
import AuthService from '../service/AuthService'
import User from '../model/UserModel'

const auth = new Router()

auth.post('/login', async (ctx, next) => {
  const { email, password, rememberMe } = ctx.request.body
  try {
    const { userId, token } = await AuthService.loginUser(email, password)
    ctx.status = 200
    ctx.body = {
      payload: {
        user: {
          userId: userId
        }
      }
    }

    if (rememberMe) {
      const refreshToken = await AuthService.updateUserRefreshToken(userId)
      ctx.cookies.set('wfx_token', token, {
        httpOnly: true,
        overwrite: true,
        expires: AuthService.getTokenExpireDate()
      })
      ctx.cookies.set('wfx_refresh', refreshToken, {
        httpOnly: true,
        overwrite: true,
        expires: AuthService.getRefreshTokenExpireDate()
      })
    } else {
      ctx.cookies.set('wfx_token', token, {
        httpOnly: true,
        overwrite: true
      })
    }
  } catch (error) {
    log.error(`login user failed: ${error} for user ${email}`)
    ctx.status = 403
  }
})

auth.post('/register', async (ctx, next) => {
  let { email, password } = ctx.request.body
  try {
    if (await AuthService.hasUser(email)) {
      log.info(`register user failed: duplicate email for ${email}`)
      ctx.status = 202
      ctx.body = {
        errorCode: Constants.errorCode.AUTH_DUPLICAT_EMAIL
      }
    } else {
      const user = await AuthService.registerUser(email, password)

      if (user) {
        const userId = user.id
        const token = AuthService.generateToken(userId)
        ctx.status = 200
        ctx.body = {
          payload: {
            user: {
              userId: userId
            }
          }
        }
        ctx.cookies.set('wfx_token', token, {
          httpOnly: true,
          overwrite: true
        })
      } else {
        log.error(`register user failed: ${error} for user ${email}`)
        ctx.status = 403
      }
    }
  } catch (error) {
    log.error(`register user failed: ${error} for user ${email}`)
    ctx.status = 403
  }
})

auth.get('/isLoggedIn', async (ctx, next) => {
  const token = ctx.cookies.get('wfx_token')
  if (typeof token != 'undefined' && token) {
    try {
      jwt.verify(token, config.jwt.secret)
      ctx.status = 200
      ctx.body = { payload: 'User has already logged in' }
    } catch (error) {
      log.error(`check user login status failed: ${error}`)
      ctx.status = 401
    }
  } else {
    const refreshToken = ctx.cookies.get('wfx_refresh')
    if (typeof refreshToken != 'undefined' && refreshToken) {

      try {
        const decodeRefreshToken = jwt.verify(refreshToken, config.jwt.secret)
        const userId = decodeRefreshToken.userId
        const storedRefreshToken = await AuthService.getRefreshToken(userId)
        if (storedRefreshToken == decodeRefreshToken) {
          const newToken = AuthService.generateToken(userId)
          ctx.status = 200
          ctx.body = { payload: 'User has already logged in' }
          ctx.cookies.set('wfx_token', newToken, {
            httpOnly: true,
            overwrite: true,
            expires: AuthService.getTokenExpireDate()
          })
        } else {
          ctx.status = 401
        }
      } catch (error) {
        log.error(`check user login status failed: ${error}`)
        ctx.status = 401
      }
    } else {
      ctx.status = 401
    }
  }

})

export default auth
