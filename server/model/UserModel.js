// server/data/mongoose/user.js
import mongoose from 'mongoose'
import TokenEntity from './Token'

/**
 * User Schema
 */
const Token = new TokenEntity
const UserSchema = new mongoose.Schema({
  role: { type: Number, min: 0, max: 3 },
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  status: { type: Number, required: true },
  token: { type: Token },
  lastLogin: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
})

/**
 * Indexing
 */
UserSchema.index({ email: 1 });

/**
 * Virtual Property
 */
UserSchema
  .virtual('userInfo')
  .get(() => {
    return {
      id: this._id,
      role: this.role,
      email: this.email,
      username: this.username,
      status: this.status,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
      updateAt: this.updateAt
    }
  })

/**
 * Validation
 */
// validate email format
UserSchema.path('email')
  .validate((email) => {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    return emailRegex.test(email)
  }, 'email is invalid')

// validate email duplication
UserSchema.path('email')
  .validate((value, response) => {
    mongoose.models['User'].findOne({'email': value}, (err, user) => {
      if(err) throw err
      if(user) return response(false)
      response(true)
    })
  }, 'email is already exist')

// validate username duplication
UserSchema.path('username')
  .validate((value, response) => {
    mongoose.models['User'].findOne({'username': value}, (err, user) => {
      if(err) throw err
      if(user) return response(false)
      response(true)
    })
  }, 'username is already exist')

/**
 * Pre Save
 */
UserSchema.pre('save', (next) => {
  console.log('hello')
  if (!this.isNew) {
    console.log('isOld')
    return next()
  }
  console.log('isNew')

  if (!isValidPassword(this.password)) {
    next(new Error('Invalid password'))
  }
  next()
})

const isValidPassword = (value) => (value && value.length)

// method
UserSchema.methods = {
  // generating a hashed password
  generateHash: (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),

  // authentication
  authenticate: (password) => bcrypt.compareSync(password, this.local.password)
}

UserSchema.statics = {
  // getLastRecordId
  getLastRecordId : (cb) => {
    mongoose.models['User'].find().sort({_id:-1}).limit(1).exec((err, user) => {
      if(err) throw err
      if(user && user.length!=0){
        return cb(user[0].userId)
      }
      return cb(0)
    })
  }
}

const UserModel = mongoose.model('User', UserSchema)

/**
 * Constants
 */

UserModel.STATUS = {
  INACTIVE: 0,
  ACTIVE: 1
}

export default UserModel
