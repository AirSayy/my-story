const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const User = new mongoose.Schema({
    googleId:{
        type: String,
        required : true
    },
    displayName:{
        type: String,
        required : true
    },
    firstName:{
        type: String,
        required : true
    },
    lastName:{
        type: String,
        required : true
    },
    image:{
        type: String,
    
    },
    createdAt:{
        type : Date,
        default : Date.now
    }
})

const Username = new mongoose.Schema({
    userName: { type: String, unique: true },
    password: String
})



const UserSchema = mongoose.model('users', User)
const UsernameSchema = mongoose.model('usernames', Username)



// Password hash middleware.
 
Username.pre('save', function save(next) {
    const user = this
    if (!user.isModified('password')) { return next() }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { return next(err) }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) { return next(err) }
        user.password = hash
        next()
      })
    })
  })
  
  
  // Helper method for validating user's password.
  
  Username.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      cb(err, isMatch)
    })
  }
module.exports = { googleUser: UserSchema, userName: UsernameSchema }