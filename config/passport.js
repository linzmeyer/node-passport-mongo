const LocalStategy = require('passport-local');
const bcrypt = require('bcryptjs');

// Load user modal
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStategy({usernameField: 'email'}, (email, password, done) => {
      // Match User
      User.findOne( { email: email } )
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered.' } );
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            throw err;
          }

          if (isMatch) {
            return done(null, user);  // error, user
          } else {
            return done(null, false, { message: 'Password incorrect'});
          }
        });
      })
      .catch(err => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
