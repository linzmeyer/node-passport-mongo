const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


// /register
router.get('/register', (req, res) => res.render("register.ejs") );

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = handleUserRegistrationValidation( req.body );

  if ( errors.length > 0 ) {
    res.render('register.ejs', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation passed
    const User = require('../models/User');
    User.findOne({email: email})
    .then( user => {

      if ( user ) {
        errors.push({message: `There is already a user registered with the email ${email}.`});
        res.render('register.ejs', { errors, name, email, password, password2 });
      } else {
        const new_user = new User({ name, email, password });
        // Hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(new_user.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            // Set password to hash
            new_user.password = hash;
            new_user.save()
            .then(user => {
              req.flash('success_message', "You are now registered and can now log in.");
              res.redirect('/users/login');
            })
            .catch(err => console.log(err));
          });
        });
      }
    })
  }

});

// /login
router.get('/login', (req, res) => {

  res.render("login.ejs");
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_message', 'You are logged out.');
  res.redirect('/users/login');
})

module.exports = router;


function handleUserRegistrationValidation(req_body) {f
  let errors = [];
  const { name, email, password, password2 } = req_body;
  if ( !name || !email || !password || ! password2 ) {
    errors.push({message: "Please fill in all fields."})
  }
  if ( password !== password2 ) {
    errors.push({ message: "Password confirmation does not match."})
  }
  if ( password.length < 6 ) {
    errors.push({ message: "Password should be at least 6 characters."})
  }
  return errors;
}
