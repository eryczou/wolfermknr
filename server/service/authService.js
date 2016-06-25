import jwt from 'koa-jwt'
import bcrypt from 'bcrypt'
import moment from 'moment'
import config from '../../config'
import { log } from './../utils/devUtils'
import User from '../data/models/User'
import Token from '../data/models/Token'

export const loginUser = (email, password) => {
  log.info(`login user start: for user ${email}`)
  return new Promise(function(resolve, reject) {
    new User({
      'email': email
    })
      .fetch()
      .then((model) => {
        if (model != null) {
          const hash = model.get('password')
          const isValidPassword = bcrypt.compareSync(password, hash)
          if (isValidPassword) {
            log.info(`login user success: for user ${email}`)
            const userId = model.get('user_id')
            const token = generateToken()
            resolve({
              userId: userId,
              token: token
            })
          } else {
            reject('Invalid password')
          }
        } else {
          reject(`Don't get record`)
        }

      })
      .catch((error) => {
        log.error(`login user failed: ${error} for user ${email}`)
        reject(error)
      })
  })
}

export const hasUser = (email) => {
  return new Promise((resolve, reject) => {
    new User({
      'email': email
    })
      .fetch()
      .then((model) => {
        if (model != null) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      .catch((error) => {
        log.error(`hasUser() failed: ${error} for ${email}`)
        reject(error)
      })
  })
}

export const registerUser = (email, password) => {
  log.info(`register user start: ${email}`)
  return new Promise(function(resolve, reject) {
    const dbTimeNow = moment().format("YYYY-MM-DD HH:mm:ss")
    const salt = bcrypt.genSaltSync(8) + config.auth.secret
    const hash = bcrypt.hashSync(password, salt)

    new User({
      email: email,
      password: hash,
      time_created: dbTimeNow,
      time_updated: dbTimeNow
    })
      .save()
      .then((model) => {
        log.info(`register user success: for email: ${email}, user: ${email}`)
        resolve(model)
      })
      .catch((error) => {
        log.error(`register user failed: ${error} for user ${email}`)
        reject(error)
      })
  })
}

const upsertRefreshToken = (userId , device = '') => {
  return new Promise(function(resolve, reject) {
    const refreshToken = generateRefreshToken(userId)
    const tokenSalt = bcrypt.genSaltSync(1)
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, tokenSalt)
    const dbTimeNow = moment().format("YYYY-MM-DD HH:mm:ss")

    log.info(`upsert refreshToken start: for userId ${userId}`)
    new Token({
      user_id: userId,
      device: device
    })
      .fetch()
      .then((model) => {
        if (model != null) {
          model.where({user_id: userId}, true)
            .save({
                device: device,
                refresh: hashedRefreshToken,
                time_updated: dbTimeNow
              },
              { patch: true }
            )
            .then((model) => {
              log.info(`update refreshToken success: for userId ${userId}`)
              resolve(model.get('refresh'))
            })
            .catch((error) => {
              log.error(`update refreshToken failed: ${error} for userId ${userId}`)
              reject(error)
            })
        } else {
          // create new token
          new Token({
            user_id: userId,
            device: device,
            refresh: hashedRefreshToken,
            time_created: dbTimeNow,
            time_updated: dbTimeNow
          })
            .save()
            .then((model) => {
              log.info(`insert refreshToken success: for userId ${userId}`)
              resolve(model)
            })
            .catch((error) => {
              log.error(`insert refreshToken failed: ${error} for userId ${userId}`)
              reject(error)
            })
        }
      })
      .catch((error) => {
        log.error(`upsert refreshToken failed: ${error} for userId ${userId}`)
        reject(error)
      })
  })
}

export const getRefreshToken = (userId, device = '') => {
  return new Promise(function(resolve, reject) {
    new Token({
      user_id: userId,
      device: device
    })
      .fetch()
      .then((model) => {
        if (model != null) {
          resolve(model.get('refresh'))
        } else {
          reject(`Don't get record`)
        }
      })
      .catch((error) => {
        log.error(`getRefreshToken() failed: ${error} for userId ${userId}`)
        reject(error)
      })
  })
}

export const generateToken = (userId) => {
  const payload = { userId }

  return jwt.sign(payload, config.jwt.secret, {
    expire: config.jwt.expire
  })
}

export const generateRefreshToken = (userId) => {
  const payload = { userId }

  return jwt.sign(payload, config.jwt.secret, {
    expire: config.jwt.refresh_expire
  })
}

export const getTokenExpireDate = () => {
  return new Date(Date.now() + config.jwt.cookie_expire)
}

export const getRefreshTokenExpireDate = () => {
  return new Date(Date.now() + config.jwt.cookie_refresh_expire)
}

export default ({
  registerUser,
  upsertRefreshToken,
  hasUser,
  loginUser,
  generateToken,
  getTokenExpireDate,
  generateRefreshToken,
  getRefreshTokenExpireDate,
  getRefreshToken
})
