import Router from 'koa-router'
import jwt from 'koa-jwt'
import config from '../../config'
import { log } from '../utils/devUtils'
import Constants from '../utils/constants'
import authUtils from '../service/authService'
import User from '../data/mongoose/User'

const auth = new Router()

auth.post('/login', async (ctx, next) => {
  const { email, password, rememberMe } = ctx.request.body
  try {
    const { userId, token } = await authUtils.loginUser(email, password)
    ctx.status = 200
    ctx.body = {
      payload: {
        user: {
          user_id: userId
        }
      }
    }

    if (rememberMe) {
      const refreshToken = await authUtils.upsertRefreshToken(userId)
      ctx.cookies.set('wfx_token', token, {
        httpOnly: true,
        overwrite: true,
        expires: authUtils.getTokenExpireDate()
      })
      ctx.cookies.set('wfx_refresh', refreshToken, {
        httpOnly: true,
        overwrite: true,
        expires: authUtils.getRefreshTokenExpireDate()
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
    if (await authUtils.hasUser(email)) {
      log.info(`register user failed: duplicate email for ${email}`)
      ctx.status = 202
      ctx.body = {
        errorCode: Constants.errorCode.AUTH_DUPLICAT_EMAIL
      }
    } else {
      const userModel = await authUtils.registerUser(email, password)
      const userId = userModel.get('user_id')

      if (userId) {
        const token = authUtils.generateToken(userId)
        ctx.status = 200
        ctx.body = {
          payload: {
            user: {
              user_id: userId
            }
          }
        }
        ctx.cookies.set('wfx_token', token, {
          httpOnly: true,
          overwrite: true
        })
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
        const storedRefreshToken = await authUtils.getRefreshToken(userId)
        if (storedRefreshToken == decodeRefreshToken) {
          const newToken = authUtils.generateToken(userId)
          ctx.status = 200
          ctx.body = { payload: 'User has already logged in' }
          ctx.cookies.set('wfx_token', newToken, {
            httpOnly: true,
            overwrite: true,
            expires: authUtils.getTokenExpireDate()
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
