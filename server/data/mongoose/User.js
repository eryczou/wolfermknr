// server/data/mongoose/user.js
import mongoose from 'mongoose'

/**
 * User Schema
 */
var UserSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  role: {
    type: Number,
    min: 0,
    max: 3
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  lastLogin: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  }
})

/**
 * Virtual Property
 */
UserSchema
  .virtual('userInfo')
  .get(() => {
    return {
      _id: this._id,
      userId: this.userId,
      role: this.role,
      email: this.email,
      userName: this.userName,
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
  .validate(function(value, response) {
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
  if (!this.isNew) {
    return next()
  }
  if (!isValidPassword(this.password)) {
    next(new Error('Invalid password'))
  }
  next()
})

var isValidPassword = (value) => (value && value.length)

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

export default mongoose.model('User', UserSchema)
