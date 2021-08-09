require('dotenv').config({path: './.env'});
const config = require('./config/config');

const express = require('express');
const app = express();

// passport config
const passport = require('passport');
require('./config/passport')(passport);

const express_layouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const set_flash_messages = require('./utils/set_flash_messages');


// connect to Mongo DB
mongoose.connect(config.mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then( () => {
  console.log("Mongo DB connected...");
})
.catch( (err) => {
  console.log(err);
});


// EJS
app.use(express_layouts);
app.set('view engine', 'ejs');


// body parser
app.use(express.urlencoded( { extended: false } ));

// express-session middleware
app.use(session({
  secret: config.server_session_secret,
  resave: true,
  saveUninitialized: true,
  cookie: {}
}));

if ( app.get('env') === 'production' ) {
  app.set( 'trust proxy', 1 ) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// Global vars
app.use(set_flash_messages);

// routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users_router'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on port ${PORT}...`) );
