const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { auth, db } = require('./db/db.connection')
const {userSchema, users }= require('./db/user.model')
var user = '';

function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    auth.getUserByEmail(email).then(async function(user) {
       user = user.toJSON();
       userSchema.uid = user.uid;
       userSchema.email = user.email;
       userSchema.emailVerified = user.emailVerified;
       userSchema.displayName = user.displayName;
       users.push(userSchema);
      try {
        if (await bcrypt.compare(password, userSchema.uid)) {
          return done(null, user)
        } else {  
          return done(null, false, { message: 'Password incorrect' })
        }
      } catch (e) {
        return done(e)
      }
      })
    if (userSchema == null) {
      return done(null, false, { message: 'No user with that email' })
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.uid))
  passport.deserializeUser((id, done) => {
    return done(null, users)
  })
}

module.exports = initialize