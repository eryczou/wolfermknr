import jwt from 'koa-jwt'
import bcrypt from 'bcrypt'
import moment from 'moment'
import config from '../../config'
import { log } from './../utils/devUtils'
import constants from './../utils/constants'
import { User, Token } from '../model'

export const loginUser = (email, password) => {
  log.info(`login user start: for user ${email}`)
  return new Promise((resolve, reject) => {
    User.findOne({
        'email': email
      })
      .exec()
      .then((user) => {
        if (user != null) {
          const hash = user.password
          const isValidPassword = bcrypt.compareSync(password, hash)
          if (isValidPassword) {
            log.info(`login user success: for user ${email}`)
            const userId = user.id
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

export const registerUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const dbTimeNow = moment().format("YYYY-MM-DD HH:mm:ss")
    const salt = bcrypt.genSaltSync(8) + config.auth.secret
    const hash = bcrypt.hashSync(password, salt)

    User.create({
        email: email,
        password: hash,
        status: User.STATUS.ACTIVE,
        lastLogin: dbTimeNow,
        createdAt: dbTimeNow,
        updatedAt: dbTimeNow
      })
      .then((user) => {
        log.info(`register user success: for user: ${email}`)
        resolve(user)
      })
      .catch((error) => {
        log.error(`register user failed: ${error} for user ${email}`)
        reject(error)
      })
  })
}

export const hasUser = (email) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email }).exec()
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

const updateUserRefreshToken = (userId , device = '') => {
  return new Promise(function(resolve, reject) {
    const refreshToken = generateRefreshToken(userId)
    const tokenSalt = bcrypt.genSaltSync(1)
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, tokenSalt)
    const dbTimeNow = moment().format("YYYY-MM-DD HH:mm:ss")

    log.info(`upsert refreshToken start: for userId ${userId}`)
    User.findByIdAndUpdate(userId, {updatedAt: dbTimeNow})
      .then((user) => {
        if (user != null) {
          const token = new Token
          token.device = device
          token.refreshToken = hashedRefreshToken
          token.updatedAt = dbTimeNow
          //user.token = token
          user.updatedAt = dbTimeNow
          console.log(user)
          user.update({_id: userId}, user)
            .exec()
            .then((user) => {
              console.log(user)
              log.info(`update refreshToken success: for userId ${userId}`)
              resolve(user)
            })
            .catch((error) => {
              log.error(`update refreshToken failed: ${error} for userId ${userId}`)
              reject(error)
            })
        } else {
          log.error(`upsert refreshToken failed: do not find user with userID: ${userId}`)
          reject(`failed to remember user login`)
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
      userId: userId,
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
  updateUserRefreshToken,
  hasUser,
  loginUser,
  generateToken,
  getTokenExpireDate,
  generateRefreshToken,
  getRefreshTokenExpireDate,
  getRefreshToken
})
